import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Header from '../header1/Header.jsx';
import Footer from '../footer/Footer.jsx';
import InfoImage from './InfoImage.jsx';
import TourOverview from './TourOverview.jsx';
import TourItinerary from './TourItinerary.jsx';
import TourServices from './TourServices.jsx';
import TourPolicies from './TourPolicies.jsx';
import GoogleMap from './GoogleMap.jsx';
import TourBookingSidebar from './TourBookingSidebar.jsx';

import { fetchTourById, checkIfFavorite } from '../API/apiService.js';
import { useDate } from '../Context/DateContext.jsx';

function Bodyprodetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { selectedDate, setSelectedDate } = useDate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const getTourData = async () => {
      setLoading(true);
      try {
        const tourData = await fetchTourById(id);
        setTour(tourData);

        // Khởi tạo ngày khởi hành mặc định từ danh sách availabilities trong tương lai
        const todayStr = new Date().toISOString().split('T')[0];
        const futureDates = (tourData.availabilities || []).filter((item) => {
          if (!item.date) return false;
          const itemDateStr = new Date(item.date).toISOString().split('T')[0];
          return itemDateStr >= todayStr;
        });

        if (futureDates.length > 0) {
          const firstDate = new Date(futureDates[0].date);
          setSelectedDate(firstDate);
          localStorage.setItem('selectedDate', firstDate.toISOString());
          localStorage.setItem('tourPrice', tourData.price);
        }

        // Kiểm tra trạng thái yêu thích
        const storedUser = JSON.parse(localStorage.getItem('userNav'));
        const userId = storedUser?._id || storedUser?.userId;
        if (userId && tourData._id) {
          const favStatus = await checkIfFavorite(userId, tourData._id).catch(() => false);
          setIsFavorite(!!favStatus);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin chi tiết tour:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getTourData();
    }
  }, [id, setSelectedDate]);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-16">
        <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[82%] mx-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton height={30} width={250} />
              <Skeleton height={45} width="70%" />
              <Skeleton height={420} className="rounded-2xl" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                <div className="lg:col-span-8 space-y-6">
                  <Skeleton height={100} className="rounded-2xl" />
                  <Skeleton height={300} className="rounded-2xl" />
                  <Skeleton height={200} className="rounded-2xl" />
                </div>
                <div className="lg:col-span-4">
                  <Skeleton height={450} className="rounded-2xl" />
                </div>
              </div>
            </div>
          ) : !tour ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center my-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông tin tour</h2>
              <p className="text-slate-500 mb-6">Chuyến đi này có thể đã kết thúc hoặc không còn khả dụng.</p>
              <a
                href="/product-body"
                className="px-6 py-2.5 bg-[#4CA771] text-white font-bold rounded-xl shadow-md hover:bg-[#3d8b5d] transition-colors"
              >
                Khám phá các tour khác
              </a>
            </div>
          ) : (
            <>
              {/* 1. Tiêu đề, Breadcrumbs, Wishlist & Bento Gallery */}
              <InfoImage
                tour={tour}
                loading={false}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
              />

              {/* 2. Layout 2 Cột Hiện Đại */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
                {/* Cột Trái (68% - Nội dung chi tiết hành trình) */}
                <div className="lg:col-span-8">
                  {/* Tóm tắt thông số & Giới thiệu */}
                  <TourOverview tour={tour} />

                  {/* Lịch trình chi tiết từng ngày */}
                  <TourItinerary tour={tour} schedules={tour.schedules} />

                  {/* Dịch vụ Bao gồm & Không bao gồm */}
                  <TourServices tour={tour} />

                  {/* Bản đồ & Vị trí */}
                  <GoogleMap tour={tour} />

                  {/* Chính sách hoàn hủy & Lưu ý */}
                  <TourPolicies tour={tour} />
                </div>

                {/* Cột Phải (32% - Sticky Booking Sidebar) */}
                <div className="lg:col-span-4">
                  <TourBookingSidebar
                    tour={tour}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Bodyprodetail;
