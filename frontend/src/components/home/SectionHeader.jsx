import React from "react";

export default function SectionHeader({ title, highlight, highlightColor }) {
  return (
    <div className="flex justify-between items-center mb-6 border-l-4 border-blue-600 pl-4">
      <h2 className="text-2xl font-black text-gray-800 uppercase">
        {title} <span className={highlightColor}>{highlight}</span>
      </h2>
      <div className="h-[2px] flex-grow mx-4 bg-gray-100 hidden md:block"></div>
      <button className="text-blue-500 font-bold text-sm hover:underline">Xem thêm →</button>
    </div>
  );
}