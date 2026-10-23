import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProcessingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#4CA771] flex items-center justify-center text-3xl mb-4 mx-auto animate-spin">
          <FontAwesomeIcon icon={faSpinner} />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mb-2">
          Đang khởi tạo đơn đặt chỗ...
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Hệ thống đang chuẩn bị hóa đơn và kết nối đến cổng thanh toán an toàn.
        </p>
      </div>
    </div>
  );
};

export default ProcessingModal;
