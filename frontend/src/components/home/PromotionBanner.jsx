import React from "react";

const PromotionBanner = () => {
  return (
    <div className="mb-16 border-[3px] border-blue-400 rounded-sm p-8 text-center bg-white relative shadow-sm">
      <h2 className="text-blue-700 font-black text-2xl md:text-4xl mb-3 tracking-tighter uppercase">
        KHO KHÓA HỌC – SHARE HƠN 5000 KHÓA HỌC ONLINE
      </h2>
      <p className="text-gray-500 max-w-4xl mx-auto text-base md:text-lg font-medium leading-relaxed">
        Tổng kho khóa học online lớn nhất hiện nay, uy tín, chất lượng và nhanh chóng. <br className="hidden md:block"/>
        Chúng tôi liên tục cập nhật các khóa học mới đáp ứng nhu cầu của các bạn.
      </p>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-500"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-500"></div>
    </div>
  );
};

export default PromotionBanner;