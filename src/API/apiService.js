const BASE_URL = import.meta.env.VITE_BASE_URL;
const TOUR_API_URL = `${BASE_URL}`;
const AUTH_API_URL = `${BASE_URL}/api/auth`;
const ORDER_API_URL = `${BASE_URL}/orders/api`;
const ORDER_API = `${BASE_URL}/orders/`;
export const FAVORITE_API_URL = `${BASE_URL}/favorite-tours`;

export const fetchTours = async (tourTypeId) => {
  try {
    const response = await fetch(`${TOUR_API_URL}/tours/api`); // Đảm bảo API URL lấy các tour được phê duyệt
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách tour');
    }
    const data = await response.json();

    // Lọc theo tourTypeId nếu có và xử lý availabilities
    const tours = tourTypeId
      ? data.filter(tour => {
          const id = tour.tourType?._id || tour.tourType;
          return id === tourTypeId;
        })
      : data;

    return tours.map(tour => ({
      ...tour,
      availabilities: (tour.availabilities || []).map(item => ({
        date: item.date ? new Date(item.date).toLocaleDateString() : '',
        availableSeats: item.availableSeats
      }))
    }));
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
};



export const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('userNav')) || {};
    return (
      user.accessToken ||
      user?.token?.accessToken ||
      user?.token ||
      user?.accesstoken ||
      null
    );
  } catch (e) {
    return null;
  }
};

export const fetchTourById = async (id) => {
  try {
    const response = await fetch(`${TOUR_API_URL}/tours/api/${id}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin tour');
    }

    const data = await response.json();

    // Kiểm tra và lấy availability từ dữ liệu trả về, giữ lại _id và date gốc
    const availabilities = data.availabilities || [];
    return {
      ...data,
      availabilities: availabilities.map(item => ({
        _id: item._id,
        date: new Date(item.date).toLocaleDateString(),
        rawDate: item.date,
        availableSeats: item.availableSeats
      }))
    };
  } catch (error) {
    console.error('Error fetching tour by ID:', error);
    throw error;
  }
};

export const quotePromotion = async ({
  tourId,
  departureId,
  bookingDate,
  adultCount,
  childCount,
  adultPrice,
  childPrice,
  code,
  token,
}) => {
  const currentToken = token || getAuthToken();
  if (!currentToken) {
    throw new Error('Vui lòng đăng nhập để áp dụng ưu đãi.');
  }

  const payload = {
    tourId,
    adultCount: Math.max(0, Number(adultCount) || 0),
    childCount: Math.max(0, Number(childCount) || 0),
    ...(departureId ? { departureId } : {}),
    ...(bookingDate ? { bookingDate } : {}),
    ...(adultPrice !== undefined && adultPrice !== null ? { adultPrice: Number(adultPrice) } : {}),
    ...(childPrice !== undefined && childPrice !== null ? { childPrice: Number(childPrice) } : {}),
    ...(code ? { code: String(code).trim().toUpperCase() } : {}),
  };

  const response = await fetch(`${BASE_URL}/api/promotions/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Mã ưu đãi không hợp lệ');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};


export const fetchTourTypes = async () => {
  try {
    const response = await fetch(`${TOUR_API_URL}/tourtypes/api`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách loại tour');
    }
    const data = await response.json();
    return data.tourTypes || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching tour types:', error);
    throw error;
  }
};

export const fetchDestinations = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${TOUR_API_URL}/destinations/api?${query}` : `${TOUR_API_URL}/destinations/api`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách điểm đến');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.destinations || []);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách điểm đến:', error);
    throw error;
  }
};

export const searchTours = async (params = {}) => {
  try {
    // Hỗ trợ cả trường hợp truyền query string đơn thuần hoặc object params
    const queryParams = new URLSearchParams();

    if (typeof params === 'string') {
      if (params.trim()) queryParams.append('query', params.trim());
    } else if (typeof params === 'object' && params !== null) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          queryParams.append(key, value);
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/tours/search${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Không thể tìm kiếm tour');
    }
    const data = await response.json();

    // Chuẩn hóa kết quả trả về
    if (Array.isArray(data)) {
      return {
        data: data,
        total: data.length,
        totalPages: 1,
        page: 1,
        limit: data.length,
      };
    }

    return {
      data: data.data || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
      limit: data.limit || 10,
    };
  } catch (error) {
    console.error('Error searching tours:', error);
    throw error;
  }
};

export const checkUserEmail = async (email) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    if (!response.ok) {
      throw new Error('Không thể kiểm tra email người dùng');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user email:', error);
    throw error;
  }
};

export const customerInfo = async (contactInfo, orderData) => {
  try {
    const customerInfoPayload = {
      customerInfo: {
        fullName: contactInfo.contactName,
        phone: contactInfo.contactPhone,
        email: contactInfo.contactEmail,
      },
      ...orderData,
    };

    const response = await fetch(`${ORDER_API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerInfoPayload),
    });

    if (!response.ok) {
      throw new Error('Không thể lưu thông tin liên hệ');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving contact information:', error);
    throw error;
  }
};

export const checkIfFavorite = async (userId, tourId) => {
  try {
    const response = await fetch(`${FAVORITE_API_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userId, tour: tourId }),
    });

    if (!response.ok) {
      throw new Error("Không thể kiểm tra trạng thái yêu thích");
    }

    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite:', error);
    throw error;
  }
};

export const toggleFavoriteTour = async (userId, tourId, isFavorite) => {
  try {
    const response = await fetch(`${FAVORITE_API_URL}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userId, tour: tourId, isFavorite }),
    });

    if (!response.ok) {
      throw new Error("Không thể thêm/xóa tour khỏi danh sách yêu thích");
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite tour:', error);
    throw error;
  }
};

// Hàm để lấy danh sách các tour yêu thích của người dùng
export const fetchFavoriteTours = async (userId) => {
  try {
    const response = await fetch(`${FAVORITE_API_URL}/${userId}`);
    if (!response.ok) {
      throw new Error("Đã xảy ra lỗi khi lấy danh sách tour yêu thích");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite tours:", error);
    throw error;
  }
};

// Hàm để xóa tour khỏi danh sách yêu thích
export const removeFavoriteTour = async (userId, tourId) => {
  try {
    const response = await fetch(`${FAVORITE_API_URL}/${userId}/${tourId}`, { // Sử dụng userId và tourId thực tế
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi nếu có
      throw new Error(errorData.message || "Đã xảy ra lỗi khi xóa tour yêu thích");
    }
  } catch (error) {
    console.error("Error removing favorite tour:", error);
    throw error;
  }
};
export const connectWallet = async (authToken) => {
  try {
    const response = await fetch(`${ORDER_API}/connect_wallet`, {
      method: 'GET', // Using GET method
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Add the Bearer token here
      },
      credentials: 'include', // Include cookies if authentication is needed
    });

    if (!response.ok) {
      throw new Error('Không thể kết nối ví');
    }

    return await response.json(); // Return the response from the server
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const fetchOrderDetail = async (orderId) => {
  try {
    const user = JSON.parse(localStorage.getItem('userNav')) || {};
    const token =
      user.accessToken ||
      user?.token?.accessToken ||
      user?.token ||
      user?.accesstoken;

    const response = await fetch(`${BASE_URL}/orders/api/detail/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể lấy thông tin chi tiết vé');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order detail:', error);
    throw error;
  }
};