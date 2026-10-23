import React, { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faClock,
  faHeart,
  faShareNodes,
  faStar,
  faImages,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faHouse,
  faCompass,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { message } from "antd";
import { toggleFavoriteTour } from '../API/apiService';

const InfoImage = ({ tour, loading = false, isFavorite = false, setIsFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const images = tour?.images || [];
  const videos = tour?.videos || [];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeLightbox = () => {
    setIsModalOpen(false);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleSaveTour = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userNav'));
    const userId = storedUser?._id || storedUser?.userId;

    if (!userId) {
      message.warning("Vui lòng đăng nhập để lưu tour vào danh sách yêu thích");
      return;
    }

    setFavoriteLoading(true);
    try {
      const result = await toggleFavoriteTour(userId, tour._id, !isFavorite);
      setIsFavorite(result.isFavorite);
      if (result.isFavorite) {
        message.success("Đã thêm tour vào danh sách yêu thích!");
      } else {
        message.info("Đã xóa tour khỏi danh sách yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi lưu tour yêu thích:", error);
      message.error("Không thể cập nhật danh sách yêu thích");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép liên kết tour vào bộ nhớ tạm!");
    } else {
      message.info("Bạn có thể chia sẻ liên kết: " + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 mb-8">
        <Skeleton height={24} width={250} />
        <Skeleton height={40} width="80%" />
        <div className="flex gap-4">
          <Skeleton height={24} width={180} />
          <Skeleton height={24} width={120} />
        </div>
        <Skeleton height={420} className="rounded-2xl" />
      </div>
    );
  }

  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
  const sideImages = images.slice(1, 5);

  return (
    <div className="w-full mb-8">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-500 mb-3">
        <Link to="/" className="hover:text-[#4CA771] flex items-center gap-1.5 transition-colors">
          <FontAwesomeIcon icon={faHouse} className="text-xs" />
          <span>Trang chủ</span>
        </Link>
        <span>/</span>
        <Link to="/product-body" className="hover:text-[#4CA771] transition-colors">
          Tour du lịch
        </Link>
        <span>/</span>
        {tour?.destination?.name && (
          <>
            <Link
              to={`/product-body?search=${encodeURIComponent(tour.destination.name)}`}
              className="hover:text-[#4CA771] transition-colors"
            >
              {tour.destination.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
          {tour?.title}
        </span>
      </nav>

      {/* 2. Tiêu đề Tour & Nút Thao tác */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {tour?.title}
          </h1>

          {/* Location & Duration meta */}
          <div className="flex items-center flex-wrap gap-4 mt-3 text-sm text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771]" />
              <span>{tour?.location || tour?.destination?.name || 'Việt Nam'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faClock} className="text-[#4CA771]" />
              <span>Thời lượng: <strong className="text-slate-800">{tour?.duration || 1} ngày</strong></span>
            </div>
          </div>
        </div>

        {/* Nút Yêu thích & Chia sẻ */}
        <div className="flex items-center gap-2 self-start flex-shrink-0">
          <button
            onClick={handleSaveTour}
            disabled={favoriteLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-rose-500'
            }`}
            title={isFavorite ? "Bỏ yêu thích" : "Lưu vào danh sách yêu thích"}
          >
            <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-rose-500' : 'text-slate-400'} />
            <span>{isFavorite ? 'Đã lưu' : 'Lưu tour'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#4CA771] hover:bg-emerald-50 transition-all shadow-sm cursor-pointer"
            title="Chia sẻ tour"
          >
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
        </div>
      </div>

      {/* 3. Bento Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-md bg-slate-900">
        {/* Ảnh chính lớn (Chiếm 2 cột) */}
        <div
          className="md:col-span-2 relative h-72 sm:h-96 md:h-[420px] overflow-hidden group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img
            src={primaryImage}
            alt={tour?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Nút xem Video nếu có */}
          {videos && videos.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVideoModal(true);
              }}
              className="absolute top-4 left-4 z-10 px-3.5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20 shadow-lg transition-all"
            >
              <FontAwesomeIcon icon={faPlay} className="text-emerald-400 text-xs" />
              <span>Xem Video Tour</span>
            </button>
          )}

          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Ảnh nổi bật</span>
            <p className="text-sm font-bold truncate max-w-sm">{tour?.title}</p>
          </div>
        </div>

        {/* 4 Ảnh phụ dạng 2x2 grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 h-72 sm:h-96 md:h-[420px]">
          {sideImages.length > 0 ? (
            sideImages.map((img, idx) => {
              const actualIndex = idx + 1;
              const isLast = idx === 3 || actualIndex === images.length - 1;
              const remainingCount = Math.max(0, images.length - 5);

              return (
                <div
                  key={idx}
                  className="relative overflow-hidden group cursor-pointer h-full"
                  onClick={() => openLightbox(actualIndex)}
                >
                  <img
                    src={img}
                    alt={`Tour gallery ${actualIndex}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

                  {/* Nút "Xem tất cả hình ảnh" ở ô cuối cùng */}
                  {isLast && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center transition-all group-hover:bg-black/70">
                      <FontAwesomeIcon icon={faImages} className="text-2xl mb-1 text-emerald-300" />
                      <span className="font-bold text-sm sm:text-base">+{remainingCount} ảnh</span>
                      <span className="text-[11px] text-slate-200">Xem tất cả</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 flex items-center justify-center bg-slate-800 text-slate-400 text-sm">
              Không có thêm hình ảnh
            </div>
          )}
        </div>
      </div>

      {/* 4. Lightbox Modal xem toàn bộ ảnh */}
      {isModalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none"
          onClick={closeLightbox}
        >
          {/* Nút Đóng */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg z-50 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {/* Nút Prev */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base z-50 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Vùng Ảnh chính */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Tour preview ${currentImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-sm font-semibold text-emerald-300">
                Ảnh {currentImageIndex + 1} / {images.length}
              </p>
              <p className="text-xs text-slate-300 truncate max-w-lg mt-1">{tour?.title}</p>
            </div>
          </div>

          {/* Nút Next */}
          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base z-50 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* 5. Video Modal */}
      {showVideoModal && videos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg z-50 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div
            className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video controls autoPlay className="w-full h-auto max-h-[80vh]">
              <source src={videos[0]} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoImage;
