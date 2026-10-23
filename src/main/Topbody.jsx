import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faLocationDot,
  faClock,
  faCompass,
  faArrowRight,
  faChevronDown,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import imgtopbody from '../assets/imgtopbody.jpg';
import { fetchTours, fetchTourTypes, fetchDestinations, searchTours } from '../API/apiService';

const durationOptions = [
  { value: 'all', label: 'Tất cả thời lượng' },
  { value: '1-3', label: '1 - 3 ngày' },
  { value: '4-7', label: '4 - 7 ngày' },
  { value: 'above-7', label: 'Trên 7 ngày' },
];

// Component Custom Dropdown hiện đại, bo góc mềm mại, đổ bóng 3D
const CustomDropdown = ({
  icon,
  label,
  value,
  options = [],
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative select-none ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-slate-50 border rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
          isOpen
            ? 'border-[#4CA771] ring-2 ring-[#4CA771]/20 bg-white'
            : 'border-slate-200 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center min-w-0 flex-1 mr-2">
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className="text-[#4CA771] text-base mr-3 flex-shrink-0"
            />
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {label}
            </span>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {selectedOption?.label || 'Chọn...'}
            </span>
          </div>
        </div>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-slate-400 text-xs transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#4CA771]' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-y-auto max-h-64 z-50 min-w-[220px]">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-[#4CA771] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#4CA771] font-medium'
                }`}
              >
                <span className="truncate pr-2">{opt.label}</span>
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs text-[#4CA771] flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function Topbody() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [tourTypes, setTourTypes] = useState([]);
  const [tours, setTours] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const [toursData, typesData, destinationsData] = await Promise.all([
          fetchTours().catch(() => []),
          fetchTourTypes().catch(() => []),
          fetchDestinations({ isPopular: true }).catch(() => []),
        ]);
        setTours(toursData || []);
        setTourTypes(typesData || []);
        setPopularDestinations(destinationsData || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Tour & Điểm đến:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.trim() !== '') {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await searchTours({
            query: term.trim(),
            tourType: selectedType !== 'all' ? selectedType : undefined,
            limit: 5,
          });
          const results = res.data || [];
          setFilteredSuggestions(results.slice(0, 5));
        } catch (err) {
          console.error('Error fetching autocomplete suggestions:', err);
        }
      }, 300);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedType !== 'all') params.append('type', selectedType);
    if (selectedDuration !== 'all') params.append('duration', selectedDuration);

    const queryString = params.toString();
    navigate(queryString ? `/product-body?${queryString}` : '/product-body');
  };

  const handleSelectSuggestion = (tourId) => {
    navigate(`/ProDetail/${tourId}`);
  };

  const typeOptions = [
    { value: 'all', label: 'Tất cả loại tour' },
    ...tourTypes.map((t) => ({ value: t._id, label: t.name })),
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        {/* Tiêu đề Tour nguyên bản */}
        <div className="w-[68%] max-w-[1280px] pt-[140px] sm:pt-[160px]">
          {loading ? (
            <Skeleton height={45} width={120} className="mb-6" />
          ) : (
            <h1 className="font-bold sm:text-4xl text-3xl mb-6 text-slate-900">Tour</h1>
          )}
        </div>

        {/* Khung Banner Gốc */}
        <div className="w-full flex flex-col items-center">
          <div className="sm:w-[68%] w-[92%] max-w-[1280px] flex flex-col items-center">
            {loading ? (
              <Skeleton className="w-full h-80 sm:h-96 rounded-2xl" />
            ) : (
              <div className="w-full rounded-2xl overflow-hidden shadow-md">
                <img
                  className="w-full block h-72 sm:h-96 object-cover"
                  src={imgtopbody}
                  alt="Tour du lịch"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            )}

            {/* Thanh Tìm Kiếm Đa Năng Thông Minh */}
            <div className="w-full max-w-[1050px] -mt-10 sm:-mt-12 z-20 px-2 sm:px-0">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-2xl shadow-2xl p-3.5 sm:p-4 border border-slate-100 flex flex-col lg:flex-row items-stretch gap-3"
              >
                {/* Cột 1: Điểm đến / Từ khóa */}
                <div className="flex-1 relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#4CA771] focus-within:bg-white transition-all">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[#4CA771] text-base mr-3 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Điểm đến / Tên tour
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Bạn muốn đi đâu? (Đà Nẵng, Phú Quốc...)"
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Suggestions Dropdown */}
                  {searchTerm && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-40">
                      {filteredSuggestions.map((tour) => (
                        <div
                          key={tour._id}
                          onClick={() => handleSelectSuggestion(tour._id)}
                          className="p-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-xs" />
                            <span className="text-sm font-semibold text-slate-700">{tour.title}</span>
                          </div>
                          <span className="text-xs font-bold text-[#4CA771]">
                            {tour.price?.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cột 2: Thời lượng (Custom Dropdown) */}
                <CustomDropdown
                  icon={faClock}
                  label="Thời lượng"
                  value={selectedDuration}
                  options={durationOptions}
                  onChange={setSelectedDuration}
                  className="w-full lg:w-48"
                />

                {/* Cột 3: Loại hình tour (Custom Dropdown) */}
                <CustomDropdown
                  icon={faCompass}
                  label="Loại hình tour"
                  value={selectedType}
                  options={typeOptions}
                  onChange={setSelectedType}
                  className="w-full lg:w-56"
                />

                {/* Nút Tìm kiếm */}
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all duration-200 flex-shrink-0 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
                  <span>Tìm kiếm</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbody;
