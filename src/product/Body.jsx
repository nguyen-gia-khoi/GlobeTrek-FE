import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../header1/Header';
import Footer from '../footer/Footer';
import SortandGrid from './SortandGrid';
import ToursList from './TourList';
import TourFilterSidebar from './TourFilterSidebar';
import Pagination from './Pagination';
import { fetchTourTypes, fetchDestinations, searchTours } from '../API/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faHouse,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const ProductBody = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialSearch = queryParams.get('search') || queryParams.get('query') || '';
  const initialScope = queryParams.get('scope') || (queryParams.get('isDomestic') === 'true' ? 'domestic' : (queryParams.get('isDomestic') === 'false' ? 'international' : 'all'));
  const initialType = queryParams.get('type') || queryParams.get('tourType') || 'all';
  const initialDuration = queryParams.get('duration') || 'all';
  const initialDestination = queryParams.get('dest') || queryParams.get('destination') || 'all';
  const initialPrice = queryParams.get('price') || 'all';

  const [tours, setTours] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tourTypes, setTourTypes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc states
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [selectedScope, setSelectedScope] = useState(initialScope);
  const [selectedTourType, setSelectedTourType] = useState(initialType);
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPrice);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [sortOption, setSortOption] = useState('popular');
  const [view, setView] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const searchDebounceRef = useRef(null);
  const isInitialMount = useRef(true);

  // 1. Tải danh mục Metadata (Loại tour & Điểm đến) 1 lần khi mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMetadata = async () => {
      try {
        const [typesData, destData] = await Promise.all([
          fetchTourTypes().catch(() => []),
          fetchDestinations().catch(() => []),
        ]);
        setTourTypes(Array.isArray(typesData) ? typesData : []);
        setDestinations(Array.isArray(destData) ? destData : []);
      } catch (error) {
        console.error('Lỗi khi tải metadata lọc tour:', error);
      }
    };
    loadMetadata();
  }, []);

  // 2. Đồng bộ state khi URL thay đổi (VD: người dùng click menu header, tag, hoặc back/forward trình duyệt)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('search') || params.has('query')) {
      setSearchKeyword(params.get('search') || params.get('query') || '');
    }
    if (params.has('scope')) {
      setSelectedScope(params.get('scope') || 'all');
    } else if (params.has('isDomestic')) {
      setSelectedScope(params.get('isDomestic') === 'true' ? 'domestic' : 'international');
    }
    if (params.has('type') || params.has('tourType')) {
      setSelectedTourType(params.get('type') || params.get('tourType') || 'all');
    }
    if (params.has('dest') || params.has('destination')) {
      setSelectedDestination(params.get('dest') || params.get('destination') || 'all');
    }
    if (params.has('price')) {
      setSelectedPriceRange(params.get('price') || 'all');
    }
    if (params.has('duration')) {
      setSelectedDuration(params.get('duration') || 'all');
    }
    if (params.has('page')) {
      setCurrentPage(parseInt(params.get('page'), 10) || 1);
    }
  }, [location.search]);

  // 3. Hàm gọi API Backend searchTours với đầy đủ tham số
  const executeSearch = useCallback(async (overrides = {}) => {
    setLoading(true);
    try {
      const keyword = overrides.keyword !== undefined ? overrides.keyword : searchKeyword;
      const scope = overrides.scope !== undefined ? overrides.scope : selectedScope;
      const tourType = overrides.tourType !== undefined ? overrides.tourType : selectedTourType;
      const destination = overrides.destination !== undefined ? overrides.destination : selectedDestination;
      const priceRange = overrides.priceRange !== undefined ? overrides.priceRange : selectedPriceRange;
      const duration = overrides.duration !== undefined ? overrides.duration : selectedDuration;
      const sort = overrides.sort !== undefined ? overrides.sort : sortOption;
      const page = overrides.page !== undefined ? overrides.page : currentPage;
      const limit = overrides.limit !== undefined ? overrides.limit : itemsPerPage;

      const backendParams = {
        query: keyword.trim() || undefined,
        scope: scope !== 'all' ? scope : undefined,
        tourType: tourType !== 'all' ? tourType : undefined,
        destination: destination !== 'all' ? destination : undefined,
        page,
        limit,
      };

      // Chuyển đổi khoảng giá
      if (priceRange === 'under-2m') {
        backendParams.maxPrice = 2000000;
      } else if (priceRange === '2m-5m') {
        backendParams.minPrice = 2000000;
        backendParams.maxPrice = 5000000;
      } else if (priceRange === '5m-10m') {
        backendParams.minPrice = 5000000;
        backendParams.maxPrice = 10000000;
      } else if (priceRange === 'above-10m') {
        backendParams.minPrice = 10000000;
      }

      // Chuyển đổi thời lượng
      if (duration === '1-3') {
        backendParams.minDuration = 1;
        backendParams.maxDuration = 3;
      } else if (duration === '4-7') {
        backendParams.minDuration = 4;
        backendParams.maxDuration = 7;
      } else if (duration === 'above-7') {
        backendParams.minDuration = 8;
      }

      // Chuyển đổi sắp xếp
      if (sort === 'priceAsc') {
        backendParams.sortBy = 'price';
        backendParams.order = 'asc';
      } else if (sort === 'priceDesc') {
        backendParams.sortBy = 'price';
        backendParams.order = 'desc';
      } else if (sort === 'durationAsc') {
        backendParams.sortBy = 'duration';
        backendParams.order = 'asc';
      } else if (sort === 'newest') {
        backendParams.sortBy = 'createdAt';
        backendParams.order = 'desc';
      }

      const result = await searchTours(backendParams);
      const tourList = Array.isArray(result) ? result : (result.data || []);
      const total = result.total !== undefined ? result.total : tourList.length;
      const pages = result.totalPages !== undefined ? result.totalPages : Math.ceil(total / limit) || 1;

      setTours(tourList);
      setTotalResults(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Lỗi khi gọi API tìm kiếm tour từ Backend:', error);
      setTours([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    searchKeyword,
    selectedScope,
    selectedTourType,
    selectedDestination,
    selectedPriceRange,
    selectedDuration,
    sortOption,
    currentPage,
    itemsPerPage,
  ]);

  // 4. Gọi API khi filter hoặc page thay đổi (debounce cho searchKeyword)
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Nếu vừa đổi keyword thì debounce 350ms, các filter khác gọi ngay
    searchDebounceRef.current = setTimeout(() => {
      executeSearch();
    }, 350);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [executeSearch]);

  // Reset về trang 1 khi người dùng đổi bất kỳ bộ lọc nào (ngoại trừ khi chỉ đổi currentPage)
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedScope('all');
    setSelectedTourType('all');
    setSelectedDestination('all');
    setSelectedPriceRange('all');
    setSelectedDuration('all');
    setSortOption('popular');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const resultsElement = document.getElementById('tour-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-16">
        {/* Banner Hero Đầu Trang */}
        <section className="w-full bg-gradient-to-r from-[#013237] via-[#0b5345] to-[#117a65] text-white py-12 px-4 sm:px-8 mb-8 shadow-md">
          <div className="max-w-[1280px] w-full mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/80 mb-4">
              <Link to="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <FontAwesomeIcon icon={faHouse} className="text-xs" />
                <span>Trang chủ</span>
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">Tất cả Tour du lịch</span>
            </nav>

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 border border-white/10 mb-3">
                <FontAwesomeIcon icon={faCompass} />
                <span>Hàng trăm hành trình tour trọn gói</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
                Khám Phá Tất Cả Các Chuyến Đi
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Tìm kiếm và lựa chọn tour du lịch phù hợp nhất với sở thích, điểm đến và ngân sách của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* Nội Dung Chính (Sidebar Bộ Lọc + Danh Sách Tour) */}
        <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Bộ Lọc trên Desktop */}
            <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 hidden lg:block sticky top-28">
              <TourFilterSidebar
                searchKeyword={searchKeyword}
                setSearchKeyword={(val) => {
                  setSearchKeyword(val);
                  setCurrentPage(1);
                }}
                selectedScope={selectedScope}
                setSelectedScope={(val) => handleFilterChange(setSelectedScope, val)}
                tourTypes={tourTypes}
                selectedTourType={selectedTourType}
                setSelectedTourType={(val) => handleFilterChange(setSelectedTourType, val)}
                destinations={destinations}
                selectedDestination={selectedDestination}
                setSelectedDestination={(val) => handleFilterChange(setSelectedDestination, val)}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={(val) => handleFilterChange(setSelectedPriceRange, val)}
                selectedDuration={selectedDuration}
                setSelectedDuration={(val) => handleFilterChange(setSelectedDuration, val)}
                onResetFilters={handleResetFilters}
                totalResults={totalResults}
              />
            </aside>

            {/* Vùng Danh Sách Tour */}
            <div id="tour-results-section" className="flex-1 w-full scroll-mt-28">
              <SortandGrid
                onSortChange={(val) => handleFilterChange(setSortOption, val)}
                sortOption={sortOption}
                view={view}
                setView={setView}
                totalResults={totalResults}
                onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              />

              <ToursList
                tours={tours}
                view={view}
                loading={loading}
                skeletonCount={itemsPerPage}
                onResetFilters={handleResetFilters}
              />

              {!loading && totalResults > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalResults}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Drawer Bộ lọc trên Mobile */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Bộ lọc tìm kiếm</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <TourFilterSidebar
                searchKeyword={searchKeyword}
                setSearchKeyword={(val) => {
                  setSearchKeyword(val);
                  setCurrentPage(1);
                }}
                selectedScope={selectedScope}
                setSelectedScope={(val) => handleFilterChange(setSelectedScope, val)}
                tourTypes={tourTypes}
                selectedTourType={selectedTourType}
                setSelectedTourType={(val) => handleFilterChange(setSelectedTourType, val)}
                destinations={destinations}
                selectedDestination={selectedDestination}
                setSelectedDestination={(val) => handleFilterChange(setSelectedDestination, val)}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={(val) => handleFilterChange(setSelectedPriceRange, val)}
                selectedDuration={selectedDuration}
                setSelectedDuration={(val) => handleFilterChange(setSelectedDuration, val)}
                onResetFilters={handleResetFilters}
                totalResults={totalResults}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold rounded-xl shadow cursor-pointer"
              >
                Xem {totalResults} kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductBody;
