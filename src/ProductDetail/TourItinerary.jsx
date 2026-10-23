import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faChevronDown,
  faUtensils,
  faHotel,
  faBus,
  faCircleDot,
  faAnglesDown,
  faAnglesUp,
} from '@fortawesome/free-solid-svg-icons';

const TourItinerary = ({ tour, schedules = [] }) => {
  const tourSchedules = schedules.length > 0 ? schedules : (tour?.schedules || []);
  const [openDays, setOpenDays] = useState([0]); // Mặc định mở ngày đầu tiên

  const toggleDay = (index) => {
    setOpenDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => {
    setOpenDays(tourSchedules.map((_, idx) => idx));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  if (!tourSchedules || tourSchedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarDays} className="text-[#4CA771]" />
          <span>Lịch trình chi tiết</span>
        </h2>
        <p className="text-slate-500 text-sm italic">
          Lịch trình chi tiết đang được cập nhật. Quý khách vui lòng liên hệ tư vấn viên để nhận bản lịch trình mới nhất.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      {/* Tiêu đề & Nút Mở rộng/Thu gọn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FontAwesomeIcon icon={faCalendarDays} className="text-[#4CA771]" />
            <span>Lịch trình chi tiết ({tourSchedules.length} ngày)</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Khám phá trọn vẹn từng điểm đến và hoạt động thú vị theo từng ngày.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-semibold text-[#4CA771] hover:text-[#3d8b5d] px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FontAwesomeIcon icon={faAnglesDown} className="text-[10px]" />
            <span>Mở tất cả</span>
          </button>
          <button
            onClick={collapseAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FontAwesomeIcon icon={faAnglesUp} className="text-[10px]" />
            <span>Thu gọn</span>
          </button>
        </div>
      </div>

      {/* Timeline danh sách các ngày */}
      <div className="relative mt-6 space-y-4">
        {/* Đường line dọc nối timeline */}
        <div className="absolute left-4.5 top-6 bottom-6 w-0.5 bg-emerald-100 hidden sm:block"></div>

        {tourSchedules.map((schedule, idx) => {
          const isOpen = openDays.includes(idx);
          const dayNumber = schedule.day || idx + 1;
          const dayTitle = schedule.title || `Hành trình Ngày ${dayNumber}`;

          return (
            <div
              key={idx}
              className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-emerald-200 bg-emerald-50/30 shadow-sm'
                  : 'border-slate-200 hover:border-emerald-300 bg-white'
              }`}
            >
              {/* Header ngày */}
              <div
                onClick={() => toggleDay(idx)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Badge số ngày */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#4CA771] text-white shadow-md shadow-emerald-700/20'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-50'
                    }`}
                  >
                    N{dayNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-wider">
                      Ngày {dayNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                      {dayTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 bg-slate-100 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#4CA771] bg-white shadow-sm' : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </div>
              </div>

              {/* Nội dung chi tiết hoạt động */}
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-emerald-100/60 text-slate-700 text-sm leading-relaxed">
                  {schedule.activity ? (
                    <div className="space-y-2.5">
                      {schedule.activity.split('\n').map((paragraph, pIdx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={pIdx} className="flex items-start gap-2.5">
                            <FontAwesomeIcon
                              icon={faCircleDot}
                              className="text-[#4CA771] text-[10px] mt-1.5 flex-shrink-0"
                            />
                            <p className="flex-1 text-slate-700">{trimmed}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Chưa có thông tin chi tiết cho ngày này.</p>
                  )}

                  {/* Thông tin đi kèm (Ăn uống, Khách sạn, Phương tiện) */}
                  <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                      <FontAwesomeIcon icon={faUtensils} className="text-amber-500" />
                      <span>Ăn uống: Bữa sáng, Trưa, Tối</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                      <FontAwesomeIcon icon={faHotel} className="text-indigo-500" />
                      <span>Nghỉ ngơi: Khách sạn 3-4 sao</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                      <FontAwesomeIcon icon={faBus} className="text-emerald-500" />
                      <span>Di chuyển: Xe du lịch máy lạnh</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TourItinerary;
