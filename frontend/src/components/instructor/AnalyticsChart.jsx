import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ enrollments }) {
  
  const chartData = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return [];
    
    // Group enrollments by month
    const grouped = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      grouped[key] = { name: key, students: 0, revenue: 0 };
    }

    enrollments.forEach(en => {
      if (!en.enrolledAt) return;
      const d = new Date(en.enrolledAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (grouped[key]) {
        grouped[key].students += 1;
        grouped[key].revenue += (en.pricePaid || 0);
      }
    });

    return Object.values(grouped);
  }, [enrollments]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400">
        <p>No enrollment data to display.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-sm">
          <p className="font-semibold mb-2 text-slate-200">{label}</p>
          <p className="text-indigo-400">Students: <span className="font-bold text-white">{payload[0].value}</span></p>
          <p className="text-emerald-400">Revenue: <span className="font-bold text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[1].value)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" style={{ minHeight: 420 }}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Revenue & Enrollments</h2>
        <p className="text-sm text-slate-500">Last 6 months overview</p>
      </div>
      
      <div style={{ width: '100%', height: 400, minHeight: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `${val / 1000}k`}
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="students" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorStudents)" 
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
