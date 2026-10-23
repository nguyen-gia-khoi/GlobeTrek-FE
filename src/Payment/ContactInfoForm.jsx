import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faUser,
  faPhone,
  faEnvelope,
  faPenToSquare,
  faCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';

const ContactInfoForm = ({ onSave }) => {
  const [fullName, setfullName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setemail] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra nếu đã có customerInfo trong localStorage
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    if (customerInfo) {
      setfullName(customerInfo.fullName || '');
      setphone(customerInfo.phone || '');
      setemail(customerInfo.email || '');
      return;
    }

    // 2. Nếu chưa có, lấy từ userNav đăng nhập
    const userNav = JSON.parse(localStorage.getItem('userNav'));
    if (userNav) {
      setfullName(userNav.name || userNav.fullName || '');
      setemail(userNav.email || '');
      setphone(userNav.phone || '');
      setIsEditing(!userNav.phone); // Nếu chưa có số đt thì mở chế độ điền
    } else {
      setIsEditing(true); // Chưa có thông tin thì mặc định mở form
    }
  }, []);

  const validatePhoneNumber = (p) => {
    return p.startsWith('0') && p.length >= 10 && p.length <= 11;
  };

  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleSaveContactInfo = () => {
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên người liên hệ.');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError('Số điện thoại phải bắt đầu bằng số 0 và có 10-11 chữ số.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email nhận thông báo vé không hợp lệ.');
      return;
    }

    setError('');

    const customerInfo = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));

    if (onSave) {
      onSave(customerInfo);
    }

    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-lg flex-shrink-0">
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Thông tin liên hệ nhận vé</h3>
            <p className="text-xs text-slate-500">Mã đặt chỗ và vé điện tử sẽ được gửi về email/số điện thoại này.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={isEditing ? handleSaveContactInfo : () => setIsEditing(true)}
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
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
              Họ và tên người liên hệ <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Số điện thoại di động <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faPhone} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                Email nhận vé <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="VD: nguyenvana@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4CA771] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Họ tên</span>
            <span className="font-bold text-slate-800">{fullName || 'Chưa cập nhật'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Điện thoại</span>
            <span className="font-bold text-slate-800">{phone || 'Chưa cập nhật'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Email</span>
            <span className="font-bold text-slate-800 truncate block">{email || 'Chưa cập nhật'}</span>
          </div>
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

export default ContactInfoForm;
