import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CourseHistory({ username }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/instructor/${username}/history`);
        setData(res.data || []);
      } catch (e) {
        console.error('Failed to load course history', e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username]);

  if (loading) return (
    <div className="p-4 bg-white rounded shadow">
      <div className="animate-pulse">Loading history...</div>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Lịch sử đăng / trạng thái khóa học</h3>
      {data.length === 0 && <p className="text-sm text-slate-500">Không có lịch sử.</p>}
      {data.map((course) => (
        <div key={course.courseId} className="mb-4 border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{course.courseName || `Khóa #${course.courseId}`}</div>
              <div className="text-xs text-slate-500">ID: {course.courseId}</div>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {course.history && course.history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${h.status === 'PUBLISHED' || h.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : h.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {h.status}
                  </span>
                  <span className="ml-3 text-sm text-slate-600">{h.changedBy ? `by ${h.changedBy}` : ''}</span>
                </div>
                <div className="text-sm text-slate-500">{new Date(h.changedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
