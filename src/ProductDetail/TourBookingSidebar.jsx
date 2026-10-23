import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUsers,
  faBolt,
  faShieldHeart,
  faHeadset,
  faArrowRight,
  faRotateLeft,
  faTag,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import { useDate } from '../Context/DateContext';
import { hasTourItinerary, isSpecialDay } from '../API/utils';
import { getAuthToken } from '../API/apiService';

// Hàm tính giá người lớn & trẻ em cho một ngày cụ thể
export const getPriceForDate = (date, tourData) => {
  if (!date || !tourData) {
    const basePrice = tourData?.price || 0;
    const baseChild = tourData?.childPrice || Math.round(basePrice * 0.7);
    return { adultPrice: basePrice, childPrice: baseChild, isSpecial: false };
  }

  const dateStr = new Date(date).toISOString().split('T')[0];
  const isSpecial = isSpecialDay(new Date(date));

  // 1. Kiểm tra cấu hình giá riêng trong availabilities
  const avail = (tourData.availabilities || []).find((a) => {
    if (!a.date) return false;
    return new Date(a.date).toISOString().split('T')[0] === dateStr;
  });

  let adultPrice = tourData.price || 0;
  let childPrice = tourData.childPrice || Math.round(adultPrice * 0.7);

  if (avail && avail.price) {
    adultPrice = avail.price;
    childPrice = avail.childPrice || Math.round(adultPrice * 0.7);
  } else if (tourData.specialPrices && tourData.specialPrices[dateStr]) {
    adultPrice = tourData.specialPrices[dateStr];
    childPrice = Math.round(adultPrice * 0.7);
  } else if (isSpecial) {
    if (tourData.specialAdultPrice) {
      adultPrice = tourData.specialAdultPrice;
    }
    if (tourData.specialChildPrice) {
      childPrice = tourData.specialChildPrice;
    } else {
      childPrice = Math.round(adultPrice * 0.7);
    }
  }

  return { adultPrice, childPrice, isSpecial };
};

