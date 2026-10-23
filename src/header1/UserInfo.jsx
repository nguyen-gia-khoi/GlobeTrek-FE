import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import User from "../assets/User.png";
import icon1 from '../assets/icon1.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon7 from '../assets/icon7.png';
import icon9 from '../assets/icon9.png';
import LoadingLogin from '../../src/LoadingLogin';

const UserInfo = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const storedUser = localStorage.getItem("userNav");

  // Parse the stored user data
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <p> <LoadingLogin /></p>;
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userNav");
    window.location.reload();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <h2
          className="cursor-pointer flex hover:bg-slate-100 rounded-md py-2 px-10 text-sm font-medium"
          onClick={toggleDropdown}
        >
          <img
            className="w-6 h-6 bg-[#00875A] rounded-full mr-4"
            src={User}
            alt="User"
          />
          {user.name || user.email}
        </h2>
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <ul className="py-2">
            <li className="px-4 py-2 cursor-pointer hover:bg-green-100">0 Điểm</li>
            <Link to='/settings'>
              <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
                <img src={icon1} alt="Chỉnh sửa hồ sơ" className="w-4 h-4 mr-2" />
                Chỉnh sửa hồ sơ
              </li>
            </Link>
            <Link to='/Transaction'>
              <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
                <img src={icon3} alt="Danh sách giao dịch" className="w-4 h-4 mr-2" />
                Danh sách giao dịch
              </li>
            </Link>
            <Link to='/setplace'>
              <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
                <img src={icon4} alt="Đặt chỗ của tôi" className="w-4 h-4 mr-2" />
                Đặt chỗ của tôi
              </li>
            </Link>
            <Link to='/Refunds'>
              <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
                <img src={icon5} alt="Hoàn tiền" className="w-4 h-4 mr-2" />
                Hoàn tiền <span className="mr-2 px-2 bg-yellow-200 rounded-full font-bold">New!</span>
              </li>
            </Link>
            <Link to='/SavedPassengers'>
              <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
                <img src={icon7} alt="Thông tin hành khách đã lưu" className="w-4 h-4 mr-2" />
                Thông tin hành khách đã lưu
              </li>
            </Link>
            <li className="px-4 py-2 hover:bg-green-100 cursor-pointer flex items-center">
              <button
                className="flex items-center py-2 hover:bg-green-100 cursor-pointer"
                onClick={() => setShowLogoutModal(true)}
              >
                <img src={icon9} alt="Đăng xuất" className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={cancelLogout}
          />
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10 relative transition-transform transform">
              <h2 className="text-2xl font-bold mb-3">Đang đăng xuất</h2>
              <p className="mb-4">
                Ôi không! Bạn sẽ bỏ lỡ rất nhiều quyền lợi khi đăng nhập: Ưu đãi độc quyền GlobeTrek, Lưu hành trình yêu thích, và những tiện ích chỉ dành riêng cho thành viên. Bạn có chắc vẫn muốn đăng xuất?
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={cancelLogout}
                >
                  Không
                </button>
                <button
                  className="bg-[#4CA771] text-white px-4 py-2 rounded-md"
                  onClick={confirmLogout}
                >
                  Có
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
