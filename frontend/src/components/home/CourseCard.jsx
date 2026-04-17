import React from "react";

export default function CourseCard({ course }) {
  if (!course) return null;

  const formatPrice = (p) => {
    return p > 0 ? new Intl.NumberFormat('vi-VN').format(p) + 'đ' : 'Miễn phí';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      <img 
        src={course.image} 
        alt={course.name} 
        className="w-full h-40 object-cover"
        onError={(e) => e.target.src="https://via.placeholder.com/400x300?text=No+Image"}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 h-10 mb-2">{course.name}</h3>
        <div className="mt-auto">
          <span className="text-red-500 font-bold text-lg">{formatPrice(course.price)}</span>
        </div>
      </div>
    </div>
  );
}