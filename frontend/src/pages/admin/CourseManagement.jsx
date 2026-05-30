import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCourses = async (page = 0) => {
        try {
            setLoading(true);
            const url = filter === 'PENDING' ? 'admin/courses/pending' : 'admin/courses';
            const response = await api.get(`${url}?page=${page}&size=10`);
            setCourses(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage(response.data.number || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(0);
    }, [filter]);

    const handleApprove = async (id) => {
        await api.put(`admin/courses/${id}/approve`);
        fetchCourses(currentPage);
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>📁 Quản lý Khóa học</h2>
                <div>
                    <button onClick={() => setFilter('PENDING')} style={filter === 'PENDING' ? btnTabActive : btnTab}>Chờ duyệt</button>
                    <button onClick={() => setFilter('ALL')} style={filter === 'ALL' ? btnTabActive : btnTab}>Tất cả</button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f7fe' }}>
                    <th style={tdStyle}>ID</th>
                    <th style={tdStyle}>Tên</th>
                    <th style={tdStyle}>Giá</th>
                    <th style={tdStyle}>Trạng thái</th>
                    <th style={tdStyle}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {courses.map(c => (
                    <tr key={c.id}>
                        <td style={tdStyle}>{c.id}</td>
                        <td style={tdStyle}>{c.name}</td>
                        <td style={tdStyle}>{c.price?.toLocaleString()}đ</td>
                        <td style={tdStyle}>{c.status}</td>
                        <td style={tdStyle}>
                            {c.status === 'PENDING' && <button onClick={() => handleApprove(c.id)} style={btnGreen}>Duyệt</button>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchCourses(page)}
            />
        </div>
    );
}

const btnTabActive = { padding: '8px 15px', backgroundColor: '#4e73df', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const btnTab = { padding: '8px 15px', backgroundColor: '#fff', color: '#4e73df', border: '1px solid #d1d3e2', borderRadius: '5px', cursor: 'pointer' };
const btnGreen = { backgroundColor: '#1cc88a', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };