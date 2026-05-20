import React from 'react';
import { Star, Users } from 'lucide-react';

export default function TopCourses({ courses }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>
        </div>
        <p className="text-slate-500 font-medium">No courses published</p>
      </div>
    );
  }

  // Sort by studentsCount
  const topCourses = [...courses]
    .sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0))
    .slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Top Performing Courses</h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">See Details</button>
      </div>

      <div className="space-y-5">
        {topCourses.map((course, idx) => (
          <div key={course.id} className="flex gap-4 group cursor-pointer">
            <div className="w-20 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
              {(course.imageUrl || course.image) ? (
                <img src={course.imageUrl || course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              )}
              <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                #{idx + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {course.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Users size={14} className="text-emerald-500" />
                  {course.studentsCount || 0}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Star size={14} className="text-amber-500" />
                  N/A
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex items-center">
               <p className="text-sm font-bold text-slate-800">
                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.revenue || 0)}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
