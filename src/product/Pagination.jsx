import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 9,
  onItemsPerPageChange,
}) => {
  if (totalPages <= 1 && totalItems === 0) return null;

  // Tính khoảng hiển thị (VD: 1 - 9 trong 25)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Tạo danh sách trang có dấu "..."
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('dots-left');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('dots-right');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Thông tin số lượng hiển thị */}
      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
        <span>
          Hiển thị{' '}
          <strong className="text-slate-800 font-bold">
            {startItem} - {endItem}
          </strong>{' '}
          trong tổng số{' '}
          <strong className="text-[#4CA771] font-bold">{totalItems}</strong> tour
        </span>

        {/* Lựa chọn số lượng hiển thị mỗi trang */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-xs text-slate-400">Hiển thị:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4CA771] cursor-pointer"
            >
              <option value={6}>6 tour</option>
              <option value={9}>9 tour</option>
              <option value={12}>12 tour</option>
              <option value={18}>18 tour</option>
            </select>
          </div>
        )}
      </div>

      {/* Nút phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 sm:gap-1.5 select-none">
          {/* Về trang đầu */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs transition-all ${
              currentPage === 1
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
                : 'text-slate-600 hover:text-[#4CA771] hover:bg-emerald-50 bg-white border border-slate-200 cursor-pointer shadow-sm'
            }`}
            title="Trang đầu tiên"
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>

          {/* Trang trước */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs transition-all ${
              currentPage === 1
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
                : 'text-slate-600 hover:text-[#4CA771] hover:bg-emerald-50 bg-white border border-slate-200 cursor-pointer shadow-sm'
            }`}
            title="Trang trước"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Danh sách các nút số trang */}
          {pages.map((p, index) => {
            if (p === 'dots-left' || p === 'dots-right') {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs text-slate-400 font-bold"
                >
                  •••
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#4CA771] text-white shadow-md shadow-emerald-700/20 ring-2 ring-[#4CA771]/30'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] border border-slate-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Trang sau */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs transition-all ${
              currentPage === totalPages
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
                : 'text-slate-600 hover:text-[#4CA771] hover:bg-emerald-50 bg-white border border-slate-200 cursor-pointer shadow-sm'
            }`}
            title="Trang tiếp theo"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* Đến trang cuối */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs transition-all ${
              currentPage === totalPages
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
                : 'text-slate-600 hover:text-[#4CA771] hover:bg-emerald-50 bg-white border border-slate-200 cursor-pointer shadow-sm'
            }`}
            title="Trang cuối cùng"
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