const TourBookingSidebar = ({ tour, selectedDate, onSelectDate }) => {
  const navigate = useNavigate();
  const { setSelectedDate } = useDate();
  const currentUser = useSelector((state) => state.auth?.login?.currentUser);
  const isLoggedIn = Boolean(
    getAuthToken() ||
    currentUser?.accessToken ||
    currentUser?.token?.accessToken ||
    currentUser?.token ||
    currentUser?.accesstoken
  );

  // Lấy danh sách ngày khởi hành trong tương lai từ availabilities
  const todayStr = new Date().toISOString().split('T')[0];
  const futureAvailabilities = useMemo(() => {
    return (tour?.availabilities || []).filter((item) => {
      if (!item.date) return false;
      const itemDateStr = new Date(item.date).toISOString().split('T')[0];
      return itemDateStr >= todayStr;
    });
  }, [tour?.availabilities, todayStr]);

  // Tính giá động theo ngày đang được chọn (selectedDate)
  const currentPricing = useMemo(() => {
    return getPriceForDate(selectedDate, tour);
  }, [selectedDate, tour]);

  const handleDateSelect = (dateObj) => {
    const d = new Date(dateObj.date);
    const pricing = getPriceForDate(d, tour);

    setSelectedDate(d);
    localStorage.setItem('selectedDate', d.toISOString());
    localStorage.setItem('tourPrice', pricing.adultPrice);

    if (onSelectDate) onSelectDate(d);
  };

  const canBook = hasTourItinerary(tour);
  const canPress = canBook && isLoggedIn;

  const handleBookNow = () => {
    if (!canPress) return;
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate.toISOString());
      localStorage.setItem('tourPrice', currentPricing.adultPrice);
    }
    navigate(`/bodyPay/${tour._id}`);
  };

  const isCurrentDate = (dateItem) => {
    if (!selectedDate) return false;
    const d1 = new Date(dateItem.date).toDateString();
    const d2 = new Date(selectedDate).toDateString();
    return d1 === d2;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sticky top-28">
      {/* Header giá tour (Tự động cập nhật theo ngày chọn) */}
      <div className="pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            {selectedDate ? 'Giá ngày khởi hành đã chọn' : 'Giá trọn gói từ'}
          </span>
          {currentPricing.isSpecial && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold flex items-center gap-1">
              <FontAwesomeIcon icon={faFire} className="text-amber-500 text-[9px]" />
              <span>Giá ngày Lễ / Cuối tuần</span>
            </span>
          )}
        </div>

        {/* Số tiền người lớn */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-[#4CA771] transition-all duration-300">
            {currentPricing.adultPrice.toLocaleString('vi-VN')} ₫
          </span>
          <span className="text-xs text-slate-500 font-medium">/ người lớn</span>
        </div>

        {/* Số tiền trẻ em */}
        {currentPricing.childPrice > 0 && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <FontAwesomeIcon icon={faTag} className="text-emerald-500 text-[10px]" />
            <span>
              Trẻ em: <strong className="text-slate-700">{currentPricing.childPrice.toLocaleString('vi-VN')} ₫</strong>
            </span>
          </p>
        )}

        {/* Hiển thị ngày đang chọn */}
        {selectedDate && (
          <div className="mt-2.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between">
            <span>Ngày: {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Chọn ngày khởi hành */}
      <div className="py-5 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2.5 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCalendarCheck} className="text-[#4CA771]" />
          <span>Chọn ngày khởi hành</span>
        </label>

        {futureAvailabilities.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {futureAvailabilities.map((avail, idx) => {
              const dateObj = new Date(avail.date);
              const selected = isCurrentDate(avail);
              const isFull = (avail.availableSeats || 0) <= 0;
              const datePricing = getPriceForDate(dateObj, tour);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFull}
                  onClick={() => handleDateSelect(avail)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selected
                      ? 'border-[#4CA771] bg-emerald-50/90 ring-2 ring-[#4CA771]/20 font-bold shadow-sm'
                      : isFull
                      ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed text-slate-400'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {dateObj.toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Khởi hành tại: {tour?.location?.split(',')[0] || 'Việt Nam'}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    {/* Giá của từng ngày */}
                    <span className="text-xs font-bold text-[#4CA771]">
                      {datePricing.adultPrice.toLocaleString('vi-VN')} ₫
                    </span>

                    {/* Số chỗ còn lại */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isFull
                          ? 'bg-red-50 text-red-500'
                          : avail.availableSeats <= 3
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isFull ? 'Hết chỗ' : `Còn ${avail.availableSeats} chỗ`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
            Hiện tại chưa có lịch khởi hành cố định. Quý khách có thể bấm đặt để yêu cầu khởi hành theo ngày mong muốn.
          </div>
        )}
      </div>

      {/* Nút Đặt Tour CTA */}
      <div className="pt-5 space-y-3">
        {!canBook && (
          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
            Tour chưa có lịch trình nên chưa mở đặt chỗ. Quý khách vui lòng liên hệ tư vấn viên.
          </div>
        )}
        <div className="relative group">
          <button
            type="button"
            onClick={handleBookNow}
            disabled={!canPress}
            className={`w-full py-3.5 font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 ${
              canPress
                ? 'bg-[#4CA771] hover:bg-[#3d8b5d] text-white shadow-lg shadow-emerald-700/20 hover:shadow-xl cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed pointer-events-none'
            }`}
          >
            <FontAwesomeIcon icon={faBolt} />
            <span>Đặt Tour Ngay</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
          {!isLoggedIn && (
            <span className="pointer-events-none absolute left-1/2 bottom-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Vui lòng đăng nhập
            </span>
          )}
        </div>

        <a
          href="tel:19001234"
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
        >
          <FontAwesomeIcon icon={faHeadset} className="text-[#4CA771]" />
          <span>Tư vấn qua Hotline: 1900 1234</span>
        </a>
      </div>

      {/* Quyền lợi & Cam kết */}
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faRotateLeft} className="text-[#4CA771]" />
          <span>Đổi lịch trình linh hoạt miễn phí trước 7 ngày.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faShieldHeart} className="text-[#4CA771]" />
          <span>Bảo hiểm du lịch trọn gói theo tiêu chuẩn quốc tế.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faUsers} className="text-[#4CA771]" />
          <span>Hỗ trợ khách đoàn & thiết kế tour theo yêu cầu.</span>
        </div>
      </div>
    </div>
  );
};

export default TourBookingSidebar;
