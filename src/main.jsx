import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { setupAuthInterceptors } from './API/authInterceptor';

// Khởi chạy interceptor tự động logout khi hết hạn token (áp dụng cho cả fetch và axios)
setupAuthInterceptors();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
