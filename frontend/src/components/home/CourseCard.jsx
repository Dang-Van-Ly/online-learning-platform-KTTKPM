import React from "react";

export default function CourseCard({ course }) {
  if (!course) return null;

  const formatPrice = (p) => {
    return p > 0 ? new Intl.NumberFormat('vi-VN').format(p) + 'đ' : 'Miễn phí';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      {(course.imageUrl || course.image) ? (
        <img 
          src={course.imageUrl || course.image} 
          alt={course.name} 
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjODg4IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
          }}
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
          No Image
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 h-10 mb-2">{course.name}</h3>
        <div className="mt-auto">
          <span className="text-red-500 font-bold text-lg">{formatPrice(course.price)}</span>
        </div>
      </div>
    </div>
  );
}