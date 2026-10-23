import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faXmark,
  faShieldHalved,
  faVanShuttle,
  faUtensils,
  faTicket,
  faUserTie,
  faWineGlass,
  faPassport,
} from '@fortawesome/free-solid-svg-icons';

const TourServices = ({ tour }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
        <FontAwesomeIcon icon={faShieldHalved} className="text-[#4CA771]" />
        <span>Dịch vụ & Tiện ích đi kèm</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột 1: Dịch vụ Bao gồm */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
          <h3 className="text-base font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span>Giá tour bao gồm</span>
          </h3>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faVanShuttle} className="text-emerald-600 mt-1 flex-shrink-0" />
              <span>Xe du lịch đời mới máy lạnh đưa đón theo suốt hành trình tour.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faUtensils} className="text-emerald-600 mt-1 flex-shrink-0" />
              <span>Tất cả các bữa ăn tiêu chuẩn chất lượng theo thực đơn địa phương.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faTicket} className="text-emerald-600 mt-1 flex-shrink-0" />
              <span>Vé tham quan các thắng cảnh và danh lam trong lịch trình.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faUserTie} className="text-emerald-600 mt-1 flex-shrink-0" />
              <span>Hướng dẫn viên nhiệt tình, chu đáo, thuyết minh chuyên nghiệp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600 mt-1 flex-shrink-0" />
              <span>Bảo hiểm du lịch trọn gói mức bồi thường cao nhất (lên đến 50.000.000đ/vụ).</span>
            </li>
          </ul>
        </div>

        {/* Cột 2: Không bao gồm */}
        <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5">
          <h3 className="text-base font-bold text-rose-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <span>Không bao gồm</span>
          </h3>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faWineGlass} className="text-rose-500 mt-1 flex-shrink-0" />
              <span>Chi phí đồ uống trong các bữa ăn và chi tiêu cá nhân ngoài chương trình.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faTicket} className="text-rose-500 mt-1 flex-shrink-0" />
              <span>Vé các trò chơi cảm giác mạnh, dịch vụ thể thao biển tự chọn.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faPassport} className="text-rose-500 mt-1 flex-shrink-0" />
              <span>Thuế VAT 8-10% (nếu quý khách có nhu cầu xuất hóa đơn đỏ).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FontAwesomeIcon icon={faUserTie} className="text-rose-500 mt-1 flex-shrink-0" />
              <span>Tiền tip (tiền bồi dưỡng) cho Hướng dẫn viên và Tài xế (tùy tâm).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TourServices;
