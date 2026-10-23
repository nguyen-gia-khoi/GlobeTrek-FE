import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChevronRight,
  faCheck,
  faClock,
  faReceipt,
  faLocationDot,
  faCalendarCheck,
  faShieldHalved,
  faHeadset,
  faCircleCheck,
  faLock,
  faCreditCard,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Header from '../header1/Header';
import Footer from '../footer/Footer';
import { fetchTourById, quotePromotion, getAuthToken } from '../API/apiService';
import VoucherSection from './VoucherSection';

const VITE_REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [loading, setLoading] = useState(false);
  const [tour, setTour] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);

  const bookingData = useMemo(() => JSON.parse(localStorage.getItem('bookingData')) || {}, []);
  const user = useMemo(() => JSON.parse(localStorage.getItem('userNav')) || {}, []);
  const customerInfo = useMemo(() => JSON.parse(localStorage.getItem('customerInfo')) || {}, []);
  const passengerInfo = useMemo(() => JSON.parse(localStorage.getItem('passengerInfo')) || {}, []);
  const selectedDates = useMemo(() => JSON.parse(localStorage.getItem('selectedDates')) || [], []);

  // Quản lý báo giá (Quote) & Mã ưu đãi (Voucher)
  const [appliedCode, setAppliedCode] = useState(() => bookingData.code || '');
  const [quote, setQuote] = useState(() => ({
    originalTotal: bookingData.originalTotal || bookingData.totalPrice || 0,
    discountAmount: bookingData.discountAmount || 0,
    totalValue: bookingData.totalValue !== undefined ? bookingData.totalValue : (bookingData.totalPrice || 0),
    adultPrice: bookingData.adultPrice || bookingData.prices?.adultPrice || 0,
    childPrice: bookingData.childPrice || bookingData.prices?.childPrice || 0,
    promotion: bookingData.promotion || null,
  }));
  const [quoteLoading, setQuoteLoading] = useState(false);

  const token =
    user.accessToken ||
    user?.accessToken ||
    user?.accesstoken ||
    user?.token?.accessToken ||
    user?.token ||
    getAuthToken();

  // 1. Tải thông tin tour
  useEffect(() => {
    window.scrollTo(0, 0);

    const loadTour = async () => {
      setTourLoading(true);
      try {
        if (id) {
          const tourData = await fetchTourById(id);
          setTour(tourData);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setTourLoading(false);
      }
    };

    loadTour();
  }, [id]);

  // 2. Cập nhật tourId vào bookingData nếu chưa có
  useEffect(() => {
    if (id && bookingData) {
      const bookingDataWithTourId = { ...bookingData, tourId: id };
      localStorage.setItem('bookingData', JSON.stringify(bookingDataWithTourId));
    }
  }, [id, bookingData]);

  // 3. Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      message.error('Thời gian thanh toán đã hết hạn, vui lòng thực hiện lại đơn đặt.');
      navigate(`/bodyPay/${id}`);
    }
  }, [timeRemaining, navigate, id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 4. Xử lý PayPal Callback từ URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');
    const paypalToken = urlParams.get('token');

    const pendingOrder = localStorage.getItem('pendingPayPalOrder');

    if (paypalToken && pendingOrder) {
      const orderDetails = JSON.parse(pendingOrder);

      const confirmPayPalPayment = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${VITE_BASE_URL}/orders/api/paypal/capture-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              orderID: orderDetails.orderId,
              paypalOrderId: paypalToken,
              paymentId: paymentId,
              payerId: payerId,
            }),
          });

          const contentType = response.headers.get('content-type') || '';
          if (response.redirected || !contentType.includes('application/json')) {
            throw new Error('Phiên xác nhận thanh toán phản hồi không hợp lệ hoặc đã hết hạn.');
          }

          const data = await response.json();

          if (response.ok && data.success) {
            message.success('Thanh toán qua PayPal thành công!');
            localStorage.removeItem('pendingPayPalOrder');
            localStorage.removeItem('bookingData');
            if (token || user?._id || user?.userId) {
              navigate('/setplace');
            } else {
              navigate(`/order-detail/${orderDetails.orderId}`);
            }
          } else {
            throw new Error(data.message || 'Xác nhận thanh toán thất bại');
          }
        } catch (error) {
          console.error('PayPal Confirmation Error:', error);
          message.error('Xác nhận thanh toán thất bại. Vui lòng liên hệ hỗ trợ.');
          navigate(`/Payment/${id}`);
        } finally {
          setLoading(false);
        }
      };

      confirmPayPalPayment();
    }
  }, [navigate, id, token, user]);

  // 5. Thực hiện gửi yêu cầu tạo PayPal Payment
  const processPayPalPayment = async (orderData) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/orders/api/paypal/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderID: orderData.orderId,
          amount: orderData.totalPrice,
          returnUrl: `${VITE_REDIRECT_URL}/Payment/${id}`,
          cancelUrl: `${VITE_REDIRECT_URL}/Payment/${id}`,
          customerInfo: orderData.customerInfo,
          orderDetails: {
            tourId: orderData.tour,
            adultCount: orderData.adultCount,
            childCount: orderData.childCount,
            selectedDates: orderData.selectedDates,
          },
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.redirected || !contentType.includes('application/json')) {
        throw new Error('Máy chủ phản hồi trang web thay vì dữ liệu JSON. Vui lòng kiểm tra lại phiên đăng nhập.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể khởi tạo phiên thanh toán PayPal');
      }

      if (data.paypalUrl) {
        localStorage.setItem(
          'pendingPayPalOrder',
          JSON.stringify({
            orderId: orderData.orderId,
            paymentId: data.paymentId,
            paypalOrderId: data.paypalOrderId,
            amount: orderData.totalPrice,
            status: 'pending',
          })
        );
        message.loading('Đang chuyển hướng đến cổng thanh toán bảo mật PayPal...');
        window.location.href = data.paypalUrl;
      } else {
        throw new Error('Không nhận được đường dẫn thanh toán từ PayPal');
      }
    } catch (error) {
      console.error('PayPal Payment Error:', error);
      message.error(error.message || 'Lỗi trong quá trình kết nối PayPal. Vui lòng thử lại.');
    }
  };

  // 6. Xử lý áp dụng voucher trong màn hình Payment
  const handleApplyVoucher = async (codeToApply) => {
    const currentToken =
      user.accessToken ||
      user?.accessToken ||
      user?.accesstoken ||
      user?.token?.accessToken ||
      user?.token ||
      getAuthToken();

    if (!currentToken) {
      message.warning('Vui lòng đăng nhập để áp dụng mã giảm giá.');
      return;
    }

    if (!codeToApply.trim()) return;

    setQuoteLoading(true);
    try {
      const bookingDateValue =
        (selectedDates && selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null) ||
        bookingData.selectedDate ||
        localStorage.getItem('selectedDate') ||
        new Date().toISOString();

      const res = await quotePromotion({
        tourId: id || bookingData.tourId,
        bookingDate: bookingDateValue,
        adultCount: bookingData.adultCount || 1,
        childCount: bookingData.childCount || 0,
        adultPrice: bookingData.adultPrice || bookingData.prices?.adultPrice || 0,
        childPrice: bookingData.childPrice || bookingData.prices?.childPrice || 0,
        code: codeToApply.trim().toUpperCase(),
        token: currentToken,
      });

      const normalized = codeToApply.trim().toUpperCase();
      setAppliedCode(normalized);
      setQuote(res);

      const updatedBooking = {
        ...bookingData,
        code: normalized,
        originalTotal: res.originalTotal,
        discountAmount: res.discountAmount,
        totalValue: res.totalValue,
        totalPrice: res.totalValue,
        promotion: res.promotion,
      };
      localStorage.setItem('bookingData', JSON.stringify(updatedBooking));

      message.success(`Áp dụng mã ${normalized} thành công!`);
    } catch (error) {
      message.error(error.message || 'Mã giảm giá không hợp lệ hoặc đã hết lượt.');
    } finally {
      setQuoteLoading(false);
    }
  };

  // 7. Xử lý gỡ bỏ voucher
  const handleRemoveVoucher = async () => {
    setAppliedCode('');
    const currentToken =
      user.accessToken ||
      user?.accessToken ||
      user?.accesstoken ||
      user?.token?.accessToken ||
      user?.token ||
      getAuthToken();

    if (currentToken) {
      setQuoteLoading(true);
      try {
        const bookingDateValue =
          (selectedDates && selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null) ||
          bookingData.selectedDate ||
          localStorage.getItem('selectedDate') ||
          new Date().toISOString();

        const res = await quotePromotion({
          tourId: id || bookingData.tourId,
          bookingDate: bookingDateValue,
          adultCount: bookingData.adultCount || 1,
          childCount: bookingData.childCount || 0,
          adultPrice: bookingData.adultPrice || bookingData.prices?.adultPrice || 0,
          childPrice: bookingData.childPrice || bookingData.prices?.childPrice || 0,
          token: currentToken,
        });

        setQuote(res);
        const updatedBooking = {
          ...bookingData,
          code: null,
          originalTotal: res.originalTotal,
          discountAmount: res.discountAmount,
          totalValue: res.totalValue,
          totalPrice: res.totalValue,
          promotion: res.promotion,
        };
        localStorage.setItem('bookingData', JSON.stringify(updatedBooking));
        message.info('Đã gỡ mã giảm giá.');
      } catch {
        const baseTotal =
          (bookingData.adultCount || 1) * (bookingData.adultPrice || 0) +
          (bookingData.childCount || 0) * (bookingData.childPrice || 0);
        const fallbackQuote = {
          originalTotal: baseTotal,
          discountAmount: 0,
          totalValue: baseTotal,
          promotion: null,
        };
        setQuote(fallbackQuote);
        localStorage.setItem(
          'bookingData',
          JSON.stringify({
            ...bookingData,
            code: null,
            originalTotal: baseTotal,
            discountAmount: 0,
            totalValue: baseTotal,
            totalPrice: baseTotal,
            promotion: null,
          })
        );
        message.info('Đã gỡ mã giảm giá.');
      } finally {
        setQuoteLoading(false);
      }
    }
  };

  // 8. Xử lý tạo Order & Thanh toán (Hỗ trợ cả khách đã đăng nhập và khách vãng lai)
  const handlePaymentSubmit = async () => {
    if (!bookingData || (!bookingData.totalPrice && !quote?.totalValue)) {
      message.error('Dữ liệu đặt chỗ không hợp lệ. Vui lòng quay lại bước trước.');
      return;
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      message.error('Vui lòng hoàn tất thông tin khách hàng (họ tên, email, số điện thoại) ở bước trước.');
      return;
    }

    const bookingDateValue =
      (selectedDates && selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null) ||
      bookingData.selectedDate ||
      localStorage.getItem('selectedDate') ||
      new Date().toISOString();

    const finalCode = appliedCode || bookingData.code || null;

    // Theo API contract: Giữ body đặt tour hiện tại và thêm code nếu khách đã áp dụng mã. Không gửi totalValue.
    const orderData = {
      signature: user?.signature || null,
      userId: user?._id || user?.userId || null,
      tour: id || bookingData.tourId,
      adultCount: bookingData.adultCount || 1,
      childCount: bookingData.childCount || 0,
      paymentMethod: 'paypal',
      selectedDates: bookingDateValue,
      passengerInfo,
      customerInfo: {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
      },
      adultPrice: bookingData.adultPrice || bookingData.prices?.adultPrice || 0,
      childPrice: bookingData.childPrice || bookingData.prices?.childPrice || 0,
      bookingDate: bookingDateValue,
      orders: bookingData.orders || [],
      ...(finalCode ? { code: finalCode } : {}),
    };

    try {
      setLoading(true);

      const currentUser = JSON.parse(localStorage.getItem('userNav')) || {};
      const currentToken =
        currentUser.accessToken ||
        currentUser.token?.accessToken ||
        currentUser.token ||
        currentUser.accesstoken ||
        token;

      const response = await fetch(`${VITE_BASE_URL}/orders/api/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        },
        body: JSON.stringify({
          ...orderData,
          userId: currentUser._id || currentUser.userId || orderData.userId,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.redirected || !contentType.includes('application/json')) {
        throw new Error('Phiên đăng nhập đã hết hạn hoặc bạn cần đăng nhập lại để tiếp tục thanh toán.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi tạo đơn hàng (Mã: ${response.status})`);
      }

      const data = await response.json();
      const savedOrder = data.order;
      const orderId = savedOrder?._id || data.orderId;
      localStorage.setItem('orderID', orderId);

      // Server tính lại từ đầu và trả về order.totalValue. PayPal trừ theo order.totalValue.
      const finalAmount = savedOrder?.totalValue ?? data.quote?.totalValue ?? totalAmount;

      // Chuyển sang thanh toán PayPal
      await processPayPalPayment({ ...orderData, orderId, totalPrice: finalAmount });
    } catch (error) {
      console.error('Create Order Error:', error);
      message.error(error.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // 9. Định dạng ngày hiển thị
  const formattedDate = useMemo(() => {
    const rawDate =
      (selectedDates && selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null) ||
      bookingData.selectedDate ||
      localStorage.getItem('selectedDate');

    if (!rawDate) return 'Theo lịch đã chọn';
    const d = new Date(rawDate);
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = dayNames[d.getDay()];
    return `${dayName}, ${d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  }, [selectedDates, bookingData]);

  const totalAmount = quote?.totalValue ?? bookingData.totalValue ?? bookingData.totalPrice ?? 0;
  const originalAmount = quote?.originalTotal ?? bookingData.originalTotal ?? totalAmount;
  const discountAmount = quote?.discountAmount ?? bookingData.discountAmount ?? 0;
  const usdAmount = (totalAmount / 25000).toFixed(2);

  if (tourLoading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
        <Header />
        <main className="pt-28 pb-16">
          <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto">
            <Skeleton height={40} width={250} className="mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <Skeleton height={300} className="rounded-2xl" />
              </div>
              <div className="lg:col-span-5">
                <Skeleton height={400} className="rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-16">
        <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto">
          {/* 1. Header Navigation & Stepper */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Link
              to={`/BookingForm/${id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#4CA771] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs group-hover:border-[#4CA771] shadow-xs">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span>Quay lại thông tin khách</span>
            </Link>

            {/* Stepper Progress */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#4CA771] flex items-center justify-center text-xs font-bold">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span>1. Chọn số vé</span>
              </div>

              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" />

              <div className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#4CA771] flex items-center justify-center text-xs font-bold">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span>2. Thông tin khách</span>
              </div>

              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" />

              <div className="flex items-center gap-1.5 text-[#4CA771]">
                <span className="w-6 h-6 rounded-full bg-[#4CA771] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  3
                </span>
                <span className="font-bold">3. Thanh toán</span>
              </div>
            </div>
          </div>

          {/* 2. Thanh Countdown Timer đếm ngược giữ chỗ */}
          <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4CA771] text-white flex items-center justify-center text-lg shadow-sm">
                <FontAwesomeIcon icon={faClock} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Giữ chỗ đơn hàng của bạn</h4>
                <p className="text-xs text-slate-600">
                  Vui lòng hoàn tất thanh toán trước khi hết thời gian để bảo đảm giá vé và chỗ ngồi.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-white rounded-xl border border-emerald-300 shadow-xs flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Thời gian còn lại:</span>
              <span className="text-lg font-extrabold text-[#4CA771] font-mono tracking-wider">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* 3. Layout 2 Cột */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (7 CỘT): Chọn phương thức thanh toán */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Phương thức thanh toán</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Chúng tôi hỗ trợ cổng thanh toán quốc tế PayPal an toàn, nhanh chóng và bảo mật cao.
                </p>

                {/* PayPal Payment Option Card */}
                <div
                  onClick={() => setSelectedPaymentMethod('paypal')}
                  className="relative p-5 sm:p-6 rounded-2xl border-2 border-[#4CA771] bg-emerald-50/20 shadow-sm cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs flex-shrink-0">
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                        alt="PayPal"
                        className="h-9 object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">Cổng thanh toán PayPal</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-[#4CA771] text-[11px] font-bold rounded-full">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Thanh toán bảo mật quốc tế bằng tài khoản PayPal, thẻ Visa, MasterCard hoặc thẻ quốc tế.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="w-7 h-7 rounded-full bg-[#4CA771] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  </div>
                </div>

                {/* Cam kết bảo mật */}
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#4CA771] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Bảo mật giao dịch</span>
                      <span>Mã hóa SSL 256-bit chuẩn bảo mật cao nhất hiện nay.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#4CA771] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Chính sách bảo vệ</span>
                      <span>Hoàn tiền 100% nếu phát sinh lỗi hủy tour theo điều khoản quy định.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin hành khách & liên hệ tóm tắt */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Thông tin nhận vé & Hành khách</span>
                  <Link
                    to={`/BookingForm/${id}`}
                    className="text-xs font-bold text-[#4CA771] hover:underline"
                  >
                    Thay đổi
                  </Link>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Người liên hệ:</span>
                    <span className="font-bold text-slate-800">{customerInfo.fullName || 'Chưa có'}</span>
                    <span className="text-slate-500 block">{customerInfo.phone || ''} • {customerInfo.email || ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Hành khách đại diện:</span>
                    <span className="font-bold text-slate-800">
                      {passengerInfo.title ? `${passengerInfo.title} ` : ''}
                      {passengerInfo.fullName || customerInfo.fullName || 'Chưa có'}
                    </span>
                    {passengerInfo.specialRequest && (
                      <span className="text-emerald-700 block italic mt-0.5">
                        Yêu cầu: {passengerInfo.specialRequest}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (5 CỘT): Tóm tắt chi phí thanh toán */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sticky top-28">
                <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} className="text-[#4CA771]" />
                  <span>Chi tiết thanh toán</span>
                </h3>

                {/* Tour Info Snippet */}
                {tour && (
                  <div className="py-4 border-b border-slate-100 space-y-3">
                    <div className="flex gap-3.5">
                      <img
                        src={
                          tour.images?.[0] ||
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={tour.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col justify-between min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {tour.title}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
                          <span className="truncate">{tour.location || 'Việt Nam'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ngày khởi hành */}
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarCheck} className="text-[#4CA771]" />
                        <span>Khởi hành: <strong>{formattedDate}</strong></span>
                      </div>
                      {tour.duration && (
                        <span className="font-semibold text-slate-500">{tour.duration} ngày</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Voucher / Mã giảm giá */}
                <VoucherSection
                  appliedCode={appliedCode}
                  onApplyCode={handleApplyVoucher}
                  onRemoveCode={handleRemoveVoucher}
                  promotion={quote?.promotion || null}
                  discountAmount={discountAmount}
                  loading={quoteLoading}
                  isLoggedIn={Boolean(token)}
                />

                {/* Chi tiết tính tiền */}
                <div className="py-4 border-b border-slate-100 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Vé người lớn ({bookingData.adultCount || 1}x):</span>
                    <span className="font-semibold text-slate-800">
                      {((bookingData.adultCount || 1) * (bookingData.adultPrice || bookingData.prices?.adultPrice || 0)).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  {(bookingData.childCount || 0) > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Vé trẻ em ({bookingData.childCount}x):</span>
                      <span className="font-semibold text-slate-800">
                        {(bookingData.childCount * (bookingData.childPrice || bookingData.prices?.childPrice || 0)).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Bảo hiểm du lịch trọn gói:</span>
                    <span className="font-bold text-emerald-600">Miễn phí</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Thuế GTGT & Phí dịch vụ:</span>
                    <span className="font-bold text-emerald-600">Đã bao gồm</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                      <div className="min-w-0 pr-2">
                        <span className="font-bold block truncate">
                          {quote?.promotion?.kind === 'code' || appliedCode
                            ? `Mã ưu đãi: ${quote?.promotion?.code || appliedCode}`
                            : `Ưu đãi tự động: ${quote?.promotion?.name || ''}`}
                        </span>
                        {quote?.promotion?.discountType === 'percent' && (
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            Giảm {quote.promotion.discountValue}% trên tổng đơn
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-sm text-[#4CA771] whitespace-nowrap">
                        -{discountAmount.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}
                </div>

                {/* Tổng thanh toán */}
                <div className="pt-4 pb-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-slate-800">Tổng thanh toán:</span>
                    <div className="text-right">
                      {discountAmount > 0 && (
                        <span className="line-through text-xs text-slate-400 block font-semibold">
                          {originalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-[#4CA771] block">
                        {totalAmount.toLocaleString('vi-VN')} ₫
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        (Tương đương khoảng ~ ${usdAmount} USD)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút Thanh toán PayPal CTA */}
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[#4CA771] hover:bg-[#3d8b5d] disabled:bg-slate-300 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
                      <span>Đang kết nối PayPal...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} />
                      <span>Thanh toán với PayPal</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </>
                  )}
                </button>

                {/* Trust badge */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500 text-sm" />
                  <span>Bảo mật giao dịch tiêu chuẩn quốc tế PayPal</span>
                </div>

                {/* Hotline hỗ trợ */}
                <div className="mt-3 text-center">
                  <a
                    href="tel:19001234"
                    className="text-xs font-semibold text-slate-500 hover:text-[#4CA771] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <FontAwesomeIcon icon={faHeadset} />
                    <span>Hỗ trợ đặt tour: <strong>1900 1234</strong></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Payment;
