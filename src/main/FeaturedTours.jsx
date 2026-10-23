import React, { useState, useEffect } from 'react';
import { fetchTours, fetchTourTypes } from '../API/apiService';
import FeaturedTourSection from './FeaturedTourSection';

const FeaturedTours = () => {
  const [featuredSections, setFeaturedSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeaturedData = async () => {
    setLoading(true);
    try {
      const [allTours, allTourTypes] = await Promise.all([
        fetchTours().catch(() => []),
        fetchTourTypes().catch(() => []),
      ]);

      // Lọc các tour hợp lệ (được duyệt, không bị tắt, không bị xóa)
      const validTours = (allTours || []).filter(
        (tour) => !tour.isDisabled && (tour.isApproved ?? true) && !tour.isDeleted
      );

      // 1. Tìm các loại tour có isFeatured === true từ danh sách TourType
      const featuredTypesList = (allTourTypes || []).filter(
        (type) => type.isFeatured === true || type.isFeatured === 'true'
      );

      // 2. Gom nhóm các tour theo từng loại tour nổi bật
      const sections = [];

      if (featuredTypesList.length > 0) {
        featuredTypesList.forEach((type) => {
          const toursForType = validTours.filter((tour) => {
            const tourTypeId = tour.tourType?._id || tour.tourType;
            return String(tourTypeId) === String(type._id);
          });

          // Chỉ hiển thị section nếu loại tour này có ít nhất 1 tour
          if (toursForType.length > 0) {
            sections.push({
              id: type._id,
              title: type.name || 'Tour Nổi Bật',
              description: type.description || 'Khám phá loại tour bạn yêu thích',
              tours: toursForType,
            });
          }
        });
      }

      // Fallback: Nếu không tìm thấy từ allTourTypes, gom nhóm từ tour.tourType trực tiếp
      if (sections.length === 0) {
        const typeMap = new Map();
        validTours.forEach((tour) => {
          if (tour.tourType && typeof tour.tourType === 'object') {
            if (tour.tourType.isFeatured === true || tour.tourType.isFeatured === 'true') {
              const typeId = String(tour.tourType._id);
              if (!typeMap.has(typeId)) {
                typeMap.set(typeId, {
                  id: typeId,
                  title: tour.tourType.name || 'Tour Nổi Bật',
                  description: tour.tourType.description || 'Khám phá loại tour bạn yêu thích',
                  tours: [],
                });
              }
              typeMap.get(typeId).tours.push(tour);
            }
          }
        });

        if (typeMap.size > 0) {
          typeMap.forEach((val) => sections.push(val));
        } else if (validTours.length > 0) {
          // Fallback cuối cùng nếu chưa có tourType nào isFeatured
          sections.push({
            id: 'default-featured',
            title: 'Tour Bestseller',
            description: 'Khám phá các chuyến đi hấp dẫn và được yêu thích nhất',
            tours: validTours,
          });
        }
      }

      setFeaturedSections(sections);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tour nổi bật:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedData();
  }, []);

  if (loading) {
    return (
      <FeaturedTourSection
        title="Đang tải danh sách tour..."
        description="Vui lòng chờ trong giây lát"
        tours={[]}
        loading={true}
      />
    );
  }

  if (featuredSections.length === 0) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] text-center text-slate-500 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          Chưa có tour nổi bật nào được kích hoạt.
        </div>
      </div>
    );
  }

  return (
    <div className="featured-tours-container space-y-4">
      {featuredSections.map((section) => (
        <FeaturedTourSection
          key={section.id}
          title={section.title}
          description={section.description}
          tours={section.tours}
          loading={false}
        />
      ))}
    </div>
  );
};

export default FeaturedTours;
