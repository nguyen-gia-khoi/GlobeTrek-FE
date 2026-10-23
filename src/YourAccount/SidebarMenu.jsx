import { useState } from 'react';
import { Menu, Button, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import icon1 from '../assets/icon1.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon7 from '../assets/icon7.png';
import icon9 from '../assets/icon9.png';
import { connectWallet } from '../API/apiService';
const SidebarMenu = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSection, setActiveSection] = useState('Settings');
  const user = JSON.parse(localStorage.getItem('userNav'));

  if (!user) {
    return <p className="text-center">Chưa có người dùng đăng nhập</p>;
  }

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('usernav');
    window.location.reload();
  };

  const menuItemClass = (section) =>
    `px-4 py-2 mt-2 cursor-pointer flex items-center rounded-lg transition duration-200 hover:bg-green-500 ${activeSection === section ? '' : ''}`;

  const handleConnectWallet = async () => {
    try {
      const authToken = user?.accessToken // Retrieve the token
      if (!authToken) {
        throw new Error('No authentication token found');
      }
  
      const response = await connectWallet(authToken); // Call your API function
      if (response.redirectUrl) {
        // Redirect to the provided URL
        window.location.href = response.redirectUrl;
      } else {
        console.error('No redirect URL found in response');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  return (
    <div className="mt-2 w-72 flex-shrink-0 sticky top-[185px] self-start z-20 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <Avatar src={user.avatar || '../assets/User.png'} size={64} />
        <div className="ml-4">
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <Menu mode="inline" className="py-2" theme="light">
        <Menu.Item key="points" className="flex items-center">
          0 Điểm
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="SetPlace" className={menuItemClass('SetPlace')}>
          <Link to="/setplace" onClick={() => setActiveSection('SetPlace')}>
            <img src={icon4} alt="Đặt chỗ của tôi" className="inline-block w-5 h-5 mr-2" />
            Đặt chỗ của tôi
          </Link>
        </Menu.Item>
        <Menu.Item key="Transaction" className={menuItemClass('Transaction')}>
          <Link to="/Transaction" onClick={() => setActiveSection('Transaction')}>
            <img src={icon3} alt="Danh sách giao dịch" className="inline-block w-5 h-5 mr-2" />
            Danh sách giao dịch
          </Link>
        </Menu.Item>
        <Menu.Item key="refunds" className={menuItemClass('refunds')}>
          <Link to="/Refunds" onClick={() => setActiveSection('refunds')}>
            <img src={icon5} alt="Hoàn tiền" className="inline-block w-5 h-5 mr-2" />
            Hoàn tiền <span className="ml-2 px-2 bg-yellow-200 rounded-full font-bold">New!</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="SavedPassengers" className={menuItemClass('SavedPassengers')}>
          <Link to="/SavedPassengers" onClick={() => setActiveSection('SavedPassengers')}>
            <img src={icon7} alt="Hành khách đã lưu" className="inline-block w-5 h-5 mr-2" />
            Hành khách đã lưu
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="Settings" className={menuItemClass('Settings')}>
          <Link to="/settings" onClick={() => setActiveSection('Settings')}>
            <img src={icon1} alt="Chỉnh sửa hồ sơ" className="inline-block w-5 h-5 mr-2" />
            Tài Khoản
          </Link>
        </Menu.Item>

        {/* Connect Wallet Button */}
        <Menu.Item key="connectWallet" className={menuItemClass('ConnectWallet')}>
          <button onClick={handleConnectWallet} className="flex items-center w-full text-left">
            <img src={icon3} alt="ConnectWallet" className="inline-block w-5 h-5 mr-2" />
            Kết nối ví
          </button>
        </Menu.Item>

        <Menu.Item key="logout">
          <Button type="link" onClick={() => setShowLogoutModal(true)} className="flex items-center w-full text-left">
            <img src={icon9} alt="Đăng xuất" className="inline-block w-5 h-5 mr-2" />
            Đăng xuất
          </Button>
        </Menu.Item>
      </Menu>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={cancelLogout} />
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10 relative transition-transform transform">
              <h2 className="text-2xl font-bold mb-3">Đang đăng xuất</h2>
              <p className="mb-4">
                Ôi không! Bạn sẽ bỏ lỡ rất nhiều quyền lợi khi đăng nhập: Ưu đãi độc quyền GlobeTrek, Lưu hành trình yêu thích, và những tiện ích chỉ dành riêng cho thành viên. Bạn có chắc vẫn muốn đăng xuất?
              </p>
              <div className="flex justify-end">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={cancelLogout}>Không</button>
                <button className="bg-[#4CA771] text-white px-4 py-2 rounded-md" onClick={confirmLogout}>Có</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
