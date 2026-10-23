import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChevronRight,
  faUserCheck,
  faReceipt,
  faCalendarCheck,
  faLocationDot,
  faClock,
  faShieldHalved,
  faHeadset,
  faCreditCard,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';

import Header from '../header1/Header.jsx';
import Footer from '../footer/Footer.jsx';
import ContactInfoForm from './ContactInfoForm';
import GuestInfoForm from './GuestInfoForm';
import Map from './Map.jsx';
import ConfirmBookingModal from './ConfirmBookingModal';
import ProcessingModal from './ProcessingModal';

import { fetchTourById } from '../API/apiService';
import { useDate } from '../Context/DateContext';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useDate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [bookingData, setBookingData] = useState({
    adultCount: 1,
    childCount: 0,
    totalPrice: 0,
    adultPrice: 0,
    childPrice: 0,
    prices: { adultPrice: 0, childPrice: 0 },
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  // 1. Lấy dữ liệu từ localStorage & API
  useEffect(() => {
    window.scrollTo(0, 0);

    const storedUser = JSON.parse(localStorage.getItem('userNav'));
    if (storedUser) setUser(storedUser);

    const storedBooking = JSON.parse(localStorage.getItem('bookingData'));
    if (storedBooking) {
      setBookingData({
        adultCount: storedBooking.adultCount || 1,
        childCount: storedBooking.childCount || 0,
        totalPrice: storedBooking.totalPrice || 0,
        totalValue: storedBooking.totalValue !== undefined ? storedBooking.totalValue : (storedBooking.totalPrice || 0),
        originalTotal: storedBooking.originalTotal || storedBooking.totalPrice || 0,
        discountAmount: storedBooking.discountAmount || 0,
        code: storedBooking.code || null,
        promotion: storedBooking.promotion || null,
        adultPrice: storedBooking.adultPrice || storedBooking.prices?.adultPrice || 0,
        childPrice: storedBooking.childPrice || storedBooking.prices?.childPrice || 0,
        prices: {
          adultPrice: storedBooking.adultPrice || storedBooking.prices?.adultPrice || 0,
          childPrice: storedBooking.childPrice || storedBooking.prices?.childPrice || 0,
        },
      });

      if (storedBooking.selectedDate) {
        setSelectedDate(new Date(storedBooking.selectedDate));
      }
    }

    const loadTour = async () => {
      setLoading(true);
      try {
        const tourData = await fetchTourById(id);
        setTour(tourData);
      } catch (error) {
        console.error('Error fetching tour in BookingForm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTour();
    }
  }, [id, setSelectedDate]);

  // 2. Tính tổng tiền
  const totalAmount = useMemo(() => {
    if (bookingData.totalValue !== undefined && bookingData.totalValue !== null) {
      return bookingData.totalValue;
    }
    if (bookingData.totalPrice) return bookingData.totalPrice;
    return (
      bookingData.adultCount * (bookingData.adultPrice || 0) +
      bookingData.childCount * (bookingData.childPrice || 0)
    );
  }, [bookingData]);

  // 3. Xử lý khi nhấn "Tiếp tục thanh toán"
  const handleContinueClick = () => {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    const passengerInfo = JSON.parse(localStorage.getItem('passengerInfo'));

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      message.warning('Vui lòng kiểm tra và lưu lại Thông tin liên hệ trước khi tiếp tục.');
      return;
    }

    if (!passengerInfo || !passengerInfo.fullName) {
      message.warning('Vui lòng nhập Họ tên hành khách đại diện.');
      return;
    }

    if (bookingData.adultCount < 1) {
      message.error('Bạn cần ít nhất 1 vé người lớn để đặt tour.');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // 4. Xử lý khi xác nhận trong Modal
  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsProcessingModalOpen(true);

    setTimeout(() => {
      setIsProcessingModalOpen(false);
      navigate(`/Payment/${id}`);
    }, 1500);
  };

  // 5. Format ngày
  const formattedDate = useMemo(() => {
    if (!selectedDate) return 'Chưa chọn ngày';
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = dayNames[selectedDate.getDay()];
    return `${dayName}, ${selectedDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
        <Header />
        <main className="pt-28 pb-16">
          <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto">
            <Skeleton height={40} width={250} className="mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <Skeleton height={100} className="rounded-2xl" />
                <Skeleton height={200} className="rounded-2xl" />
                <Skeleton height={200} className="rounded-2xl" />
              </div>
              <div className="lg:col-span-5">
                <Skeleton height={420} className="rounded-2xl" />
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
          {/* 1. Nút quay lại & Thanh tiến trình đặt tour */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Link
              to={`/bodyPay/${id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#4CA771] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs group-hover:border-[#4CA771] shadow-xs">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span>Quay lại bước chọn vé</span>
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

              <div className="flex items-center gap-1.5 text-[#4CA771]">
                <span className="w-6 h-6 rounded-full bg-[#4CA771] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  2
                </span>
                <span className="font-bold">2. Thông tin khách</span>
              </div>

              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" />

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs">
                  3
                </span>
                <span>3. Thanh toán</span>
              </div>
            </div>
          </div>

          {/* 2. Layout 2 Cột Hiện Đại */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (7 CỘT): Biểu mẫu thông tin */}
            <div className="lg:col-span-7 space-y-6">
              {/* Thẻ Trạng thái đăng nhập */}
              {user && (
                <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#4CA771] flex items-center justify-center text-base font-bold">
                      <FontAwesomeIcon icon={faUserCheck} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Đang đặt chỗ bằng tài khoản
                      </span>
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {user.name || user.fullName || user.email}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Đã xác thực
                  </span>
                </div>
              )}

              {/* 1. Form thông tin liên hệ */}
              <ContactInfoForm />

              {/* 2. Form thông tin hành khách */}
              <GuestInfoForm />

              {/* 3. Điểm đón & Bản đồ vị trí */}
              <Map tour={tour} />
            </div>

            {/* CỘT PHẢI (5 CỘT): Tóm tắt đơn hàng Sticky */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sticky top-28">
                <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} className="text-[#4CA771]" />
                  <span>Chi tiết đặt tour</span>
                </h3>

                {/* Tour info snippet */}
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

                {/* Chi tiết tính tiền */}
                <div className="py-4 border-b border-slate-100 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Vé người lớn ({bookingData.adultCount}x):</span>
                    <span className="font-semibold text-slate-800">
                      {(bookingData.adultCount * (bookingData.adultPrice || 0)).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  {bookingData.childCount > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Vé trẻ em ({bookingData.childCount}x):</span>
                      <span className="font-semibold text-slate-800">
                        {(bookingData.childCount * (bookingData.childPrice || 0)).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Bảo hiểm du lịch trọn gói:</span>
                    <span className="font-bold text-emerald-600">Miễn phí</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Thuế & Phí dịch vụ:</span>
                    <span className="font-bold text-emerald-600">Đã bao gồm</span>
                  </div>

                  {bookingData.discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                      <div className="min-w-0 pr-2">
                        <span className="font-bold block truncate">
                          {bookingData.promotion?.kind === 'code' || bookingData.code
                            ? `Mã ưu đãi: ${bookingData.promotion?.code || bookingData.code}`
                            : `Ưu đãi tự động: ${bookingData.promotion?.name || ''}`}
                        </span>
                        {bookingData.promotion?.discountType === 'percent' && (
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            Giảm {bookingData.promotion.discountValue}% trên tổng đơn
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-sm text-[#4CA771] whitespace-nowrap">
                        -{bookingData.discountAmount.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}
                </div>

                {/* Tổng thanh toán */}
                <div className="pt-4 pb-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-slate-800">Tổng thanh toán:</span>
                    <div className="text-right">
                      {bookingData.discountAmount > 0 && (
                        <span className="line-through text-xs text-slate-400 block font-semibold">
                          {(bookingData.originalTotal || (bookingData.adultCount * (bookingData.adultPrice || 0) + bookingData.childCount * (bookingData.childPrice || 0))).toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-[#4CA771] block">
                        {totalAmount.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-right mt-1">
                    (Không phát sinh thêm bất kỳ chi phí nào)
                  </p>
                </div>

                {/* Nút Tiếp tục thanh toán CTA */}
                <button
                  type="button"
                  onClick={handleContinueClick}
                  className="w-full py-3.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCreditCard} />
                  <span>Xác nhận & Sang thanh toán</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>

                {/* Trust badge */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500 text-sm" />
                  <span>Mã hóa bảo mật thông tin chuẩn 256-bit</span>
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

      {/* Modal xác nhận */}
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
      />

      {/* Modal xử lý */}
      <ProcessingModal isOpen={isProcessingModalOpen} />
    </div>
  );
};

export default BookingForm;
