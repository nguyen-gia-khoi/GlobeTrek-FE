import React from 'react';
import TourItem from './TourItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const ToursList = ({ tours = [], view = 'grid', loading = false, onResetFilters, skeletonCount = 9 }) => {
  if (loading) {
    return (
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'space-y-4'
        }
      >
        {Array(skeletonCount)
          .fill(0)
          .map((_, index) => (
            <TourItem key={`skeleton-${index}`} loading={true} view={view} />
          ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#4CA771] flex items-center justify-center text-2xl mb-4">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Không tìm thấy chuyến đi phù hợp
        </h3>
        <p className="text-slate-500 text-sm max-w-md mb-5">
          Rất tiếc, chúng tôi không tìm thấy tour nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm rounded-full shadow-sm hover:shadow transition-all"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
            <span>Xóa bộ lọc & Xem tất cả tour</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'space-y-4'
      }
    >
      {tours.map((tour) => (
        <TourItem key={tour._id} tour={tour} view={view} loading={false} />
      ))}
    </div>
  );
};

export default ToursList;