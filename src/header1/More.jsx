import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faUmbrellaBeach,
  faMountainSun,
  faLandmark,
  faUtensils,
  faUsers,
  faTags,
} from '@fortawesome/free-solid-svg-icons';

const More = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer hover:bg-emerald-50 hover:text-[#4CA771] text-slate-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        type="button"
      >
        <span>Chủ đề Tour</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180 text-[#4CA771]' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50">
          <Link
            to="/product-body?search=Biển"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] font-medium rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faUmbrellaBeach} className="text-emerald-500 w-4" />
            <span>Nghỉ dưỡng & Biển đảo</span>
          </Link>

          <Link
            to="/product-body?search=Khám phá"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] font-medium rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faMountainSun} className="text-emerald-500 w-4" />
            <span>Khám phá & Trekking</span>
          </Link>

          <Link
            to="/product-body?search=Văn hóa"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] font-medium rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faLandmark} className="text-emerald-500 w-4" />
            <span>Văn hóa & Di sản</span>
          </Link>

          <Link
            to="/product-body?search=Ẩm thực"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] font-medium rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faUtensils} className="text-emerald-500 w-4" />
            <span>Ẩm thực & Trải nghiệm</span>
          </Link>

          <Link
            to="/product-body?search=Gia đình"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771] font-medium rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faUsers} className="text-emerald-500 w-4" />
            <span>Tour Gia đình & Đoàn thể</span>
          </Link>

          <div className="my-1 border-t border-slate-100"></div>

          <Link
            to="/product-body"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-[#4CA771] hover:bg-emerald-50 font-bold rounded-xl transition-all"
          >
            <FontAwesomeIcon icon={faTags} className="text-emerald-500 w-4" />
            <span>Xem tất cả danh mục</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default More;
