import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faRotateRight,
  faTag,
  faLocationDot,
  faMoneyBillWave,
  faClock,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';

const priceRanges = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2.000.000 ₫', min: 0, max: 2000000 },
  { id: '2m-5m', label: '2.000.000 ₫ - 5.000.000 ₫', min: 2000000, max: 5000000 },
  { id: '5m-10m', label: '5.000.000 ₫ - 10.000.000 ₫', min: 5000000, max: 10000000 },
  { id: 'above-10m', label: 'Trên 10.000.000 ₫', min: 10000000, max: Infinity },
];

const durations = [
  { id: 'all', label: 'Tất cả thời lượng' },
  { id: '1-3', label: '1 - 3 ngày', min: 1, max: 3 },
  { id: '4-7', label: '4 - 7 ngày', min: 4, max: 7 },
  { id: 'above-7', label: 'Trên 7 ngày', min: 8, max: 100 },
];

const TourFilterSidebar = ({
  searchKeyword,
  setSearchKeyword,
  selectedScope = 'all',
  setSelectedScope,
  tourTypes = [],
  selectedTourType,
  setSelectedTourType,
  destinations = [],
  selectedDestination,
  setSelectedDestination,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedDuration,
  setSelectedDuration,
  onResetFilters,
  totalResults = 0,
}) => {
  const hasActiveFilters =
    searchKeyword.trim() !== '' ||
    selectedScope !== 'all' ||
    selectedTourType !== 'all' ||
    selectedDestination !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedDuration !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6">
      {/* Header Bộ lọc */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
          <FontAwesomeIcon icon={faFilter} className="text-[#4CA771]" />
          <span>Bộ lọc tìm kiếm</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* 1. Tìm kiếm theo từ khóa */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Tìm kiếm tour
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
          />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tên tour, địa danh..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 2. Lọc theo Phạm vi (Trong nước / Quốc tế) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <FontAwesomeIcon icon={faGlobe} className="text-[#4CA771]" />
          <span>Khu vực / Quốc gia</span>
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="scope"
              checked={selectedScope === 'all'}
              onChange={() => setSelectedScope && setSelectedScope('all')}
              className="accent-[#4CA771] w-4 h-4 cursor-pointer"
            />
            <span className={selectedScope === 'all' ? 'font-bold text-[#4CA771]' : ''}>Tất cả tour</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="scope"
              checked={selectedScope === 'domestic'}
              onChange={() => setSelectedScope && setSelectedScope('domestic')}
              className="accent-[#4CA771] w-4 h-4 cursor-pointer"
            />
            <span className={selectedScope === 'domestic' ? 'font-bold text-[#4CA771]' : ''}>Tour Trong Nước</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="scope"
              checked={selectedScope === 'international'}
              onChange={() => setSelectedScope && setSelectedScope('international')}
              className="accent-[#4CA771] w-4 h-4 cursor-pointer"
            />
            <span className={selectedScope === 'international' ? 'font-bold text-[#4CA771]' : ''}>Tour Quốc Tế</span>
          </label>
        </div>
      </div>

      {/* 3. Lọc theo Loại Tour (Tour Type) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <FontAwesomeIcon icon={faTag} className="text-[#4CA771]" />
          <span>Loại hình tour</span>
        </div>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="tourType"
              checked={selectedTourType === 'all'}
              onChange={() => setSelectedTourType('all')}
              className="accent-[#4CA771] w-4 h-4 cursor-pointer"
            />
            <span className="font-medium">Tất cả loại tour</span>
          </label>
          {tourTypes.map((type) => (
            <label
              key={type._id}
              className="flex items-center justify-between text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="tourType"
                  checked={selectedTourType === type._id}
                  onChange={() => setSelectedTourType(type._id)}
                  className="accent-[#4CA771] w-4 h-4 cursor-pointer"
                />
                <span className={selectedTourType === type._id ? 'font-bold text-[#4CA771]' : ''}>
                  {type.name}
                </span>
              </div>
              {type.tourCount !== undefined && (
                <span className="text-xs text-slate-400">({type.tourCount})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 3. Lọc theo Điểm đến (Destinations) */}
      {destinations.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771]" />
            <span>Điểm đến</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="destination"
                checked={selectedDestination === 'all'}
                onChange={() => setSelectedDestination('all')}
                className="accent-[#4CA771] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">Tất cả điểm đến</span>
            </label>
            {destinations.map((dest, idx) => {
              const destId = dest._id || dest.name;
              const isChecked = selectedDestination === destId || selectedDestination === dest.name;

              return (
                <label
                  key={dest._id || idx}
                  className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="destination"
                    checked={isChecked}
                    onChange={() => setSelectedDestination(dest._id || dest.name)}
                    className="accent-[#4CA771] w-4 h-4 cursor-pointer"
                  />
                  <span className={isChecked ? 'font-bold text-[#4CA771]' : ''}>
                    {dest.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Lọc theo Mức giá */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-[#4CA771]" />
          <span>Mức giá</span>
        </div>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.id}
                onChange={() => setSelectedPriceRange(range.id)}
                className="accent-[#4CA771] w-4 h-4 cursor-pointer"
              />
              <span className={selectedPriceRange === range.id ? 'font-bold text-[#4CA771]' : ''}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Lọc theo Thời lượng (Duration) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <FontAwesomeIcon icon={faClock} className="text-[#4CA771]" />
          <span>Thời lượng chuyến đi</span>
        </div>
        <div className="space-y-1.5">
          {durations.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-emerald-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === item.id}
                onChange={() => setSelectedDuration(item.id)}
                className="accent-[#4CA771] w-4 h-4 cursor-pointer"
              />
              <span className={selectedDuration === item.id ? 'font-bold text-[#4CA771]' : ''}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourFilterSidebar;
