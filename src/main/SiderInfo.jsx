import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import Skeleton from 'react-loading-skeleton';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCompass,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import QC1 from '../assets/QC1.png';
import QC2 from '../assets/QC2.png';

const banners = [{ image: QC1 }, { image: QC2 }];

function SiderInfo() {
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  const nextSlide = () => {
    if (sliderRef.current) sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%]">
        {/* Nút Khám Phá Thêm Tour - Nằm ngay phía trên Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 rounded-2xl p-6 sm:p-8 mb-8 border border-emerald-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#4CA771] text-white flex items-center justify-center shadow-md flex-shrink-0 hidden sm:flex">
              <FontAwesomeIcon icon={faCompass} className="text-2xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Bạn chưa tìm được tour ưng ý?
              </h3>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Khám phá hàng trăm hành trình du lịch hấp dẫn trên khắp mọi miền với đầy đủ bộ lọc theo mức giá, thời lượng và điểm đến!
              </p>
            </div>
          </div>

          <Link
            to="/product-body"
            className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex-shrink-0 cursor-pointer"
          >
            <span>Khám phá tất cả các tour</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Banner Quảng Cáo Slider */}
        <div className="relative group/banner">
          {/* Nút Prev bên trái banner */}
          {!loading && (
            <button
              onClick={prevSlide}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#4CA771] hover:border-[#4CA771] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Previous Banner"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
          )}

          {/* Nút Next bên phải banner */}
          {!loading && (
            <button
              onClick={nextSlide}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#4CA771] hover:border-[#4CA771] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Next Banner"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          )}

          {loading ? (
            <Skeleton className="w-full h-[220px] sm:h-[320px] rounded-2xl" />
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-md">
              <Slider ref={sliderRef} {...settings}>
                {banners.map((item, index) => (
                  <div key={index} className="outline-none">
                    <img
                      src={item.image}
                      alt={`Khuyến mãi ${index + 1}`}
                      className="w-full h-[200px] sm:h-[320px] md:h-[360px] object-cover rounded-2xl"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SiderInfo;
