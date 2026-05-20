import React, { useState, useEffect } from 'react';
import axios from 'axios';

import StatsCards from '../../components/instructor/StatsCards';
import AnalyticsChart from '../../components/instructor/AnalyticsChart';
import RecentEnrollments from '../../components/instructor/RecentEnrollments';
import TopCourses from '../../components/instructor/TopCourses';
import QuickActions from '../../components/instructor/QuickActions';

export default function InstructorDashboard() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: "N/A" // Placeholder for future rating logic
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        
        // Fetch instructor's courses
        const coursesRes = await axios.get("http://localhost:8080/api/courses", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data.data || []);
        const myCourses = allCourses.filter(c => c.instructorId === user.username);
        setCourses(myCourses);
        
        // Fetch instructor's enrollments using new API
        try {
          const enrollmentsRes = await axios.get(`http://localhost:8080/api/enrollments/instructor/${user.username}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (Array.isArray(enrollmentsRes.data)) {
            setEnrollments(enrollmentsRes.data);
          }
        } catch (e) {
          console.warn("Could not fetch enrollments", e);
        }

        // Calculate Stats
        setStats({
          totalCourses: myCourses.length,
          totalStudents: myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0),
          totalRevenue: myCourses.reduce((sum, c) => sum + (c.revenue || 0), 0),
          avgRating: "N/A"
        });

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your courses.</p>
      </div>

      {/* 1. Stats Row */}
      <StatsCards stats={stats} />

      {/* 2. Charts & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart enrollments={enrollments} />
        </div>
        <div className="lg:col-span-1">
          <TopCourses courses={courses} />
        </div>
      </div>

      {/* 3. Recent Enrollments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentEnrollments enrollments={enrollments} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
