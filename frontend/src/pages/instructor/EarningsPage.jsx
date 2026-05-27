import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

export default function EarningsPage() {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;
    const load = async () => {
      setLoading(true);
      try {
        const [enrollRes, courseRes] = await Promise.all([
          api.get(`/enrollments/instructor/${user.username}`),
          api.get(`/courses/instructor/${user.username}`),
        ]);
        setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
      } catch (e) {
        console.error('EarningsPage load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // --- Stats tổng ---
  const totalRevenue = useMemo(
    () => enrollments.reduce((s, e) => s + (e.pricePaid || 0), 0),
    [enrollments]
  );
  const totalStudents = enrollments.length;
  const totalCourses = courses.length;

  // --- Chart: 6 tháng gần nhất ---
  const monthlyData = useMemo(() => {
    const today = new Date();
    const grouped = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      grouped[key] = { name: MONTHS[d.getMonth()], students: 0, revenue: 0 };
    }
    enrollments.forEach(en => {
      if (!en.enrolledAt) return;
      const d = new Date(en.enrolledAt);
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (grouped[key]) {
        grouped[key].students += 1;
        grouped[key].revenue += (en.pricePaid || 0);
      }
    });
    return Object.values(grouped);
  }, [enrollments]);

  // --- Doanh thu theo khóa học ---
  const courseRevenue = useMemo(() => {
    const map = {};
    enrollments.forEach(en => {
      const cid = en.course?.id;
      const cname = en.course?.name || `Course #${cid}`;
      if (!map[cid]) map[cid] = { name: cname, students: 0, revenue: 0 };
      map[cid].students += 1;
      map[cid].revenue += (en.pricePaid || 0);
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [enrollments]);

  // --- 10 enrollment gần nhất ---
  const recentEnrollments = useMemo(
    () => [...enrollments]
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 10),
    [enrollments]
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-sm">
        <p className="font-semibold mb-1 text-slate-200">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'revenue' ? `Doanh thu: ${fmt(p.value)}` : `Học viên: ${p.value}`}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Earnings & Analytics</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<DollarSign size={22} className="text-violet-600" />}
          bg="bg-violet-50" label="Tổng doanh thu" value={fmt(totalRevenue)} />
        <StatCard icon={<Users size={22} className="text-emerald-600" />}
          bg="bg-emerald-50" label="Tổng học viên" value={totalStudents} />
        <StatCard icon={<BookOpen size={22} className="text-blue-600" />}
          bg="bg-blue-50" label="Khóa học" value={totalCourses} />
      </div>

      {/* Area chart: 6 tháng */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-800">Doanh thu & Học viên — 6 tháng gần nhất</h2>
        </div>
        {monthlyData.every(d => d.students === 0) ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            Chưa có dữ liệu enrollment trong 6 tháng gần nhất
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => v === 'students' ? 'Học viên' : 'Doanh thu'} />
              <Area yAxisId="left" type="monotone" dataKey="students"
                stroke="#6366f1" strokeWidth={2} fill="url(#gStudents)" name="students" />
              <Area yAxisId="right" type="monotone" dataKey="revenue"
                stroke="#10b981" strokeWidth={2} fill="url(#gRevenue)" name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar chart: doanh thu theo khóa học */}
      {courseRevenue.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">Doanh thu theo khóa học</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip formatter={(v, n) => [n === 'revenue' ? fmt(v) : v, n === 'revenue' ? 'Doanh thu' : 'Học viên']} />
              <Legend formatter={v => v === 'revenue' ? 'Doanh thu' : 'Học viên'} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="revenue" />
              <Bar dataKey="students" fill="#10b981" radius={[4, 4, 0, 0]} name="students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bảng enrollment gần nhất */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Enrollment gần nhất</h2>
        </div>
        {recentEnrollments.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">Chưa có học viên nào đăng ký</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Học viên</th>
                  <th className="px-6 py-3 text-left">Khóa học</th>
                  <th className="px-6 py-3 text-left">Ngày đăng ký</th>
                  <th className="px-6 py-3 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentEnrollments.map(en => (
                  <tr key={en.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">
                      {en.user?.username || en.user?.email || `User #${en.user?.id}`}
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-[200px] truncate">
                      {en.course?.name || `Course #${en.course?.id}`}
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {en.enrolledAt ? new Date(en.enrolledAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                      {en.pricePaid > 0 ? fmt(en.pricePaid) : <span className="text-slate-400 font-normal">Membership</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
