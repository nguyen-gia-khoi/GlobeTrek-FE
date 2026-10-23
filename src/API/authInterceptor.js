import axios from 'axios';
import { message } from 'antd';
import store from '../redux/store';
import { logout } from '../redux/authSlice';

let isLoggingOut = false;
let expirationTimer = null;

/**
 * An toàn giải mã JWT payload mà không cần thư viện ngoài
 */
export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Kiểm tra token đã hết hạn chưa (có trừ 5s buffer)
 */
export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 <= Date.now() + 5000;
};

/**
 * Lấy accessToken hiện tại từ localStorage
 */
export const getCurrentToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('userNav')) || {};
    return (
      stored.accessToken ||
      stored?.token?.accessToken ||
      stored?.token ||
      stored?.accesstoken ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Xử lý tự động đăng xuất khi hết hạn token
 */
export const handleAuthExpired = (customMsg) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  if (expirationTimer) {
    clearTimeout(expirationTimer);
    expirationTimer = null;
  }

  // 1. Xóa thông tin xác thực lưu ở client
  localStorage.removeItem('userNav');
  localStorage.removeItem('token');
  sessionStorage.removeItem('userNav');

  // 2. Dispatch Redux logout action
  try {
    store.dispatch(logout());
  } catch (e) {
    console.error('Error dispatching logout action:', e);
  }

  // 3. Hiển thị thông báo thân thiện tới người dùng
  message.warning(
    customMsg || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    3
  );

  // 4. Phát custom event để các component header/modal cập nhật trạng thái ngay
  window.dispatchEvent(new CustomEvent('auth:expired'));

  // 5. Điều hướng hoặc reload lại sau 1.2s để người dùng kịp đọc thông báo
  setTimeout(() => {
    isLoggingOut = false;
    const protectedPaths = ['/setplace', '/profile', '/profileUser', '/transaction', '/payment'];
    const currentPath = window.location.pathname.toLowerCase();
    const isProtected = protectedPaths.some((p) => currentPath.includes(p.toLowerCase()));

    if (isProtected) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  }, 1200);
};

/**
 * Thiết lập bộ hẹn giờ tự động logout theo trường `exp` của JWT
 */
export const scheduleTokenExpirationTimer = () => {
  if (expirationTimer) {
    clearTimeout(expirationTimer);
    expirationTimer = null;
  }

  const token = getCurrentToken();
  if (!token) return;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return;

  const timeLeft = payload.exp * 1000 - Date.now();

  if (timeLeft <= 5000) {
    // Đã hết hạn hoặc sắp hết hạn trong 5 giây
    handleAuthExpired();
  } else {
    // Hẹn giờ kích hoạt auto-logout ngay khi token hết hạn
    expirationTimer = setTimeout(() => {
      handleAuthExpired('Phiên đăng nhập của bạn đã hết hạn.');
    }, timeLeft);
  }
};

/**
 * Kiểm tra xem URL có phải là endpoint đăng nhập / đăng ký không (tránh false positive)
 */
const isAuthEndpoint = (url) => {
  if (!url) return false;
  const str = String(url).toLowerCase();
  return (
    str.includes('/api/auth/signin') ||
    str.includes('/api/auth/signup') ||
    str.includes('/api/auth/login') ||
    str.includes('/api/auth/verify-account') ||
    str.includes('/api/auth/forgot-password')
  );
};

/**
 * Cài đặt Interceptor cho Axios
 */
const setupAxiosInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url;
      const currentToken = getCurrentToken();

      if (currentToken && !isAuthEndpoint(url)) {
        if (status === 401) {
          handleAuthExpired(error.response?.data?.message);
        } else if (status === 403) {
          const msg = (error.response?.data?.message || '').toLowerCase();
          if (msg.includes('token') || msg.includes('expired') || msg.includes('invalid')) {
            handleAuthExpired(error.response?.data?.message);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Cài đặt Interceptor cho Fetch API toàn cầu (Global Fetch Wrapper)
 */
const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const url = args[0] ? String(args[0]) : '';
    const currentToken = getCurrentToken();

    // Nếu token đã hết hạn trước khi gửi request (và không phải API auth), logout ngay
    if (currentToken && !isAuthEndpoint(url) && isTokenExpired(currentToken)) {
      handleAuthExpired('Phiên đăng nhập đã hết hạn trước khi gửi yêu cầu.');
      return Promise.reject(new Error('Token expired'));
    }

    try {
      const response = await originalFetch(...args);

      if (currentToken && !isAuthEndpoint(url)) {
        // Kiểm tra nếu bị redirect sang trang login
        if (response.redirected && response.url.includes('/api/auth/login')) {
          handleAuthExpired();
          return response;
        }

        // Bắt lỗi 401 Unauthorized
        if (response.status === 401) {
          try {
            const clone = response.clone();
            const data = await clone.json().catch(() => ({}));
            handleAuthExpired(data?.message);
          } catch {
            handleAuthExpired();
          }
        }

        // Bắt lỗi 403 Token invalid / expired
        if (response.status === 403) {
          try {
            const clone = response.clone();
            const data = await clone.json().catch(() => ({}));
            const msg = (data?.message || '').toLowerCase();
            if (msg.includes('token') || msg.includes('expired') || msg.includes('invalid')) {
              handleAuthExpired(data?.message);
            }
          } catch {
            // Không làm gì nếu không parse được
          }
        }
      }

      return response;
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Hàm khởi tạo tất cả Interceptors và Timer
 */
export const setupAuthInterceptors = () => {
  setupAxiosInterceptor();
  setupFetchInterceptor();
  scheduleTokenExpirationTimer();

  // Lắng nghe khi người dùng đăng nhập thành công ở tab khác hoặc lưu mới userNav
  window.addEventListener('storage', (e) => {
    if (e.key === 'userNav') {
      scheduleTokenExpirationTimer();
    }
  });
};

export default setupAuthInterceptors;
