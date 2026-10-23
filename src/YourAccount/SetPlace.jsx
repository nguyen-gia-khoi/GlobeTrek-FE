/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Pagination, Button, message } from 'antd';
import SidebarMenu from './SidebarMenu';
import Header from '../header1/Header';
import Footer from '../footer/Footer';
import TicketDetailModal from './TicketDetailModal';

const { Title, Text } = Typography;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SetPlace = ({ setSelectedSection }) => {
  const [todayOrders, setTodayOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [paypalToken, setPaypalToken] = useState(null); // State để lưu token từ URL
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  // Xử lý redirect từ PayPal và lưu token
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token'); // paypalOrderId
    const payerId = query.get('PayerID');

    if (token && payerId) {
      setPaypalToken(token); // Lưu token vào state
      // Không gọi capture ngay, chờ người dùng nhấn nút
    }
  }, [location]);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userNav')) || {};
        const accessToken =
          user?.accessToken ||
          user?.token?.accessToken ||
          user?.token ||
          user?.accesstoken;

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await fetch(`${BASE_URL}/orders/api/list`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        parseAndSetOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Không thể tải dữ liệu đơn hàng');
      }
    };

    const parseAndSetOrders = (data) => {
      if (!data) {
        setTodayOrders([]);
        return;
      }
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.orders)) {
        list = data.orders;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      } else if (typeof data === 'object') {
        Object.values(data).forEach((val) => {
          if (Array.isArray(val)) {
            list = list.concat(val);
          } else if (val && typeof val === 'object' && (val._id || val.tour || val.bookingDate)) {
            list.push(val);
          }
        });
      }

      // Sắp xếp đơn hàng mới nhất lên đầu
      list.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.bookingDate || 0);
        const dateB = new Date(b.createdAt || b.bookingDate || 0);
        return dateB - dateA;
      });

      setTodayOrders(list);
    };

    fetchOrders();
  }, []);

  // Hàm xác nhận thanh toán PayPal
  const capturePaypalPayment = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem('userNav')) || {};
      const accessToken =
        user?.accessToken ||
        user?.token?.accessToken ||
        user?.token ||
        user?.accesstoken;

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      if (!paypalToken) {
        throw new Error("Không tìm thấy PayPal token");
      }

      const response = await fetch(`${BASE_URL}/orders/api/paypal/capture-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: orderId,
          paypalOrderId: paypalToken, // Sử dụng token từ URL
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Cập nhật trạng thái đơn hàng trong UI
        setTodayOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId ? { ...o, status: 'paid' } : o
          )
        );
        message.success('Thanh toán PayPal thành công!');
        setPaypalToken(null); // Xóa token sau khi sử dụng
        navigate('/setplace', { replace: true }); // Xóa query params khỏi URL
      } else {
        message.error('Xác nhận thanh toán thất bại');
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      message.error('Không thể xác nhận thanh toán PayPal');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem('userNav')) || {};
      const accessToken =
        user?.accessToken ||
        user?.token?.accessToken ||
        user?.token ||
        user?.accesstoken;

      const response = await fetch(`${BASE_URL}/orders/api/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodayOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'canceled' } : order
        )
      );
      message.success('Hủy đơn hàng thành công');
    } catch (error) {
      console.error('Error canceling order:', error.message);
      message.error('Không thể hủy đơn hàng');
    }
  };

  const refundOrder = async (orderID) => {
    try {
      const user = JSON.parse(localStorage.getItem('userNav')) || {};
      const accessToken =
        user?.accessToken ||
        user?.token?.accessToken ||
        user?.token ||
        user?.accesstoken;

      const response = await fetch(`${BASE_URL}/orders/api/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodayOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderID ? { ...order, status: 'canceled' } : order
        )
      );
      message.success('Hoàn tiền thành công');
    } catch (error) {
      console.error('Error refunding order:', error.message);
      message.error('Không thể hoàn tiền');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayOrders = todayOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'paid': return 'green';
      case 'canceled': return 'red';
      default: return 'gray';
    }
  };

  const canCancelTour = (status) => {
    return status !== 'canceled' && status !== 'paid';
  };

  const canRefundTour = (status, bookingDate) => {
    if (status !== 'paid') return false;
    const today = new Date();
    const dateVal = Array.isArray(bookingDate) ? bookingDate[0] : bookingDate;
    const booking = new Date(dateVal);
    if (isNaN(booking.getTime())) return false;
    const diffDays = Math.ceil((booking - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 2;
  };

  const formatBookingDate = (dateVal, createdAt) => {
    const target = dateVal || createdAt;
    if (!target) return 'N/A';
    if (Array.isArray(target)) {
      return target.map(d => {
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleDateString('vi-VN');
      }).join(', ');
    }
    const d = new Date(target);
    return isNaN(d.getTime()) ? String(target) : d.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <Header />
      <div className="w-full mt-36 h-auto">
        <div className="flex max-w-[1280px] justify-center mx-auto flex-row items-start pb-10">
          <SidebarMenu setSelectedSection={setSelectedSection} />
          <div className="w-full max-w-5xl ml-5 mx-auto rounded-lg">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Vé điện tử & phiếu thanh toán hiện hành</h3>
              <div className="bg-white shadow-lg rounded-xl p-4 mt-2">
                {displayOrders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Text className="text-gray-500 block">Không có đơn hàng nào.</Text>
                  </div>
                ) : (
                  <div>
                    {displayOrders.map((order) => (
                      <Card
                        key={order._id}
                        className="mb-4 shadow-md hover:shadow-lg transition duration-300"
                        style={{ borderRadius: '12px', backgroundColor: '#f9fafb' }}
                      >
                        <div className="border-b border-gray-200 pb-2 mb-3">
                          <Title level={4} className="text-gray-800 m-0">Mã đặt chỗ: {order._id}</Title>
                        </div>
                        <Text>Ngày đặt / Khởi hành: {formatBookingDate(order.bookingDate, order.createdAt)}</Text>
                        <Text className="text-gray-600 block mt-2">
                          Mô tả Tour: {order.tour?.description || order.tour?.name || order.tour?.title || order.tourTitle || 'Vé tour du lịch'}
                        </Text>
                        <Text className="block mt-2">
                          Số lượng vé: {(order.adultCount || 0) + (order.childCount || 0) || order.ticketCount || 1}
                        </Text>
                        <Text className="text-lg font-bold block mt-2 text-green-600">
                          Tổng giá trị: {(order.totalValue || order.totalPrice || order.total || 0).toLocaleString()} VND
                        </Text>
                        <Text
                          className="text-lg font-bold block mt-2"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          Trạng thái: {order.status === 'canceled' ? 'Đã hủy' : order.status === 'paid' ? 'Đã thanh toán' : order.status === 'pending' ? 'Đang chờ xử lý' : order.status}
                        </Text>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <Button
                            type="primary"
                            size="middle"
                            className="bg-[#4CA771] hover:bg-[#00875A]"
                            onClick={() => handleOpenDetail(order._id)}
                          >
                            Xem chi tiết vé
                          </Button>

                          {/* Hiển thị nút "Thanh toán bằng PayPal" nếu có token và trạng thái phù hợp */}
                          {(order.status === 'pending' || order.status === 'processing') &&
                            order.paymentMethod === 'paypal' && paypalToken && (
                              <Button
                                type="primary"
                                size="middle"
                                onClick={() => capturePaypalPayment(order._id)}
                              >
                                Xác nhận thanh toán PayPal
                              </Button>
                            )}

                          {canCancelTour(order.status) && (
                            <Button
                              type="default"
                              danger
                              size="middle"
                              onClick={() => cancelOrder(order._id)}
                            >
                              Hủy Đơn Hàng
                            </Button>
                          )}

                          {canRefundTour(order.status, order.bookingDate) && (
                            <Button
                              type="default"
                              size="middle"
                              onClick={() => refundOrder(order._id)}
                            >
                              Hoàn Tiền
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={todayOrders.length}
                  onChange={handlePageChange}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TicketDetailModal
        orderId={selectedOrderId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <Footer />
    </>
  );
};

export default SetPlace;