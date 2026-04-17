import React from "react";

const CATEGORIES = [
  ["Ads", "Lập trình - Web"], ["SEO", "Copywriting"],
  ["AI - ChatGPT", "Data Analysis"], ["Tiktok", "Bất động sản"],
  ["Shopee", "Kiếm tiền online"], ["Tiếng Anh", "Tin học văn phòng"]
];

export default function CategorySidebar() {
  return (
    <aside className="lg:w-1/3 w-full">
      <h2 className="text-blue-900 font-black text-center mb-5 text-xl uppercase italic tracking-widest">
        Danh mục khóa học
      </h2>
      <div className="grid grid-cols-2 gap-[2px] bg-blue-400 border border-blue-400 rounded-sm overflow-hidden shadow-sm">
        {CATEGORIES.map((pair, index) => (
          <React.Fragment key={index}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 text-[13px] font-semibold transition-colors text-left pl-4">
              {pair[0]}
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 text-[13px] font-semibold transition-colors text-left pl-4">
              {pair[1]}
            </button>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}