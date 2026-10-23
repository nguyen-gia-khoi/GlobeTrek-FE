import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';

const TourOverview = ({ tour }) => {
  return (
    <div className="mb-8">
      {/* Giới thiệu tổng quan & Điểm nổi bật */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
          <FontAwesomeIcon icon={faFileLines} className="text-[#4CA771]" />
          <span>Tổng quan về chuyến đi</span>
        </h2>

        <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
          {tour?.description ? (
            tour.description.split('\n').map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;
              return <p key={pIdx}>{trimmed}</p>;
            })
          ) : (
            <p>
              Hành trình du lịch khám phá tuyệt vời cùng GlobeTrek. Quý khách sẽ được trải nghiệm các danh lam thắng cảnh nổi tiếng, thưởng thức ẩm thực đặc sắc địa phương và tận hưởng dịch vụ lưu trú chất lượng cao.
            </p>
          )}
        </div>

        {/* Điểm nhấn nổi bật */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider mb-3">
            Điểm nhấn không thể bỏ lỡ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-[#4CA771] flex-shrink-0" />
              <span>Khám phá trọn vẹn cảnh sắc thiên nhiên hùng vĩ</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-[#4CA771] flex-shrink-0" />
              <span>Thưởng thức ẩm thực đặc sản tươi ngon nức tiếng</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-[#4CA771] flex-shrink-0" />
              <span>Chụp ảnh check-in tại các tọa độ nổi tiếng nhất</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="text-[#4CA771] flex-shrink-0" />
              <span>Đội ngũ HDV am hiểu văn hóa và tận tâm hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourOverview;
