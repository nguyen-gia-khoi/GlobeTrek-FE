import React, { useState, useEffect } from 'react';
import User from "../assets/User.png";
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../redux/apiRequest';

const VITE_REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

function ProfileUser() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth?.login?.currentUser);
  const storedUser = JSON.parse(localStorage.getItem("userNav")) || {};
  const user = reduxUser || storedUser;

  const [name, setName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate data when user data loads/changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setName(user.name || user.fullName || "");
      setProfileName(user.profileName || user.username || "");
      setGender(user.gender || "Male");
      setAddress(user.address || user.city || "");

      if (user.birthDate) {
        const parts = user.birthDate.split("-");
        if (parts.length === 3) {
          setBirthYear(parts[0]);
          setBirthMonth(String(parseInt(parts[1], 10)));
          setBirthDay(String(parseInt(parts[2], 10)));
        }
      } else {
        if (user.birthDay) setBirthDay(String(user.birthDay));
        if (user.birthMonth) setBirthMonth(String(user.birthMonth));
        if (user.birthYear) setBirthYear(String(user.birthYear));
      }
    }
  }, [reduxUser]);

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      message.error("Trình duyệt của bạn không hỗ trợ thông báo.");
      return;
    }

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification();
        }
      });
    }
  };

  const showNotification = () => {
    const notification = new Notification("Thông báo từ trang web", {
      body: "Đây là nội dung thông báo.",
      icon: User
    });

    notification.onclick = () => {
      window.open(`${VITE_REDIRECT_URL}`);
    };
  };

  const handleSave = async () => {
    if (!name.trim()) {
      message.error("Vui lòng nhập tên đầy đủ!");
      return;
    }

    setLoading(true);
    const updatedData = {
      ...user,
      name: name.trim(),
      fullName: name.trim(),
      profileName: profileName.trim(),
      gender: gender,
      birthDay: birthDay,
      birthMonth: birthMonth,
      birthYear: birthYear,
      birthDate: birthYear && birthMonth && birthDay 
        ? `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}` 
        : user.birthDate || "",
      address: address.trim(),
      city: address.trim(),
    };

    try {
      await updateUserProfile(updatedData, dispatch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const currentStoredUser = JSON.parse(localStorage.getItem("userNav")) || {};
    const curr = reduxUser || currentStoredUser;
    setName(curr.name || curr.fullName || "");
    setProfileName(curr.profileName || curr.username || "");
    setGender(curr.gender || "Male");
    setAddress(curr.address || curr.city || "");
    if (curr.birthDate) {
      const parts = curr.birthDate.split("-");
      if (parts.length === 3) {
        setBirthYear(parts[0]);
        setBirthMonth(String(parseInt(parts[1], 10)));
        setBirthDay(String(parseInt(parts[2], 10)));
      }
    } else {
      setBirthDay(curr.birthDay ? String(curr.birthDay) : "");
      setBirthMonth(curr.birthMonth ? String(curr.birthMonth) : "");
      setBirthYear(curr.birthYear ? String(curr.birthYear) : "");
    }
    message.info("Đã khôi phục thông tin ban đầu.");
  };

  return (
    <div>
      <div className="bg-[rgba(174,249,231,0.5)] rounded-lg mb-6 p-4">
        <p className='sm:text-sm text-md max-w-30 w-auto'>
          Bạn muốn nhận thông báo đăng nhập mới và các hoạt động khác của
          <span
            className="font-bold text-[#4CA771] cursor-pointer"
            onClick={requestNotificationPermission}
          >
            {" "}Cho phép gửi thông báo trên máy tính?
          </span>
        </p>
      </div>
      <div className='bg-white sm:text-md text-sm rounded-md p-8 mt-4'>
        <h2 className="text-xl font-semibold mb-2">Dữ liệu cá nhân</h2>
        <hr className="mb-4" />
        
        <label className="block font-bold mb-2">Tên đầy đủ</label>
        <input 
          type="text" 
          placeholder="Nguyễn Văn A" 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block font-bold mb-2">Tên trong hồ sơ</label>
        <input 
          type="text" 
          placeholder="Tên trong hồ sơ được rút ngắn từ họ tên của bạn" 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]" 
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />

        <div className="flex justify-between mb-4">
          <div className="w-1/3 pr-2">
            <label className="block font-bold mb-2">Giới tính</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male (Nam)</option>
              <option value="Female">Female (Nữ)</option>
              <option value="Other">Other (Khác)</option>
            </select>
          </div>

          <div className="w-2/3 pl-2">
            <label className="block font-bold mb-2">Ngày sinh</label>
            <div className="flex justify-between">
              <select 
                className="w-1/3 p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-[#4CA771]"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              >
                <option value="">Ngày</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                ))}
              </select>
              <select 
                className="w-1/3 p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-[#4CA771]"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
              >
                <option value="">Tháng</option>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((month) => (
                  <option key={month} value={month}>Tháng {month}</option>
                ))}
              </select>
              <select 
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              >
                <option value="">Năm</option>
                {Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={String(year)}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <label className="block font-bold mb-2">Thành phố bạn đang ở / Địa chỉ</label>
        <input 
          type="text" 
          placeholder="Thành phố bạn đang ở" 
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            type="button"
            className="bg-[#4CA771] hover:bg-[#00875A] text-white py-2 px-6 rounded-md transition-colors font-medium disabled:opacity-50"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
