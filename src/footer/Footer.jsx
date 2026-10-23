import React from 'react';
import { Link } from 'react-router-dom';
import LogoGlobe from '../assets/LogoGlobe.png';

import iata from '../assets/iata.png';
import bsi from '../assets/bsi.png';
import registered from '../assets/registered.png';

import partner from '../assets/partner.png';

// Import tất cả các hình ảnh đối tác thanh toán & mạng xã hội
import FacebookIcon from '../assets/Facebook.png';
import instagram from '../assets/instagram.png';
import tiktok from '../assets/tiktok.png';
import youtube from '../assets/youtube.png';
import telegram from '../assets/telegram.png';

import appStore from '../assets/app-store2.png';
import googlePlay from '../assets/google-play2.png';

import IconMarketingPartnership from './IconMarketingPartnership';

const Footer = () => {
  return (
    <footer className="gradient-background h-full text-gray-300 py-6">
      <div className="container max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start my-8 gap-8">
          {/* Cột 1: Logo & Chứng nhận */}
          <div className="flex flex-col max-w-sm">
            <Link to="/">
              <img src={LogoGlobe} alt="GlobeTrek Logo" className="h-16 w-auto mb-4 object-contain" />
            </Link>
            <p className="text-xs text-emerald-100/80 mb-4 leading-relaxed">
              GlobeTrek - Nền tảng đặt tour du lịch trực tuyến hàng đầu, mang đến những hành trình khám phá trọn gói, an toàn và đáng nhớ nhất.
            </p>
            <div className="grid grid-cols-3 gap-2 items-center mb-4">
              <img src={iata} alt="IATA" className="h-9 object-contain" />
              <img src={bsi} alt="BSI" className="h-9 object-contain" />
              <img src={registered} alt="Registered" className="h-9 object-contain" />
            </div>

            <button className="bg-[#013237] hover:bg-[#024950] text-white py-3 px-4 rounded-xl my-2 flex items-center gap-2 w-full sm:w-auto shadow-md transition-colors cursor-pointer">
              <IconMarketingPartnership />
              <span className="font-bold text-sm">Hợp tác cùng GlobeTrek</span>
            </button>

            <h3 className="text-white font-bold mt-4 mb-2 text-sm">Đối tác thanh toán an toàn</h3>
            <div className="flex items-center gap-3">
              <img src={partner} alt="Partner" className="p-2 h-14 bg-white rounded-xl object-contain shadow-sm" />
            </div>
          </div>

          {/* Các cột danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 flex-1">
            {/* Cột 2: Về GlobeTrek & Mạng xã hội */}
            <div>
              <h3 className="text-white font-bold mb-3 text-base">Về GlobeTrek</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Cách đặt tour du lịch
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Liên hệ chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Trung tâm trợ giúp 24/7
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Tuyển dụng Hướng dẫn viên
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Về chúng tôi
                  </Link>
                </li>
              </ul>

              <h3 className="text-white font-bold mt-6 mb-3 text-base">Theo dõi chúng tôi</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="flex items-center font-medium hover:text-white text-emerald-100/90 hover:underline">
                    <img src={FacebookIcon} alt="Facebook" className="mr-3 h-4" /> Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center font-medium hover:text-white text-emerald-100/90 hover:underline">
                    <img src={instagram} alt="Instagram" className="mr-3 h-4" /> Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center font-medium hover:text-white text-emerald-100/90 hover:underline">
                    <img src={tiktok} alt="Tiktok" className="mr-3 h-4" /> TikTok
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center font-medium hover:text-white text-emerald-100/90 hover:underline">
                    <img src={youtube} alt="Youtube" className="mr-3 h-4" /> YouTube
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 3: Dịch vụ & Điểm đến Tour */}
            <div>
              <h3 className="text-white font-bold mb-3 text-base">Dịch Vụ & Điểm Đến</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/product-body?scope=domestic" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Trong Nước
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?scope=international" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Quốc Tế
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Hạ Long" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Vịnh Hạ Long - Sapa
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Đà Nẵng" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Đà Nẵng - Hội An - Huế
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Nha Trang" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Nha Trang - Đà Lạt
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Phú Quốc" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Biển Đảo Phú Quốc
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Khám phá" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Khám Phá & Trekking
                  </Link>
                </li>
                <li>
                  <Link to="/product-body?search=Gia đình" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Doanh Nghiệp (MICE)
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="hover:text-white text-emerald-100/90 hover:underline font-medium">
                    Tour Trọn Gói Giá Tốt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Chính sách & Ứng dụng */}
            <div>
              <h3 className="text-white font-bold mb-3 text-base">Chính Sách & Quy Định</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Quy trình Đặt & Thanh toán
                  </Link>
                </li>
                <li>
                  <Link to="/Refunds" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Chính sách Hoàn & Hủy tour
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Bảo hiểm Du lịch & An toàn
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Điều khoản & Điều kiện
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Chính sách Bảo mật Thông tin
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Cẩm nang & Kinh nghiệm Đi Tour
                  </Link>
                </li>
                <li>
                  <Link to="/product-body" className="font-medium hover:text-white text-emerald-100/90 hover:underline">
                    Câu hỏi thường gặp (FAQ)
                  </Link>
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-bold text-white mb-2 text-sm">Tải ứng dụng GlobeTrek</h4>
                <div className="flex flex-col gap-2">
                  <img
                    src={googlePlay}
                    alt="Google Play"
                    className="w-32 cursor-pointer filter grayscale hover:filter-none transition-all duration-200"
                  />
                  <img
                    src={appStore}
                    alt="App Store"
                    className="w-32 cursor-pointer filter grayscale hover:filter-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền dưới chân trang */}
        <div className="border-t border-emerald-800/40 pt-4 mt-6 text-center text-xs text-emerald-200/70">
          <p>© {new Date().getFullYear()} GlobeTrek Travel. Tất cả các quyền được bảo lưu. Giấy phép kinh doanh dịch vụ lữ hành.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
