import React, { useState, useEffect } from 'react';
import { Modal, Spin, Tag, message } from 'antd';
import { fetchOrderDetail } from '../API/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faMapMarkerAlt,
  faCalendarAlt,
  faUser,
  faPhone,
  faEnvelope,
  faUsers,
  faCreditCard,
  faClock,
  faPrint,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const TicketDetailModal = ({ orderId, isOpen, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const loadDetail = async () => {
        setLoading(true);
        try {
          const data = await fetchOrderDetail(orderId);
          setOrder(data);
        } catch (err) {
          console.error(err);
          message.error(err.message || 'Không thể tải chi tiết vé');
        } finally {
          setLoading(false);
        }
      };
      loadDetail();
    } else {
      setOrder(null);
    }
  }, [isOpen, orderId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <Tag color="success" className="px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCheckCircle} /> Đã thanh toán
          </Tag>
        );
      case 'pending':
        return (
          <Tag color="warning" className="px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} /> Đang giữ chỗ / Chờ thanh toán
          </Tag>
        );
      case 'processing':
        return (
          <Tag color="processing" className="px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} /> Đang xử lý
          </Tag>
        );
      case 'canceled':
        return (
          <Tag color="error" className="px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5">
            <FontAwesomeIcon icon={faTimesCircle} /> Đã hủy
          </Tag>
        );
      default:
        return <Tag color="default">{status || 'Không xác định'}</Tag>;
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    if (Array.isArray(dateVal)) {
      return dateVal
        .map((d) => {
          const parsed = new Date(d);
          return isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleDateString('vi-VN');
        })
        .join(', ');
    }
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? String(dateVal) : d.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateVal) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    return isNaN(d.getTime())
      ? String(dateVal)
      : `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${d.toLocaleDateString('vi-VN')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
      closeIcon={<FontAwesomeIcon icon={faTimes} className="text-gray-400 hover:text-gray-700 text-lg" />}
      className="ticket-detail-modal"
    >
      {loading ? (
        <div className="py-20 text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin chi tiết vé...</p>
        </div>
      ) : order ? (
        <div className="p-2 sm:p-4 print:p-0">
          {/* Header Ticket */}
          <div className="border-b border-dashed border-gray-300 pb-4 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#4CA771] text-lg font-bold">
                  <FontAwesomeIcon icon={faTicketAlt} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 m-0">VÉ ĐIỆN TỬ GLOBETREK</h2>
                  <p className="text-xs text-slate-500 m-0">Mã đơn: <span className="font-mono font-semibold text-slate-700">{order._id}</span></p>
                </div>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {order.status === 'pending' && order.holdExpiresAt && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-800">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-amber-500 text-sm flex-shrink-0" />
                <span>
                  Đơn hàng đang được giữ chỗ đến: <strong>{formatDateTime(order.holdExpiresAt)}</strong> (Sau thời gian này nếu chưa thanh toán, vé sẽ tự động được mở lại).
                </span>
              </div>
            )}
          </div>

          {/* Tour Information Box */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row gap-4">
              {order.tour?.images?.[0] && (
                <img
                  src={order.tour.images[0]}
                  alt={order.tour?.title || 'Tour'}
                  className="w-full sm:w-28 h-28 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-1">
                    {order.tour?.title || order.tour?.name || 'Vé Tour Du Lịch'}
                  </h3>
                  {order.tour?.location && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#4CA771]" />
                      {order.tour.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-[#4CA771] mr-1" />
                    Khởi hành: <strong className="text-slate-700">{formatDate(order.bookingDate)}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Ticket Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Customer Info */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUser} className="text-[#4CA771]" /> Thông tin người liên hệ
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="font-semibold text-slate-800">{order.customerInfo?.fullName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faPhone} className="text-xs text-slate-400" /> SĐT:
                  </span>
                  <span className="font-semibold text-slate-800">{order.customerInfo?.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" /> Email:
                  </span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]" title={order.customerInfo?.email}>
                    {order.customerInfo?.email || 'Chưa cập nhật'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket & Booking Info */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUsers} className="text-[#4CA771]" /> Số lượng hành khách
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Người lớn:</span>
                  <span className="font-semibold text-slate-800">{order.adultCount || 0} vé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trẻ em:</span>
                  <span className="font-semibold text-slate-800">{order.childCount || 0} vé</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-700 font-medium">Tổng số vé:</span>
                  <span className="font-bold text-[#4CA771]">{(order.adultCount || 0) + (order.childCount || 0)} vé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-emerald-50/60 rounded-xl p-4 mb-6 border border-emerald-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-0.5">Tổng tiền thanh toán</p>
                <div className="text-2xl font-extrabold text-[#4CA771]">
                  {(order.totalValue || order.totalPrice || 0).toLocaleString('vi-VN')} <span className="text-sm font-semibold">VND</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">
                  Phương thức: <span className="font-semibold uppercase text-slate-700">{order.paymentMethod || 'PayPal'}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Thời gian tạo đơn: {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faPrint} /> In vé điện tử
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#4CA771] hover:bg-[#00875A] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          <p>Không tìm thấy thông tin vé này.</p>
        </div>
      )}
    </Modal>
  );
};

export default TicketDetailModal;
