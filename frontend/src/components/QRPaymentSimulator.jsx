import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Smartphone, CreditCard, Landmark, Loader } from "lucide-react";

const QRPaymentSimulator = ({
  amount,
  email,
  items = [],
  onPaymentComplete,
  onPaymentCancel
}) => {
  const [paymentStep, setPaymentStep] = useState(1); // 1: Show QR, 2: Scanning, 3: Processing, 4: Success
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown
  const [selectedMethod, setSelectedMethod] = useState('momo'); // momo, zalopay, bank, vnpay
  const [isProcessing, setIsProcessing] = useState(false);

  // Format amount
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount || 0);

  // Generate QR data
  const generateQRData = () => {
    const itemNames = items.map(item => item.name).join(', ');
    const data = {
      type: 'PAYMENT',
      amount: amount,
      currency: 'VND',
      description: `Thanh toán khóa học: ${itemNames}`,
      account: email,
      timestamp: new Date().toISOString(),
      method: selectedMethod
    };
    return encodeURIComponent(JSON.stringify(data));
  };

  // QR code URL with selected method logo
  const getQRCodeUrl = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const qrData = generateQRData();
    const size = '300x300';
    const color = selectedMethod === 'momo' ? 'AF0F6E' :
      selectedMethod === 'zalopay' ? '0066FF' :
        selectedMethod === 'vnpay' ? '005BA3' : '008000';

    return `${baseUrl}?size=${size}&data=${qrData}&color=${color}&bgcolor=FFFFFF&margin=10`;
  };

  // Get method logo
  const getMethodLogo = () => {
    switch (selectedMethod) {
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
  const getMethodName = () => {
    switch (selectedMethod) {
      case 'momo': return 'Ví MoMo';
      case 'zalopay': return 'Ví ZaloPay';
      case 'vnpay': return 'VNPay QR';
      case 'bank': return 'Ngân hàng';
      default: return 'QR Code';
    }
  };

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

  // Handle scan simulation
  const handleScanSimulation = () => {
    if (paymentStep === 1) {
      setPaymentStep(2); // Scanning
      setIsProcessing(true);

      // Simulate scanning process
      setTimeout(() => {
        setPaymentStep(3); // Processing
      }, 2000);

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStep(4); // Success
        setIsProcessing(false);

        // Auto complete after success
        setTimeout(() => {
          if (onPaymentComplete) onPaymentComplete();
        }, 1500);
      }, 4000);
    }
  };

  // Handle manual payment complete
  const handleManualComplete = () => {
    if (paymentStep === 1) {
      handleScanSimulation();
    }
  };

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
              onClick={() => setSelectedMethod(method)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${selectedMethod === method
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <img
                src={getMethodLogo()}
                alt={method}
                className="h-8 w-8 object-contain mb-1"
              />
              <span className="text-xs font-medium text-gray-700">
                {getMethodName()}
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
                src={getMethodLogo()}
                alt={selectedMethod}
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Scanning Animation */}
          {paymentStep === 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
              <div className="text-center">
                <Loader className="h-12 w-12 text-white animate-spin mx-auto mb-2" />
                <p className="text-white font-medium">Đang quét mã QR...</p>
              </div>
            </div>
          )}

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
            <span className="font-semibold">{getMethodName()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-semibold text-right">Thanh toán khóa học</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Hướng dẫn thanh toán:</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
            <span className="text-sm text-gray-600">Mở ứng dụng {getMethodName()} trên điện thoại</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 flex items-center justify-center">
              <span className="text-blue-500 font-bold">1</span>
            </div>
            <span className="text-sm text-gray-600">Chọn tính năng "Quét mã QR"</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 flex items-center justify-center">
              <span className="text-blue-500 font-bold">2</span>
            </div>
            <span className="text-sm text-gray-600">Hướng camera về mã QR trên màn hình</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 flex items-center justify-center">
              <span className="text-blue-500 font-bold">3</span>
            </div>
            <span className="text-sm text-gray-600">Xác nhận thanh toán trong ứng dụng</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {paymentStep === 1 && (
          <>
            <button
              onClick={handleScanSimulation}
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : 'Giả lập quét QR (Demo)'}
            </button>
            <button
              onClick={handleManualComplete}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Đã thanh toán, hoàn tất đơn hàng
            </button>
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
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${paymentStep >= step
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