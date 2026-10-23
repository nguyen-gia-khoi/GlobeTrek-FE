import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from '../footer/Footer';
import { message, Popconfirm, Tooltip } from 'antd';
import { fetchFavoriteTours, removeFavoriteTour } from '../API/apiService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faTrash,
  faLocationDot,
  faClock,
  faStar,
  faArrowRight,
  faSearch,
  faXmark,
  faSuitcaseRolling,
  faArrowLeft,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

const getUserId = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('userNav'));
    return storedUser?._id || storedUser?.userId;
  } catch {
    return null;
  }
};

const SavedList = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const userId = getUserId();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!userId) {
      setLoading(false);
      return;
    }

    const loadFavoriteTours = async () => {
      try {
        setLoading(true);
        const data = await fetchFavoriteTours(userId);
        setSavedItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi fetch favorite tours:", error);
        message.error("Không thể tải danh sách tour đã lưu.");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteTours();
  }, [userId]);

  // Xóa tour khỏi danh sách yêu thích
  const handleRemoveItem = async (tourId) => {
    if (!userId) return;

    setRemovingId(tourId);
    try {
      await removeFavoriteTour(userId, tourId);
      setSavedItems((prev) => prev.filter((item) => (item.tour?._id || item._id) !== tourId));
      message.success("Đã xóa tour khỏi danh sách đã lưu!");
    } catch (error) {
      message.error(error.message || "Lỗi khi xóa tour khỏi danh sách.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewDetails = (tourId) => {
    navigate(`/ProDetail/${tourId}`);
  };

  // Lọc tour theo từ khóa tìm kiếm
  const filteredTours = useMemo(() => {
    if (!searchTerm.trim()) return savedItems;
    const term = searchTerm.trim().toLowerCase();
    return savedItems.filter((item) => {
      const tour = item.tour || item;
      const title = (tour.title || '').toLowerCase();
      const location = (tour.location || '').toLowerCase();
      const destination = (tour.destination?.name || '').toLowerCase();
      return title.includes(term) || location.includes(term) || destination.includes(term);
    });
  }, [savedItems, searchTerm]);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-16 flex-1">
        <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[82%] mx-auto">
          {/* 1. Breadcrumbs & Header điều hướng */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              to="/product-body"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#4CA771] transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs group-hover:border-[#4CA771] shadow-2xs">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span>Khám phá thêm tour khác</span>
            </Link>

            {/* Badge đếm số lượng */}
            {userId && !loading && savedItems.length > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800 self-start sm:self-auto">
                <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-xs" />
                <span>{savedItems.length} chuyến đi đã lưu</span>
              </div>
            )}
          </div>

          {/* 2. Tiêu đề chính của trang */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3">
                <FontAwesomeIcon icon={faSuitcaseRolling} />
                <span>Bộ sưu tập cá nhân</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Danh sách tour đã lưu
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl leading-relaxed">
                Nơi lưu giữ những hành trình bạn yêu thích và sẵn sàng lên đường bất cứ lúc nào.
              </p>
            </div>

            {/* Ô tìm kiếm nhanh trong danh sách đã lưu */}
            {savedItems.length > 0 && (
              <div className="w-full md:w-80">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm trong tour đã lưu..."
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#4CA771] focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Nội dung chính: Danh sách cards hoặc Empty State */}
          {!userId ? (
            /* Trường hợp chưa đăng nhập */
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-100 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4 border border-amber-100 shadow-xs">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Đăng nhập để xem tour đã lưu</h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
                Vui lòng đăng nhập vào tài khoản của bạn để đồng bộ và xem lại những chuyến đi yêu thích trên mọi thiết bị.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all"
              >
                <span>Đăng nhập ngay</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </Link>
            </div>
          ) : loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-100 p-3 shadow-xs space-y-3">
                  <Skeleton height={200} className="rounded-xl" />
                  <Skeleton height={20} width="70%" />
                  <Skeleton height={16} width="40%" />
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <Skeleton height={24} width={100} />
                    <Skeleton height={36} width={90} className="rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : savedItems.length === 0 ? (
            /* Empty State: Chưa lưu tour nào */
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-slate-100 shadow-xs max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-3xl mx-auto mb-5 border border-emerald-100 shadow-xs">
                <FontAwesomeIcon icon={faHeart} className="text-rose-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                Danh sách đã lưu đang trống
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
                Bạn chưa lưu tour du lịch nào. Hãy khám phá các điểm đến hấp dẫn và bấm vào biểu tượng trái tim để lưu lại nhé!
              </p>
              <Link
                to="/product-body"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all"
              >
                <span>Khám phá các tour du lịch</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </Link>
            </div>
          ) : filteredTours.length === 0 ? (
            /* Không tìm thấy kết quả theo từ khóa */
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs max-w-md mx-auto">
              <FontAwesomeIcon icon={faSearch} className="text-slate-300 text-3xl mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Không tìm thấy tour phù hợp
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Không có tour nào trong danh sách đã lưu khớp với từ khóa "{searchTerm}".
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Xóa tìm kiếm
              </button>
            </div>
          ) : (
            /* Grid hiển thị Cards Tour đã lưu chuẩn thiết kế hiện đại */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((item) => {
                const tour = item.tour || item;
                if (!tour || !tour._id) return null;

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

                const isDeleting = removingId === tour._id;

                return (
                  <div
                    key={tour._id}
                    className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group ${
                      isDeleting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div>
                      {/* Ảnh Thumbnail & Các Badge thông tin */}
                      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={tour.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out cursor-pointer"
                          onClick={() => handleViewDetails(tour._id)}
                        />

                        {/* Badge thời lượng tour */}
                        {durationText && (
                          <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                            <FontAwesomeIcon icon={faClock} className="text-emerald-400 text-xs" />
                            <span>{durationText}</span>
                          </div>
                        )}

                        {/* Nút Xóa nhanh dạng Trái tim ở góc trên bên phải */}
                        <div className="absolute top-3 right-3 z-10">
                          <Popconfirm
                            title="Bỏ lưu tour này?"
                            description="Tour sẽ bị xóa khỏi danh sách yêu thích của bạn."
                            onConfirm={() => handleRemoveItem(tour._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            placement="bottomRight"
                          >
                            <button
                              type="button"
                              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-md flex items-center justify-center text-sm transition-transform hover:scale-110 cursor-pointer backdrop-blur-xs"
                              title="Bỏ lưu tour"
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </button>
                          </Popconfirm>
                        </div>
                      </div>

                      {/* Thông tin Tour */}
                      <div className="p-4 sm:p-5">
                        {/* Địa điểm & Đánh giá */}
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                          <div className="flex items-center gap-1 truncate">
                            <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500 flex-shrink-0" />
                            <span className="truncate font-medium">{tour.location || locationName}</span>
                          </div>
                          {tour.rating && (
                            <div className="flex items-center gap-1 text-slate-700 font-bold flex-shrink-0">
                              <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                              <span>{tour.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Tiêu đề Tour */}
                        <h2
                          onClick={() => handleViewDetails(tour._id)}
                          className="font-bold text-slate-900 group-hover:text-[#4CA771] text-sm sm:text-base line-clamp-2 transition-colors cursor-pointer leading-snug"
                          title={tour.title}
                        >
                          {tour.title}
                        </h2>
                      </div>
                    </div>

                    {/* Footer của Card: Giá & Nút Thao Tác */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-semibold">Giá từ:</span>
                        <span className="text-base sm:text-lg font-extrabold text-[#4CA771] block leading-tight">
                          {(tour.price || 0).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Nút Xóa icon thùng rác */}
                        <Popconfirm
                          title="Bỏ lưu tour này?"
                          description="Tour sẽ bị xóa khỏi danh sách yêu thích của bạn."
                          onConfirm={() => handleRemoveItem(tour._id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                          placement="topRight"
                        >
                          <Tooltip title="Xóa khỏi danh sách đã lưu">
                            <button
                              type="button"
                              className="w-9 h-9 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                            </button>
                          </Tooltip>
                        </Popconfirm>

                        {/* Nút Xem chi tiết tour */}
                        <button
                          type="button"
                          onClick={() => handleViewDetails(tour._id)}
                          className="py-2.5 px-3.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <span>Xem chi tiết</span>
                          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedList;
