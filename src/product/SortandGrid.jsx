import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBorderAll,
  faList,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';

const sortOptions = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'priceAsc', label: 'Giá: Thấp đến Cao' },
  { value: 'priceDesc', label: 'Giá: Cao đến Thấp' },
  { value: 'durationAsc', label: 'Thời lượng: Ngắn đến Dài' },
  { value: 'newest', label: 'Mới nhất' },
];

const SortandGrid = ({
  onSortChange,
  sortOption,
  view,
  setView,
  totalResults = 0,
  onOpenMobileFilter,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Kết quả tìm kiếm */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h2 className="text-sm sm:text-base text-slate-700">
          Tìm thấy <strong className="text-[#4CA771] font-bold">{totalResults}</strong> chuyến đi
        </h2>

        {/* Nút mở bộ lọc trên Mobile */}
        <button
          onClick={onOpenMobileFilter}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-[#4CA771] border border-emerald-200 rounded-xl text-xs font-bold"
        >
          <FontAwesomeIcon icon={faSliders} />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Sắp xếp & Chế độ xem */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        {/* Dropdown Sắp xếp */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
            Sắp xếp theo:
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA771] cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nút Grid / List View */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView('grid')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              view === 'grid'
                ? 'bg-white text-[#4CA771] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Xem dạng lưới"
            aria-label="Grid View"
          >
            <FontAwesomeIcon icon={faBorderAll} className="text-sm" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              view === 'list'
                ? 'bg-white text-[#4CA771] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Xem dạng danh sách"
            aria-label="List View"
          >
            <FontAwesomeIcon icon={faList} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortandGrid;
