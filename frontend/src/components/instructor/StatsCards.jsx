import React from 'react';
import { BookOpen, Users, DollarSign, Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCards({ stats }) {
  // Extract stats or provide defaults
  const totalCourses = stats?.totalCourses || 0;
  const activeStudents = stats?.totalStudents || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const avgRating = stats?.avgRating || "N/A";
  
  // Mock trends for visual appeal (in a real app, calculate from previous period data)
  const trends = {
    courses: { value: 12, positive: true },
    students: { value: 5.4, positive: true },
    revenue: { value: 2.1, positive: false },
    rating: { value: 0, positive: true }
  };

  const cards = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: <BookOpen size={24} className="text-blue-600" />,
      bg: "bg-blue-50",
      trend: trends.courses
    },
    {
      title: "Active Students",
      value: activeStudents,
      icon: <Users size={24} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      trend: trends.students
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
      icon: <DollarSign size={24} className="text-violet-600" />,
      bg: "bg-violet-50",
      trend: trends.revenue
    },
    {
      title: "Avg. Rating",
      value: avgRating,
      icon: <Star size={24} className="text-amber-600" />,
      bg: "bg-amber-50",
      trend: trends.rating
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
            {card.trend && card.trend.value > 0 && (
              <div className={`flex items-center gap-1 text-sm font-medium ${card.trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.trend.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{card.trend.value}%</span>
              </div>
            )}
          </div>
          
          <h3 className="text-slate-500 font-medium text-sm mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-slate-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
