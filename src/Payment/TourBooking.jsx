import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarCheck,
  faUser,
  faChild,
  faBaby,
  faShieldHeart,
  faRotateLeft,
  faReceipt,
  faChevronRight,
  faCircleCheck,
  faLocationDot,
  faClock,
  faHeadset,
  faPlus,
  faMinus,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';
import { fetchTourById, quotePromotion, getAuthToken } from '../API/apiService';
import { isSpecialDay } from '../API/utils';
import { useDate } from '../Context/DateContext';
import VoucherSection from './VoucherSection';

const TourBooking = () => {
  const { id } = useParams();
  const { selectedDate, setSelectedDate } = useDate();
  const navigate = useNavigate();

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState({});

  // Quản lý báo giá (Quote) & Mã ưu đãi (Voucher)
  const [quote, setQuote] = useState(null);
  const [appliedCode, setAppliedCode] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bookingData'));
      return stored?.code || '';
    } catch {
      return '';
    }
  });
  const [quoteLoading, setQuoteLoading] = useState(false);

  const isLoggedIn = Boolean(getAuthToken());

  // 1. Nạp ngày đã lưu từ localStorage nếu có
  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(new Date(savedDate));
    }
  }, [setSelectedDate]);

  // 2. Tải thông tin tour từ API
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const tourData = await fetchTourById(id);
        setTour(tourData);
      } catch (error) {
        console.error('Error fetching tour data:', error);
        setErrorMessage('Không thể tải thông tin tour.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // 3. Tính toán đơn giá theo ngày khởi hành đã chọn
  const { adultPrice, childPrice, isSpecial } = useMemo(() => {
    if (!tour || !tour.price) {
      return { adultPrice: 0, childPrice: 0, isSpecial: false };
    }

    const isSpec = selectedDate ? isSpecialDay(selectedDate) : false;

    // Giá người lớn
    let aPrice = tour.price;
    if (isSpec && tour.specialAdultPrice) {
      aPrice = tour.specialAdultPrice;
    }

    // Giá trẻ em
    let cPrice = tour.childPrice || Math.round(aPrice * 0.7);
    if (isSpec && tour.specialChildPrice) {
      cPrice = tour.specialChildPrice;
    }

    return { adultPrice: aPrice, childPrice: cPrice, isSpecial: isSpec };
  }, [tour, selectedDate]);

  // 4. Tổng tiền gốc (chưa trừ voucher nếu tính tại FE)
  const totalPrice = useMemo(() => {
    return adultCount * adultPrice + childCount * childPrice;
  }, [adultCount, childCount, adultPrice, childPrice]);

  // 5. Tự động gọi Quote khi đổi số khách, lịch khởi hành hoặc mức giá
  useEffect(() => {
    if (!id || !tour || !tour.price || adultCount < 1) return;

    const token = getAuthToken();
    if (!token) {
      // Khách chưa đăng nhập: tính giá gốc bình thường
      setQuote({
        originalTotal: totalPrice,
        discountAmount: 0,
        totalValue: totalPrice,
        adultPrice,
        childPrice,
        promotion: null,
      });
      return;
    }

    let isCancelled = false;

    const fetchQuote = async () => {
      setQuoteLoading(true);
      try {
        const quoteRes = await quotePromotion({
          tourId: id,
          bookingDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
          adultCount,
          childCount,
          adultPrice,
          childPrice,
          ...(appliedCode ? { code: appliedCode } : {}),
          token,
        });

        if (!isCancelled) {
          setQuote(quoteRes);
        }
      } catch (error) {
        if (!isCancelled) {
          // Nếu đang áp mã mà việc đổi thông tin khiến mã không còn hợp lệ -> hủy mã & quote lại tự động
          if (appliedCode) {
            message.warning(`Mã ${appliedCode} không còn áp dụng được với thay đổi này: ${error.message}`);
            setAppliedCode('');
            // Gọi lại quote không kèm mã
            try {
              const fallbackQuote = await quotePromotion({
                tourId: id,
                bookingDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
                adultCount,
                childCount,
                adultPrice,
                childPrice,
                token,
              });
              if (!isCancelled) setQuote(fallbackQuote);
            } catch (fbErr) {
              if (!isCancelled) {
                setQuote({
                  originalTotal: totalPrice,
                  discountAmount: 0,
                  totalValue: totalPrice,
                  adultPrice,
                  childPrice,
                  promotion: null,
                });
              }
            }
          } else {
            setQuote({
              originalTotal: totalPrice,
              discountAmount: 0,
              totalValue: totalPrice,
              adultPrice,
              childPrice,
              promotion: null,
            });
          }
        }
      } finally {
        if (!isCancelled) setQuoteLoading(false);
      }
    };

    fetchQuote();

    return () => {
      isCancelled = true;
    };
  }, [id, tour, selectedDate, adultCount, childCount, adultPrice, childPrice, appliedCode, totalPrice]);

  // 6. Xử lý áp dụng voucher do khách nhập
  const handleApplyVoucher = async (codeToApply) => {
    const token = getAuthToken();
    if (!token) {
      message.warning('Vui lòng đăng nhập để áp dụng mã giảm giá.');
      return;
    }

    if (!codeToApply.trim()) return;

    setQuoteLoading(true);
    try {
      const res = await quotePromotion({
        tourId: id,
        bookingDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        adultCount,
        childCount,
        adultPrice,
        childPrice,
        code: codeToApply.trim().toUpperCase(),
        token,
      });

      const normalized = codeToApply.trim().toUpperCase();
      setAppliedCode(normalized);
      setQuote(res);
      message.success(`Áp dụng mã ${normalized} thành công!`);
    } catch (error) {
      // Theo contract: Mã không hợp lệ thì server trả 400. Frontend giữ báo giá thành công gần nhất và hiện message.
      message.error(error.message || 'Mã giảm giá không hợp lệ hoặc đã hết lượt.');
    } finally {
      setQuoteLoading(false);
    }
  };

  // 7. Xử lý gỡ bỏ mã voucher
  const handleRemoveVoucher = async () => {
    setAppliedCode('');
    const token = getAuthToken();

    if (token) {
      setQuoteLoading(true);
      try {
        const res = await quotePromotion({
          tourId: id,
          bookingDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
          adultCount,
          childCount,
          adultPrice,
          childPrice,
          token,
        });
        setQuote(res);
        message.info('Đã gỡ mã giảm giá.');
      } catch {
        setQuote({
          originalTotal: totalPrice,
          discountAmount: 0,
          totalValue: totalPrice,
          adultPrice,
          childPrice,
          promotion: null,
        });
      } finally {
        setQuoteLoading(false);
      }
    } else {
      setQuote({
        originalTotal: totalPrice,
        discountAmount: 0,
        totalValue: totalPrice,
        adultPrice,
        childPrice,
        promotion: null,
      });
      message.info('Đã gỡ mã giảm giá.');
    }
  };

  // 8. Tăng giảm số lượng hành khách
  const adjustCount = (setter, count, increment, min = 0) => {
    const newCount = count + increment;
    const totalPassengers = (setter === setAdultCount ? newCount : adultCount) + (setter === setChildCount ? newCount : childCount);

    if (newCount < min) {
      return;
    }
    if (totalPassengers > 30) {
      setErrorMessage('Tổng số lượng vé cho một lần đặt không được vượt quá 30 vé.');
      return;
    }

    setErrorMessage('');
    setter(newCount);
  };

  // 9. Xử lý đặt tour và chuyển tiếp
  const handleBooking = () => {
    if (adultCount < 1) {
      setErrorMessage('Quý khách cần chọn ít nhất 1 vé người lớn.');
      return;
    }

    const finalOriginalTotal = quote?.originalTotal ?? totalPrice;
    const finalDiscountAmount = quote?.discountAmount ?? 0;
    const finalTotalValue = quote?.totalValue ?? totalPrice;

    const bookingData = {
      tourId: id,
      adultCount,
      childCount,
      adultPrice,
      childPrice,
      prices: { adultPrice, childPrice },
      selectedDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
      originalTotal: finalOriginalTotal,
      discountAmount: finalDiscountAmount,
      totalValue: finalTotalValue,
      totalPrice: finalTotalValue, // đảm bảo tương thích ngược
      code: appliedCode || null,
      promotion: quote?.promotion || null,
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate(`/BookingForm/${id}`);
  };

  // 7. Định dạng ngày
  const formattedDateString = useMemo(() => {
    if (!selectedDate) return 'Chưa chọn ngày';
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = dayNames[selectedDate.getDay()];
    return `${dayName}, ${selectedDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto py-6">
        <Skeleton height={40} width={250} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton height={100} className="rounded-2xl" />
            <Skeleton height={220} className="rounded-2xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton height={380} className="rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] w-[92%] sm:w-[88%] lg:w-[80%] mx-auto">
      {/* 1. Nút quay lại & Thanh tiến trình đặt tour */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link
          to={`/ProDetail/${id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#4CA771] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs group-hover:border-[#4CA771] shadow-xs">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <span>Quay lại thông tin tour</span>
        </Link>

        {/* Stepper Progress */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-[#4CA771]">
            <span className="w-6 h-6 rounded-full bg-[#4CA771] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              1
            </span>
            <span className="font-bold">Chọn số vé</span>
          </div>

          <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs">
              2
            </span>
            <span>Thông tin khách</span>
          </div>

          <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs">
              3
            </span>
            <span>Thanh toán</span>
          </div>
        </div>
      </div>

      {/* 2. Nội dung chính: 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (7 CỘT): Tùy chỉnh số lượng vé */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Ngày tham quan đã chọn */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4CA771] border border-emerald-100 flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                  Ngày khởi hành đã chọn
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {formattedDateString}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faLocationDot} className="text-slate-400" />
                  <span>Khởi hành: {tour.location?.split(',')[0] || 'Việt Nam'}</span>
                  {tour.duration && (
                    <>
                      <span>•</span>
                      <FontAwesomeIcon icon={faClock} className="text-slate-400" />
                      <span>{tour.duration} ngày</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <Link
              to={`/ProDetail/${id}`}
              className="self-start sm:self-center px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#4CA771] border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            >
              Đổi ngày khác
            </Link>
          </div>

          {/* Card 2: Bộ chọn số lượng vé */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Số lượng hành khách</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Vui lòng chọn số lượng hành khách tương ứng với nhóm của bạn.
            </p>

            <div className="space-y-6">
              {/* Hàng 1: Người lớn */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-[#4CA771] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">Người lớn</h4>
                      <span className="text-[11px] text-slate-500 font-medium">(Từ 12 tuổi)</span>
                    </div>
                    <p className="text-sm font-bold text-[#4CA771] mt-0.5">
                      {adultPrice.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => adjustCount(setAdultCount, adultCount, -1, 1)}
                    disabled={adultCount <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-slate-900 text-sm">
                    {adultCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustCount(setAdultCount, adultCount, 1)}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-[#4CA771] hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Hàng 2: Trẻ em */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-600 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faChild} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">Trẻ em</h4>
                      <span className="text-[11px] text-slate-500 font-medium">(5 - 11 tuổi)</span>
                    </div>
                    <p className="text-sm font-bold text-[#4CA771] mt-0.5">
                      {childPrice.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => adjustCount(setChildCount, childCount, -1, 0)}
                    disabled={childCount <= 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                  </button>
                  <span className="w-6 text-center font-extrabold text-slate-900 text-sm">
                    {childCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustCount(setChildCount, childCount, 1)}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-[#4CA771] hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                  </button>
                </div>
              </div>

            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleInfo} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (5 CỘT): Tóm tắt đơn hàng & Nút Xác nhận */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sticky top-28">
            <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
              <FontAwesomeIcon icon={faReceipt} className="text-[#4CA771]" />
              <span>Thông tin thanh toán</span>
            </h3>

            {/* Tour info snippet */}
            <div className="flex gap-3.5 py-4 border-b border-slate-100">
              <img
                src={tour.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'}
                alt={tour.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-between min-w-0">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {tour.title}
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
                  <span className="truncate">{tour.location || 'Việt Nam'}</span>
                </div>
              </div>
            </div>

            {/* Voucher / Mã giảm giá */}
            <VoucherSection
              appliedCode={appliedCode}
              onApplyCode={handleApplyVoucher}
              onRemoveCode={handleRemoveVoucher}
              promotion={quote?.promotion || null}
              discountAmount={quote?.discountAmount || 0}
              loading={quoteLoading}
              isLoggedIn={isLoggedIn}
            />

            {/* Chi tiết tính tiền */}
            <div className="py-4 border-b border-slate-100 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Người lớn ({adultCount}x):</span>
                <span className="font-semibold text-slate-800">
                  {(adultCount * adultPrice).toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {childCount > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Trẻ em ({childCount}x):</span>
                  <span className="font-semibold text-slate-800">
                    {(childCount * childPrice).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Bảo hiểm & Phí dịch vụ:</span>
                <span className="font-bold text-emerald-600">Miễn phí</span>
              </div>

              {quote && quote.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold block truncate">
                      {quote.promotion?.kind === 'code'
                        ? `Mã ưu đãi: ${quote.promotion.code || appliedCode}`
                        : `Ưu đãi tự động: ${quote.promotion?.name || ''}`}
                    </span>
                    {quote.promotion?.discountType === 'percent' && (
                      <span className="text-[11px] text-emerald-600 font-semibold block">
                        Giảm {quote.promotion.discountValue}% trên tổng đơn
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-sm text-[#4CA771] whitespace-nowrap">
                    -{quote.discountAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}
            </div>

            {/* Tổng cộng */}
            <div className="pt-4 pb-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-800">Tổng thanh toán:</span>
                <div className="text-right">
                  {quote && quote.discountAmount > 0 && (
                    <span className="line-through text-xs text-slate-400 block font-semibold">
                      {(quote.originalTotal || totalPrice).toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                  <span className="text-2xl font-extrabold text-[#4CA771] block">
                    {(quote?.totalValue ?? totalPrice).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-right mt-1">
                (Đã bao gồm thuế GTGT & phí tham quan)
              </p>
            </div>

            {/* Nút Tiếp tục CTA */}
            <button
              onClick={handleBooking}
              className="w-full py-3.5 bg-[#4CA771] hover:bg-[#3d8b5d] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiếp tục: Nhập thông tin khách</span>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>

            {/* Hotline hỗ trợ */}
            <div className="mt-4 text-center">
              <a
                href="tel:19001234"
                className="text-xs font-semibold text-slate-500 hover:text-[#4CA771] inline-flex items-center gap-1.5 transition-colors"
              >
                <FontAwesomeIcon icon={faHeadset} />
                <span>Cần hỗ trợ đặt vé? Gọi ngay <strong>1900 1234</strong></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBooking;
