import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUser,
  faPhone,
  faEnvelope,
  faCommentDots,
  faPenToSquare,
  faCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';

const GuestInfoForm = ({ onSave }) => {
  const [title, settitle] = useState('Ông');
  const [fullName, setfullName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setemail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedGuestInfo = JSON.parse(localStorage.getItem('passengerInfo'));
    if (savedGuestInfo) {
      settitle(savedGuestInfo.title || 'Ông');
      setfullName(savedGuestInfo.fullName || '');
      setphone(savedGuestInfo.phone || '');
      setemail(savedGuestInfo.email || '');
      setSpecialRequest(savedGuestInfo.specialRequest || '');
    } else {
      // Tự động điền theo user đăng nhập nếu có
      const userNav = JSON.parse(localStorage.getItem('userNav'));
      if (userNav) {
        setfullName(userNav.name || userNav.fullName || '');
        setemail(userNav.email || '');
        setphone(userNav.phone || '');
      } else {
        setIsEditing(true);
      }
    }
  }, []);

  const validatePhoneNumber = (p) => {
    if (!p) return true; // Có thể trống nếu đi cùng
    return p.startsWith('0') && p.length >= 10 && p.length <= 11;
  };

  const validateEmail = (e) => {
    if (!e) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleSaveGuestInfo = () => {
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên hành khách trưởng đoàn.');
      return;
    }

    if (phone && !validatePhoneNumber(phone)) {
      setError('Số điện thoại không hợp lệ (cần bắt đầu bằng số 0, 10-11 chữ số).');
      return;
    }

    if (email && !validateEmail(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    setError('');

    const passengerInfo = {
      title,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      specialRequest: specialRequest.trim(),
    };

    localStorage.setItem('passengerInfo', JSON.stringify(passengerInfo));

    if (onSave) {
      onSave(passengerInfo);
    }

    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-lg flex-shrink-0">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Thông tin hành khách đại diện</h3>
            <p className="text-xs text-slate-500">Thông tin xuất vé và danh sách hành khách đi tour.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={isEditing ? handleSaveGuestInfo : () => setIsEditing(true)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isEditing
              ? 'bg-[#4CA771] text-white hover:bg-[#3d8b5d] shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-[#4CA771]'
          }`}
        >
          <FontAwesomeIcon icon={isEditing ? faCheck : faPenToSquare} />
          <span>{isEditing ? 'Lưu thông tin' : 'Chỉnh sửa'}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Danh xưng */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Danh xưng
              </label>
              <select
                id="title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all cursor-pointer"
              >
                <option value="Ông">Ông</option>
                <option value="Bà">Bà</option>
                <option value="Cô">Cô</option>
                <option value="Anh">Anh</option>
                <option value="Chị">Chị</option>
              </select>
            </div>

            {/* Họ và tên */}
            <div className="sm:col-span-3">
              <label htmlFor="guestFullName" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Họ và tên hành khách <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  id="guestFullName"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                  placeholder="VD: Trần Thị B"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guestPhone" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Số điện thoại liên lạc
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faPhone} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  id="guestPhone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  placeholder="VD: 0987654321"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="guestEmail" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  id="guestEmail"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="VD: khachhang@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="specialRequest" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
              Yêu cầu đặc biệt (Ăn chay, dị ứng thực phẩm, chỗ ngồi...)
            </label>
            <div className="relative">
              <textarea
                id="specialRequest"
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Ghi chú yêu cầu riêng cho hướng dẫn viên..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Danh xưng & Họ tên</span>
              <span className="font-bold text-slate-800">{title} {fullName || 'Chưa cập nhật'}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Điện thoại</span>
              <span className="font-bold text-slate-800">{phone || 'Giống người liên hệ'}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Email</span>
              <span className="font-bold text-slate-800 truncate block">{email || 'Giống người liên hệ'}</span>
            </div>
          </div>

          {specialRequest && (
            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
              <FontAwesomeIcon icon={faCommentDots} className="mt-0.5" />
              <span><strong>Yêu cầu đặc biệt:</strong> {specialRequest}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <FontAwesomeIcon icon={faCircleExclamation} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default GuestInfoForm;
