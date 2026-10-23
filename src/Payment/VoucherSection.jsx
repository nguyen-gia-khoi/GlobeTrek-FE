import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faTicket,
   faTag,
   faXmark,
   faCheck,
   faSpinner,
   faGift,
   faLock,
 } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const VoucherSection = ({
  appliedCode = '',
  onApplyCode,
  onRemoveCode,
  promotion = null,
  discountAmount = 0,
  loading = false,
  isLoggedIn = true,
  disabled = false,
}) => {
  const [inputCode, setInputCode] = useState('');

  const handleApply = (e) => {
    e?.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed || loading || disabled) return;
    onApplyCode(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  const isCodeApplied = Boolean(appliedCode && promotion?.kind === 'code');
  const isAutoApplied = Boolean(!appliedCode && promotion?.kind === 'automatic' && discountAmount > 0);

  return (
    <div className="py-4 border-b border-slate-100">
      <div className="flex items-center justify-between mb-2.5">
        <label
          htmlFor="voucher-input"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faTicket} className="text-[#4CA771]" />
          <span>Mã giảm giá / Ưu đãi</span>
        </label>
        {isCodeApplied && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Đã áp dụng mã
          </span>
        )}
      </div>

      {!isLoggedIn ? (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="text-amber-600 flex-shrink-0" />
            <span>Đăng nhập để nhận ưu đãi tự động & dùng mã voucher.</span>
          </div>
          <Link
            to="/login"
            className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-[11px] whitespace-nowrap shadow-2xs transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      ) : isCodeApplied ? (
        /* Voucher Code Đã Áp Dụng */
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-1 bg-[#4CA771] text-white font-extrabold text-xs tracking-wider rounded-lg shadow-2xs uppercase">
                {promotion.code || appliedCode}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {promotion.name || 'Mã giảm giá ưu đãi'}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Giảm {promotion.discountType === 'percent' ? `${promotion.discountValue}%` : `${(promotion.discountValue || discountAmount).toLocaleString('vi-VN')} ₫`}
                  {' '}(~ -{discountAmount.toLocaleString('vi-VN')} ₫)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveCode}
              disabled={loading || disabled}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
              title="Gỡ bỏ mã"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[11px]" />
              <span>Gỡ mã</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form nhập mã voucher */
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="voucher-input"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder="Nhập mã voucher (VD: HE2026)"
                disabled={loading || disabled}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#4CA771] focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-50"
              />
              {inputCode && !loading && (
                <button
                  type="button"
                  onClick={() => setInputCode('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleApply}
              disabled={!inputCode.trim() || loading || disabled}
              className="px-4 py-2.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <span>Áp dụng</span>
              )}
            </button>
          </div>

          {/* Ưu đãi tự động nếu có */}
          {isAutoApplied && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#4CA771] text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-emerald-800">
                    Ưu đãi tự động: {promotion.name}
                  </span>
                  <span className="font-extrabold text-[#4CA771] whitespace-nowrap">
                    -{discountAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Đã tự động áp dụng ưu đãi tốt nhất cho đơn hàng của bạn. Bạn vẫn có thể nhập mã voucher khác nếu có.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

VoucherSection.propTypes = {
  appliedCode: PropTypes.string,
  onApplyCode: PropTypes.func.isRequired,
  onRemoveCode: PropTypes.func.isRequired,
  promotion: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    kind: PropTypes.string,
    code: PropTypes.string,
    discountType: PropTypes.string,
    discountValue: PropTypes.number,
    discountAmount: PropTypes.number,
  }),
  discountAmount: PropTypes.number,
  loading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default VoucherSection;
