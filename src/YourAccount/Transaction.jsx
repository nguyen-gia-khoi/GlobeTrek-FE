
import  { useEffect, useState } from 'react';
import { Select, Typography, Card, Pagination, Button, message } from 'antd';
import SidebarMenu from './SidebarMenu';
import Header from '../header1/Header';
import Footer from '../footer/Footer';
import TicketDetailModal from './TicketDetailModal';

const { Title, Text } = Typography;

const Transaction = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

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
        setGroupedOrders(data);
        filterOrders(data, dateFilter);
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Không thể tải dữ liệu đơn hàng');
      }
    };

    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterOrders = (orders, currentFilter) => {
    let allOrders = [];

    if (!orders) {
      setFilteredOrders([]);
      return;
    }

    if (Array.isArray(orders)) {
      allOrders = orders;
    } else if (Array.isArray(orders.orders)) {
      allOrders = orders.orders;
    } else if (Array.isArray(orders.data)) {
      allOrders = orders.data;
    } else if (typeof orders === 'object') {
      Object.values(orders).forEach((val) => {
        if (Array.isArray(val)) {
          allOrders = allOrders.concat(val);
        } else if (val && typeof val === 'object' && (val._id || val.tour || val.bookingDate)) {
          allOrders.push(val);
        }
      });
    }

    // Apply date filter
    const today = new Date();
    const filterType = currentFilter !== undefined ? currentFilter : dateFilter;
    const filtered = allOrders.filter(order => {
      if (!filterType) return true; // Tất cả
      const targetDate = order.createdAt || order.bookingDate;
      if (!targetDate) return true;
      const dateVal = Array.isArray(targetDate) ? targetDate[0] : targetDate;
      const orderDate = new Date(dateVal);
      if (isNaN(orderDate.getTime())) return true;

      const diffDays = (today - orderDate) / (1000 * 60 * 60 * 24);
      if (filterType === '90-days' || filterType === '3-months') {
        return diffDays <= 90;
      } else if (filterType === '6-months') {
        return diffDays <= 180;
      }
      return true;
    });

    // Sort newest orders first
    const sortedOrders = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.bookingDate || 0);
      const dateB = new Date(b.createdAt || b.bookingDate || 0);
      return dateB - dateA;
    });

    setFilteredOrders(sortedOrders);
  };

  const handleFilterChange = (value) => {
    setDateFilter(value);
    filterOrders(groupedOrders, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'paid': return 'green';
      case 'canceled': return 'red';
      default: return 'grey';
    }
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
          <SidebarMenu />

          <div className="w-full max-w-5xl ml-5 mx-auto rounded-lg bg-white p-6 shadow-lg">
            <Title level={2} className="mb-4 text-center">Lịch sử giao dịch của tôi</Title>

            <div className="mb-4 text-center">
              <Select
                onChange={handleFilterChange}
                value={dateFilter}
                className="w-60"
                placeholder="Chọn thời gian"
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="90-days">90 ngày trước</Select.Option>
                <Select.Option value="3-months">3 tháng trước</Select.Option>
                <Select.Option value="6-months">6 tháng trước</Select.Option>
              </Select>
            </div>

            {displayOrders.length === 0 ? (
              <div className="py-8 text-center">
                <Text className="text-gray-500">Không có đơn hàng nào.</Text>
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
                    <Text>Ngày đặt: {formatBookingDate(order.bookingDate, order.createdAt)}</Text>
                    <Text className="block mt-2">
                      Mô tả Tour: {order.tour?.description || order.tour?.name || order.tour?.title || order.tourTitle || 'Vé tour du lịch'}
                    </Text>
                    <Text className="block mt-2">
                      Số lượng vé: {(order.adultCount || 0) + (order.childCount || 0) || order.ticketCount || 1}
                    </Text>
                    <Text className="text-lg font-bold block mt-2 text-green-600">
                      Tổng giá trị: {(order.totalValue || order.totalPrice || order.total || 0).toLocaleString()} VND
                    </Text>
                    <Text className="block mt-2">
                      Trạng thái:
                      <span
                        style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}
                      >
                        {order.status === 'pending' ? ' Đang chờ'
                          : order.status === 'processing' ? ' Đang xử lý'
                            : order.status === 'paid' ? ' Đã thanh toán'
                              : order.status === 'canceled' ? ' Đã hủy'
                                : 'Không xác định'}
                      </span>
                    </Text>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        type="primary"
                        size="middle"
                        className="bg-[#4CA771] hover:bg-[#00875A]"
                        onClick={() => handleOpenDetail(order._id)}
                      >
                        Xem chi tiết vé
                      </Button>
                    </div>
                  </Card>
                ))}

                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={filteredOrders.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="mt-4 text-center"
                />
              </div>
            )}
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

export default Transaction;
