import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, Tag, message } from 'antd';
import { fetchOrderDetail } from '../API/apiService';
import Header from '../header1/Header';
import Footer from '../footer/Footer';
import SidebarMenu from './SidebarMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faMapMarkerAlt,
  faCalendarAlt,
  faUser,
  faPhone,
  faEnvelope,
  faUsers,
  faClock,
  faPrint,
  faArrowLeft,
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const TicketDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
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
    }
  }, [orderId]);

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
    <>
      <Header />
      <div className="w-full mt-36 h-auto">
        <div className="flex max-w-[1280px] justify-center mx-auto flex-row items-start pb-10">
          <SidebarMenu />

          <div className="w-full max-w-5xl ml-5 mx-auto rounded-lg">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm font-semibold text-slate-600 hover:text-[#4CA771] flex items-center gap-1.5 cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200">
              {loading ? (
                <div className="py-20 text-center">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin chi tiết vé...</p>
                </div>
              ) : order ? (
                <div>
                  {/* Header Ticket */}
                  <div className="border-b border-dashed border-gray-300 pb-5 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#4CA771] text-xl font-bold">
                          <FontAwesomeIcon icon={faTicketAlt} />
                        </div>
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 m-0">VÉ ĐIỆN TỬ GLOBETREK</h1>
                          <p className="text-sm text-slate-500 m-0">
                            Mã đặt chỗ: <span className="font-mono font-bold text-slate-800">{order._id}</span>
                          </p>
                        </div>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    {order.status === 'pending' && order.holdExpiresAt && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2.5 text-sm text-amber-800">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-amber-500 text-base flex-shrink-0" />
                        <span>
                          Đơn hàng đang được giữ chỗ đến: <strong>{formatDateTime(order.holdExpiresAt)}</strong>. Vui lòng thanh toán trước thời gian này.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tour Information Box */}
                  <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {order.tour?.images?.[0] && (
                        <img
                          src={order.tour.images[0]}
                          alt={order.tour?.title || 'Tour'}
                          className="w-full sm:w-40 h-36 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug mb-2">
                            {order.tour?.title || order.tour?.name || 'Vé Tour Du Lịch'}
                          </h2>
                          {order.tour?.location && (
                            <p className="text-sm text-slate-600 flex items-center gap-1.5 mb-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#4CA771]" />
                              {order.tour.location}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                          <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#4CA771] mr-1.5" />
                            Khởi hành: <strong className="text-slate-800">{formatDate(order.bookingDate)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Ticket Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    {/* Customer Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#4CA771]" /> Thông tin người liên hệ
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Họ và tên:</span>
                          <span className="font-semibold text-slate-800">{order.customerInfo?.fullName || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <FontAwesomeIcon icon={faPhone} className="text-xs text-slate-400" /> Số điện thoại:
                          </span>
                          <span className="font-semibold text-slate-800">{order.customerInfo?.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" /> Email:
                          </span>
                          <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]" title={order.customerInfo?.email}>
                            {order.customerInfo?.email || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket & Booking Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="text-[#4CA771]" /> Chi tiết số lượng vé
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vé người lớn:</span>
                          <span className="font-semibold text-slate-800">{order.adultCount || 0} vé</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vé trẻ em:</span>
                          <span className="font-semibold text-slate-800">{order.childCount || 0} vé</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-100">
                          <span className="text-slate-700 font-semibold">Tổng số vé:</span>
                          <span className="font-bold text-[#4CA771] text-base">{(order.adultCount || 0) + (order.childCount || 0)} vé</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-emerald-50/70 rounded-xl p-5 mb-6 border border-emerald-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tổng tiền thanh toán</p>
                        {order.discountAmount > 0 && (
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="line-through text-slate-400 font-semibold">
                              {(order.originalTotal || 0).toLocaleString('vi-VN')} VND
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-[#4CA771] font-bold rounded-full">
                              Tiết kiệm: -{(order.discountAmount || 0).toLocaleString('vi-VN')} VND
                            </span>
                          </div>
                        )}
                        <div className="text-3xl font-extrabold text-[#4CA771]">
                          {(order.totalValue || order.totalPrice || 0).toLocaleString('vi-VN')} <span className="text-base font-semibold">VND</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">
                          Phương thức: <span className="font-semibold uppercase text-slate-700">{order.paymentMethod || 'PayPal'}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Thời gian tạo: {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 print:hidden">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPrint} /> In vé điện tử
                    </button>
                    <Link
                      to="/setplace"
                      className="px-5 py-2.5 bg-[#4CA771] hover:bg-[#00875A] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Về trang Đặt chỗ của tôi
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <p className="text-base">Không tìm thấy thông tin vé này.</p>
                  <Link to="/setplace" className="text-[#4CA771] font-semibold hover:underline mt-2 inline-block">
                    Quay lại danh sách đặt chỗ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TicketDetailPage;
