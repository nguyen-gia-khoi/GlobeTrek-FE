import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faClock,
  faArrowRight,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

const TourItem = ({ tour, view = 'grid', loading = false }) => {
  // Skeleton Placeholder giống hệt trang Home (FeaturedTourSection)
  if (loading) {
    if (view === 'list') {
      return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-5">
          <Skeleton height={200} className="w-full md:w-64 rounded-xl" />
          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={16} width="40%" className="mb-3" />
              <Skeleton height={14} count={2} className="mb-1" />
            </div>
            <div className="flex justify-between items-end pt-3">
              <Skeleton height={24} width={120} />
              <Skeleton height={36} width={100} className="rounded-full" />
            </div>
          </div>
        </div>
      );
    }

    // Grid Skeleton đồng bộ 100% với TourCardSkeleton của FeaturedTourSection ở trang Home
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-[375px] flex flex-col">
        <Skeleton height={192} className="w-full" />
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Skeleton height={18} className="mb-2" />
            <Skeleton height={18} width="70%" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
            <div>
              <Skeleton height={12} width={50} className="mb-1" />
              <Skeleton height={22} width={100} />
            </div>
            <Skeleton circle height={32} width={32} />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) return null;

  const imageUrl =
    tour.images && tour.images.length > 0 && tour.images[0]
      ? tour.images[0]
      : FALLBACK_IMAGE;

  const locationName =
    tour.destination?.name ||
    (tour.location ? tour.location.split(',')[0] : 'Việt Nam');

  const durationText = tour.duration
    ? `${tour.duration}N${Math.max(tour.duration - 1, 1)}Đ`
    : null;

  const typeName = tour.tourType?.name || (typeof tour.tourType === 'string' ? '' : '');

  // Render dạng List View (Danh sách hàng ngang)
  if (view === 'list') {
    return (
      <Link
        to={`/ProDetail/${tour._id}`}
        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col md:flex-row gap-5 p-3.5 sm:p-4"
      >
        {/* Ảnh thumbnail */}
        <div className="relative w-full md:w-72 h-52 md:h-auto rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={imageUrl}
            alt={tour.title}
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          {durationText && (
            <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
              <FontAwesomeIcon icon={faClock} className="text-emerald-400 text-xs" />
              <span>{durationText}</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm z-10">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771] text-xs" />
            <span className="truncate max-w-[150px]">{locationName}</span>
          </div>
        </div>

        {/* Chi tiết nội dung */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {typeName && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#4CA771] mb-2 border border-emerald-100">
                {typeName}
              </span>
            )}
            <h3
              className="text-slate-800 font-bold text-lg leading-snug group-hover:text-[#4CA771] transition-colors line-clamp-2"
              title={tour.title}
            >
              {tour.title}
            </h3>

            {tour.description && (
              <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                {tour.description}
              </p>
            )}

            {tour.availabilities && tour.availabilities.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-[#4CA771]" />
                <span>Khởi hành gần nhất: <strong className="text-slate-700">{tour.availabilities[0].date}</strong></span>
              </div>
            )}
          </div>

          {/* Giá & Nút Đặt tour */}
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                Giá trọn gói từ
              </span>
              <div className="text-xl font-extrabold text-[#4CA771] leading-none mt-0.5">
                {tour.price ? tour.price.toLocaleString('vi-VN') : 0}{' '}
                <span className="text-sm font-semibold">₫</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4CA771] group-hover:bg-[#3d8b5d] text-white font-bold text-sm rounded-full shadow-sm group-hover:shadow transition-all duration-200">
              <span>Xem chi tiết</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Render dạng Grid View (Lưới thẻ dọc - Chuẩn cấu trúc TourCard trang Home)
  return (
    <Link
      to={`/ProDetail/${tour._id}`}
      className="group flex flex-col h-[375px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.15)] hover:-translate-y-1.5 transition-transform duration-300"
    >
      {/* Hình ảnh & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={imageUrl}
          alt={tour.title}
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Gradient shadow overlay giống trang Home */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Badge Thời lượng */}
        {durationText && (
          <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <FontAwesomeIcon icon={faClock} className="text-[10px] text-emerald-400" />
            <span>{durationText}</span>
          </div>
        )}

        {/* Badge Địa điểm */}
        <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771] text-xs" />
          <span className="truncate max-w-[140px]">{locationName}</span>
        </div>
      </div>

      {/* Nội dung Card */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {typeName && (
            <span className="inline-block text-[11px] font-semibold text-[#4CA771] mb-1">
              {typeName}
            </span>
          )}
          <h3
            className="text-slate-800 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-[#4CA771] transition-colors"
            title={tour.title}
          >
            {tour.title}
          </h3>

          {tour.availabilities && tour.availabilities.length > 0 && (
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Gần nhất: {tour.availabilities[0].date}
            </p>
          )}
        </div>

        {/* Hàng Giá tiền & Button CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Giá từ
            </span>
            <div className="text-lg font-extrabold text-[#4CA771] leading-none mt-0.5">
              {tour.price ? tour.price.toLocaleString('vi-VN') : 0}{' '}
              <span className="text-xs font-semibold">₫</span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#4CA771]/10 group-hover:bg-[#4CA771] text-[#4CA771] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs -rotate-45 group-hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourItem;
