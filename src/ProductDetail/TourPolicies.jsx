import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleExclamation,
  faHandHoldingDollar,
  faSuitcaseRolling,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';

const TourPolicies = ({ tour }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
        <FontAwesomeIcon icon={faCircleExclamation} className="text-[#4CA771]" />
        <span>Chính sách & Lưu ý quan trọng</span>
      </h2>

      <div className="space-y-6 text-sm text-slate-700">
        {/* Điều kiện Hoàn Hủy */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Chính sách hủy & Đổi ngày tour</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm leading-relaxed">
              <li>Hủy trước 15 ngày so với ngày khởi hành: <strong>Miễn phí 100%</strong>.</li>
              <li>Hủy từ 7 - 14 ngày trước ngày khởi hành: Phí hủy 30% giá trị tour.</li>
              <li>Hủy từ 3 - 6 ngày trước ngày khởi hành: Phí hủy 50% giá trị tour.</li>
              <li>Hủy trong vòng 48 giờ trước giờ khởi hành: Phí hủy 100% giá trị tour.</li>
            </ul>
          </div>
        </div>

        {/* Giấy tờ tùy thân */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Giấy tờ tùy thân & Thủ tục</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Quý khách vui lòng mang theo Căn cước công dân (hoặc Hộ chiếu còn hạn trên 6 tháng đối với tour nước ngoài), Giấy khai sinh bản chính đối với trẻ em dưới 14 tuổi.
            </p>
          </div>
        </div>

        {/* Hành lý & Sức khỏe */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            <FontAwesomeIcon icon={faSuitcaseRolling} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Hành lý & Chuẩn bị sức khỏe</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Hành lý gọn nhẹ, trang phục phù hợp với thời tiết điểm đến. Quý khách có tiền sử bệnh tim mạch hoặc dị ứng thực phẩm vui lòng báo trước với nhân viên tư vấn để nhận hỗ trợ y tế kịp thời.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPolicies;
