import api from './axios';

const COURSE_PATH = "/courses";
const ADMIN_COURSE_PATH = "/admin/courses"; // Đường dẫn dành riêng cho Admin

// --- CÁC HÀM CÔNG KHAI (Dành cho học viên) ---
export const getAllCourses = async (category) => {
    try {
        const url = category ? `${COURSE_PATH}?category=${encodeURIComponent(category)}` : COURSE_PATH;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        return [];
    }
};

export const getCourseById = async (id) => {
    try {
        const response = await api.get(`${COURSE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết khóa học id ${id}:`, error);
        return null;
    }
};

// --- CÁC HÀM QUẢN TRỊ (Dành cho Admin - Cần Token) ---

// 1. Lấy danh sách khóa học đang chờ duyệt (0)
export const getPendingCourses = async () => {
    try {
        const response = await api.get(`${ADMIN_COURSE_PATH}/pending`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách chờ duyệt:", error);
        throw error; // Quăng lỗi để component CourseManagement bắt được
    }
};

// 2. Phê duyệt khóa học (Chuyển trạng thái sang 1)
export const approveCourse = async (id) => {
    try {
        const response = await api.put(`${ADMIN_COURSE_PATH}/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi phê duyệt khóa học:", error);
        throw error;
    }
};

// 3. Từ chối khóa học (Chuyển trạng thái sang 2)
export const rejectCourse = async (id) => {
    try {
        const response = await api.put(`${ADMIN_COURSE_PATH}/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi từ chối khóa học:", error);
        throw error;
    }
};