import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faLocationDot,
  faClock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Component Tour Card độc lập, thiết kế cao cấp & hiệu ứng hover
const TourCard = ({ tour }) => {
  const imageUrl =
    tour.images && tour.images.length > 0 && tour.images[0]
      ? tour.images[0]
      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

  const locationName =
    tour.destination?.name ||
    (tour.location ? tour.location.split(',')[0] : 'Việt Nam');

  const durationText = tour.duration
    ? `${tour.duration}N${Math.max(tour.duration - 1, 1)}Đ`
    : null;

  return (
    <div className="h-full px-2.5 py-2">
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
          {/* Gradient shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

          {/* Badge Thời gian */}
          {durationText && (
            <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
              <FontAwesomeIcon icon={faClock} className="text-[10px] text-emerald-400" />
              <span>{durationText}</span>
            </div>
          )}

          {/* Badge Địa điểm */}
          <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm z-10">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771] text-xs" />
            <span className="truncate max-w-[140px]">{locationName}</span>
          </div>
        </div>

        {/* Nội dung Card */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
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
    </div>
  );
};

// Skeleton Placeholder khi đang load
const TourCardSkeleton = () => (
  <div className="h-full px-2.5 py-2">
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
  </div>
);

const FeaturedTourSection = ({ title, description, tours = [], loading = false }) => {
  const sliderRef = useRef(null);

  // Đảm bảo có đủ số lượng slide để react-slick chạy Infinite loop mượt mà không bị lỗi
  let displayTours = tours;
  const isInfinite = tours.length > 1;

  if (isInfinite && tours.length < 8) {
    const repeatCount = Math.ceil(8 / tours.length);
    displayTours = Array(repeatCount).fill(tours).flat();
  }

  const settings = {
    dots: false,
    infinite: isInfinite,
    speed: 500,
    slidesToShow: Math.min(Math.max(tours.length, 1), 4),
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(Math.max(tours.length, 1), 3),
          slidesToScroll: 1,
          infinite: isInfinite,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(Math.max(tours.length, 1), 2),
          slidesToScroll: 1,
          infinite: isInfinite,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: isInfinite,
        },
      },
    ],
  };

  const nextSlide = () => {
    if (sliderRef.current) sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  };

  return (
    <section className="w-full flex justify-center py-6">
      <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%]">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-[#4CA771] rounded-full inline-block"></span>
            <h2 className="font-bold text-2xl text-slate-800 tracking-tight">
              {title}
            </h2>
            {!loading && tours.length > 0 && (
              <span className="text-xs font-semibold bg-emerald-50 text-[#4CA771] px-2.5 py-0.5 rounded-full border border-emerald-100">
                {tours.length} tour
              </span>
            )}
          </div>
          {description && (
            <p className="text-slate-500 text-sm mt-1.5 ml-4">
              {description}
            </p>
          )}
        </div>

        {/* Danh sách Tour Carousel với 2 nút mũi tên ở 2 bên */}
        <div className="relative group/carousel">
          {/* Nút Prev bên trái */}
          {!loading && tours.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#4CA771] hover:border-[#4CA771] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Previous Slide"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
          )}

          {/* Nút Next bên phải */}
          {!loading && tours.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#4CA771] hover:border-[#4CA771] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Next Slide"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <TourCardSkeleton key={index} />
                ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">
              Không có tour nào trong mục này.
            </div>
          ) : (
            <div className="-mx-2.5">
              <Slider ref={sliderRef} {...settings}>
                {displayTours.map((tour, index) => (
                  <TourCard key={`${tour._id}-${index}`} tour={tour} />
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTourSection;
