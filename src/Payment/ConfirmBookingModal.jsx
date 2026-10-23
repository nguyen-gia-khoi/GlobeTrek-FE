import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ConfirmBookingModal = ({ isOpen, onRequestClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-2xl mb-4 mx-auto">
          <FontAwesomeIcon icon={faCircleQuestion} />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">
          Xác nhận thông tin đặt chỗ?
        </h3>
        <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
          Vui lòng kiểm tra kỹ họ tên, số điện thoại và email nhận vé trước khi chuyển sang bước thanh toán.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRequestClose}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Kiểm tra lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingModal;
