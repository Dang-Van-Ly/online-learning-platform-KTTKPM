import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Smartphone, CreditCard, Loader } from 'lucide-react';
import api from '../api/axios';

const QRPaymentSimulator = ({ 
  amount, 
  email, 
  userId,
  items = [], 
  onPaymentComplete,
  onPaymentCancel 
}) => {
  const [paymentStep, setPaymentStep] = useState(1); // 1: Show QR, 2: Processing, 3: Success
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown
  const [selectedMethod, setSelectedMethod] = useState('vnpay'); // momo, zalopay, bank, vnpay
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Format amount
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount || 0);

  const getQRCodeUrl = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const qrData = selectedMethod === 'vnpay' && paymentUrl ? paymentUrl : generateQRData(selectedMethod);
    const size = '300x300';
    const color = selectedMethod === 'momo' ? 'AF0F6E' : 
                  selectedMethod === 'zalopay' ? '0066FF' : 
                  selectedMethod === 'vnpay' ? '005BA3' : '008000';

    return `${baseUrl}?size=${size}&data=${encodeURIComponent(qrData)}&color=${color}&bgcolor=FFFFFF&margin=10`;
  };

  const generateQRData = (method) => {
    const itemNames = items.map(item => item.name).join(', ');
    const description = `Thanh toán khóa học: ${itemNames}`;

    switch (method) {
      case 'momo':
        return `momo://pay?amount=${amount}&note=${encodeURIComponent(description)}`;
      case 'zalopay':
        return `zalo://qr?amount=${amount}&memo=${encodeURIComponent(description)}`;
      case 'vnpay':
        return paymentUrl || `Thanh toán VNPay: ${description}`;
      case 'bank':
      default:
        return `banktransfer://pay?amount=${amount}&bank=VIETCOMBANK&desc=${encodeURIComponent(description)}`;
    }
  };

  // Get method logo
  const getMethodLogo = (method) => {
    switch(method) {
      case 'momo':
        return 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png';
      case 'zalopay':
        return 'https://upload.wikimedia.org/wikipedia/vi/7/7c/ZaloPay-logo-2022.svg';
      case 'vnpay':
        return 'https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png';
      case 'bank':
        return 'https://cdn-icons-png.flaticon.com/512/2830/2830285.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/2830/2830285.png';
    }
  };

  // Get method name
  const getMethodName = (method) => {
    switch(method) {
      case 'momo': return 'Ví MoMo';
      case 'zalopay': return 'Ví ZaloPay';
      case 'vnpay': return 'VNPay QR';
      case 'bank': return 'Chuyển khoản ngân hàng';
      default: return 'QR Code';
    }
  };

  const getMethodInstructions = (method) => {
    switch(method) {
      case 'momo':
        return [
          'Mở ứng dụng MoMo.',
          'Chọn chức năng "Quét mã QR".',
          'Hướng camera về mã QR trên màn hình.',
          'Kiểm tra thông tin và xác nhận thanh toán.'
        ];
      case 'zalopay':
        return [
          'Mở ứng dụng ZaloPay.',
          'Chọn mục "Quét mã".',
          'Quét mã QR trên màn hình.',
          'Xác nhận số tiền và hoàn tất.'
        ];
      case 'vnpay':
        return [
          'Mở ứng dụng ngân hàng hoặc VNPay-QR.',
          'Chọn chức năng "Quét mã QR".',
          'Quét mã QR trên màn hình.',
          'Kiểm tra thông tin và xác nhận thanh toán.'
        ];
      case 'bank':
      default:
        return [
          'Mở ứng dụng ngân hàng của bạn.',
          'Chọn chức năng chuyển khoản.',
          'Nhập số tài khoản và nội dung chuyển khoản.',
          'Xác nhận và hoàn tất giao dịch.'
        ];
    }
  };

  const getBankDetails = () => {
    if (selectedMethod !== 'vnpay') return null;

    return {
      bankName: 'VNPay QR',
      accountName: 'BTL KTTKPM',
      accountNumber: '7044888123',
      note: 'Thanh toán khóa học'
    };
  };

  const handleManualComplete = async () => {
    if (!orderId) {
      setPaymentError('Chưa tạo đơn hàng VNPay. Vui lòng thử lại.');
      return;
    }

    try {
      const host = window.location.hostname;
      const orderServicePort = 8083;
      const url = `http://${host}:${orderServicePort}/api/orders/public/${orderId}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      const statusText = await response.text();
      if (statusText === 'PAID' || statusText === 'COMPLETED') {
        setPaymentStep(4);
        if (onPaymentComplete) onPaymentComplete({ orderId, status: statusText, selectedMethod });
      } else {
        setPaymentError('Thanh toán chưa hoàn tất. Vui lòng kiểm tra lại ứng dụng VNPay và thử lại sau.');
      }
    } catch (error) {
      console.error('Error confirming VNPay payment', error);
      setPaymentError('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    let mounted = true;
    const createVnpayOrder = async () => {
      if (selectedMethod !== 'vnpay' || orderId || isProcessing) return;

      setIsProcessing(true);
      setPaymentError('');
      try {
        const res = await api.post('/orders/vnpay', {
          userId: typeof userId !== 'undefined' ? userId : null,
          userEmail: email || null,
          totalPrice: amount || 0,
          status: 'PENDING',
          paymentMethod: 'VNPAY',
          orderItems: (items || []).map(i => ({ courseId: i.id, price: i.price })),
        });
        if (mounted && res?.data) {
          setOrderId(res.data.orderId);
          setPaymentUrl(res.data.paymentUrl);
        }
      } catch (e) {
        console.error('Could not create VNPay order', e);
        if (mounted) {
          setPaymentError('Lỗi khi tạo đơn VNPay. Vui lòng thử lại.');
        }
      } finally {
        if (mounted) {
          setIsProcessing(false);
        }
      }
    };

    createVnpayOrder();
    return () => {
      mounted = false;
    };
  }, [selectedMethod, amount, email, items, orderId, userId, isProcessing]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentStep === 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentStep === 1) {
      setPaymentStep(5); // Timeout
    }
  }, [countdown, paymentStep]);

  // Format countdown
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let mounted = true;
    const createVnpayOrder = async () => {
      if (selectedMethod !== 'vnpay' || orderId || isProcessing) return;

      setIsProcessing(true);
      setPaymentError('');
      try {
        const res = await api.post('/orders/vnpay', {
          userId: typeof userId !== 'undefined' ? userId : null,
          userEmail: email || null,
          totalPrice: amount || 0,
          status: 'PENDING',
          paymentMethod: 'VNPAY',
          orderItems: (items || []).map(i => ({ courseId: i.id, price: i.price })),
        });
        if (mounted && res?.data) {
          setOrderId(res.data.orderId);
          setPaymentUrl(res.data.paymentUrl);
        }
      } catch (e) {
        console.error('Could not create VNPay order', e);
        if (mounted) {
          setPaymentError('Lỗi khi tạo đơn VNPay. Vui lòng thử lại.');
        }
      } finally {
        if (mounted) {
          setIsProcessing(false);
        }
      }
    };

    createVnpayOrder();
    return () => {
      mounted = false;
    };
  }, [selectedMethod, amount, email, items, orderId, userId, isProcessing]);

  // Poll order status and finish payment when backend reports PAID/COMPLETED
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      try {
        const host = window.location.hostname;
        const orderServicePort = 8083;
        const url = `http://${host}:${orderServicePort}/api/orders/public/${orderId}`;
        const r = await fetch(url, { method: 'GET' });
        if (!r.ok) {
          throw new Error(`status ${r.status}`);
        }
        const statusText = await r.text();
        if (!cancelled && (statusText === 'PAID' || statusText === 'COMPLETED')) {
          setPaymentStep(4);
          if (onPaymentComplete) onPaymentComplete({ orderId, status: statusText, selectedMethod });
          clearInterval(interval);
        }
      } catch (e) {
        console.error('Error polling order status', e);
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderId, onPaymentComplete, selectedMethod]);

  const instructions = React.useMemo(
    () => getMethodInstructions(selectedMethod || 'vnpay'),
    [selectedMethod]
  );

  // Handle cancel
  const handleCancel = () => {
    if (onPaymentCancel) onPaymentCancel();
  };

  return (
    <div className="qr-payment-simulator">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thanh toán bằng QR Code</h3>
        <p className="text-gray-600">Quét mã QR để hoàn tất thanh toán</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Chọn phương thức thanh toán:</p>
        <div className="grid grid-cols-4 gap-2">
          {['momo', 'zalopay', 'vnpay', 'bank'].map((method) => (
            <button
              key={method}
              onClick={() => {
                setSelectedMethod(method);
                setCountdown(180);
                setPaymentStep(1);
              }}
              className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                selectedMethod === method 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={getMethodLogo(method)} 
                alt={method}
                className="h-8 w-8 object-contain mb-1"
              />
              <span className="text-xs font-medium text-gray-700 text-center">
                {getMethodName(method)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* QR Code Display */}
      <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-blue-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Thời gian còn lại: <span className="font-bold text-red-500">{formatCountdown(countdown)}</span>
            </span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {formattedAmount}đ
          </div>
        </div>

        {/* QR Code Container */}
        <div className="relative">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <img
              src={getQRCodeUrl()}
              alt="Mã QR thanh toán"
              className="mx-auto h-64 w-64"
            />
            
            {/* Method Overlay */}
            <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md">
              <img 
                src={getMethodLogo(selectedMethod)} 
                alt={selectedMethod}
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Processing Animation */}
          {paymentStep === 3 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
              <div className="text-center">
                <div className="animate-pulse mb-2">
                  <CreditCard className="h-12 w-12 text-white mx-auto" />
                </div>
                <p className="text-white font-medium">Đang xử lý thanh toán...</p>
              </div>
            </div>
          )}

          {/* Success Animation */}
          {paymentStep === 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 bg-opacity-90 rounded-xl">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-white mx-auto mb-2 animate-bounce" />
                <p className="text-white font-bold text-xl">Thanh toán thành công!</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-semibold">{formattedAmount}đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phương thức:</span>
            <span className="font-semibold">{getMethodName(selectedMethod)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-semibold text-right">Thanh toán khóa học</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Hướng dẫn thanh toán:</h4>
        <div className="space-y-3 text-sm text-gray-600">
          {instructions.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">{index + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {paymentStep === 1 && (
          <>
            <button
              onClick={handleManualComplete}
              disabled={!orderId || isProcessing}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tôi đã quét mã và thanh toán
            </button>
            {isProcessing && (
              <div className="text-sm text-gray-600">Đang tạo đơn VNPay, vui lòng chờ...</div>
            )}
            {paymentError && (
              <div className="rounded-2xl bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700">
                {paymentError}
              </div>
            )}
          </>
        )}

        {paymentStep === 4 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-3">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Thanh toán đã hoàn tất!</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Đơn hàng của bạn đang được xử lý...</p>
          </div>
        )}

        <button
          onClick={handleCancel}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition"
        >
          Hủy thanh toán
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${
                paymentStep >= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {step === 1 && 'QR'}
                {step === 2 && '📱'}
                {step === 3 && '⚡'}
                {step === 4 && '✓'}
              </div>
              <span className="text-xs text-gray-600">
                {step === 1 && 'Hiển thị QR'}
                {step === 2 && 'Quét mã'}
                {step === 3 && 'Xử lý'}
                {step === 4 && 'Hoàn tất'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRPaymentSimulator;