import React from 'react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

export default function RecentEnrollments({ enrollments }) {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <p className="text-slate-500 font-medium">No enrollments yet</p>
      </div>
    );
  }

  // take top 5 most recent
  const recent = [...enrollments]
    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Recent Enrollments</h2>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
      </div>
      
      <div className="space-y-4">
        {recent.map((en) => {
          const studentName = en.user?.fullName || en.user?.username || 'Unknown Student';
          const courseName = en.course?.name || 'Unknown Course';
          const isFree = en.pricePaid === 0;
          
          return (
            <div key={en.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{studentName}</p>
                  <p className="text-xs text-slate-500 truncate" title={courseName}>{courseName}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${isFree ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {isFree ? 'Free' : `${new Intl.NumberFormat('vi-VN').format(en.pricePaid)}đ`}
                </p>
                <p className="text-xs text-slate-400">
                  {en.enrolledAt ? formatDistanceToNow(new Date(en.enrolledAt), { addSuffix: true }) : 'Recently'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
