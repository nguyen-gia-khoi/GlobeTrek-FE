import React, { useState } from "react";
import Modal from "react-modal";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/apiRequest";

Modal.setAppElement("#root");

function AddPhone() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth?.login?.currentUser);
  const storedUser = JSON.parse(localStorage.getItem("userNav")) || {};
  const user = reduxUser || storedUser;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState("");
  const [phones, setPhones] = useState([]);

  if (!user || (!user.email && !user._id)) {
    return <p className="p-4 text-gray-500">Chưa có người dùng đăng nhập</p>;
  }

  const primaryPhone = user.phone || user.phoneNumber;

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewPhone("");
    setError("");
  };

  const handleAddPhone = async () => {
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(newPhone.trim())) {
      setError("Số điện thoại không hợp lệ! Vui lòng nhập từ 9 đến 11 chữ số.");
      return;
    }

    if (!primaryPhone) {
      // If user had no primary phone, set it as primary phone
      const updatedUser = {
        ...user,
        phone: newPhone.trim(),
        phoneNumber: newPhone.trim(),
      };
      await updateUserProfile(updatedUser, dispatch);
    } else {
      setPhones([...phones, newPhone.trim()]);
      message.success("Thêm số di động thành công!");
    }

    closeModal();
  };

  return (
    <div>
      <div className="bg-white rounded-md p-8 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold mt-6 mb-2">Số di động</h3>
            <p className="text-gray-500 text-sm">Chỉ có thể sử dụng tối đa 3 số di động</p>
          </div>
          <button 
            className="text-white py-2 px-4 rounded-md bg-[#4CA771] hover:bg-[#00875A] mb-4 transition-colors"
            onClick={openModal}
          >
            + Thêm số di động
          </button>
        </div>
        <hr className="mb-4" />
        
        {primaryPhone ? (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center justify-normal">
              <p className="font-medium text-slate-800">{primaryPhone}</p>
              <span className="text-[#4CA771] ml-4 text-sm font-semibold">Nơi nhận thông báo</span>
            </div>
            <div>
              <span className="text-red-500 cursor-pointer hover:text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic mb-2">Chưa cập nhật số điện thoại</p>
        )}

        {phones.map((p, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="flex items-center justify-normal">
              <p className="font-medium text-slate-800">{p}</p>
              <span className="text-[#4CA771] ml-4 text-sm font-semibold">Nơi nhận thông báo</span>
            </div>
            <div>
              <span 
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => setPhones(phones.filter((_, i) => i !== index))}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Thêm số di động"
        className="bg-white p-8 rounded-lg max-w-md w-full mx-auto mt-28 shadow-xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      >
        <h2 className="text-xl font-bold mb-4 text-slate-800">Thêm số di động mới</h2>
        <p className="text-gray-600 text-sm mb-1">Số điện thoại</p>
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="w-full p-2.5 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4CA771]"
          placeholder="Ví dụ: 0912345678"
        />
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            onClick={closeModal}
          >
            Hủy
          </button>
          <button
            className="bg-[#4CA771] hover:bg-[#00875A] text-white py-2 px-4 rounded-md transition-colors"
            onClick={handleAddPhone}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AddPhone;
