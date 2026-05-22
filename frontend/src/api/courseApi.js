import api from './axios';

const COURSE_PATH = "/courses";
const CHAPTER_PATH = "/chapters";
const ADMIN_COURSE_PATH = "/admin/courses";

// Simple in-memory cache to prevent duplicate requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCached = (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
};

// Retry logic for rate limiting (429) errors
const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            if (error.response?.status === 429 && attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`Rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
};

// --- CÁC HÀM CÔNG KHAI (Dành cho học viên) ---
export const getAllCourses = async (category) => {
    const cacheKey = `courses_${category || 'all'}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const url = category ? `${COURSE_PATH}?category=${encodeURIComponent(category)}` : COURSE_PATH;
        const response = await retryRequest(() => api.get(url));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        return [];
    }
};

export const getCourseById = async (id) => {
    const cacheKey = `course_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryRequest(() => api.get(`${COURSE_PATH}/${id}`));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết khóa học id ${id}:`, error);
        return null;
    }
};

export const getChaptersByCourse = async (courseId) => {
    const cacheKey = `chapters_${courseId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryRequest(() => api.get(`${CHAPTER_PATH}/course/${courseId}`));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching chapters for course ${courseId}:`, error);
        return [];
    }
};

export const getTopCourses = async (limit = 6) => {
    try {
        const response = await api.get(`${COURSE_PATH}/top?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top courses:", error);
        return [];
    }
};

const fallbackFiles = (lessonId) => ([
    {
        id: `sample-${lessonId}`,
        name: "Tài liệu học thử",
        title: "Bài học mẫu",
        url: "/sample-lesson.html"
    }
]);

export const getFilesByLesson = async (lessonId) => {
    try {
        const response = await retryRequest(() => api.get(`/lesson-files/lesson/${lessonId}`));
        const data = response.data;
        return Array.isArray(data) && data.length > 0 ? data : fallbackFiles(lessonId);
    } catch (error) {
        console.error(`Error fetching files for lesson ${lessonId}:`, error);
        return fallbackFiles(lessonId);
    }
};

export const getNewestCourses = async (limit = 6) => {
    try {
        const response = await api.get(`${COURSE_PATH}/newest?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching newest courses:", error);
        return [];
    }
};

export const getHomepageData = async () => {
    try {
        const response = await api.get(`${COURSE_PATH}/homepage`);
        return response.data;
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return null;
    }
};

// --- CÁC HÀM QUẢN TRỊ (Dành cho Admin - Cần Token) ---
export const getPendingCourses = async () => {
    try {
        const response = await api.get(`${ADMIN_COURSE_PATH}/pending`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách chờ duyệt:", error);
        throw error;
    }
};

export const approveCourse = async (id) => {
    try {
        const response = await api.put(`${ADMIN_COURSE_PATH}/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi phê duyệt khóa học:", error);
        throw error;
    }
};

export const rejectCourse = async (id) => {
    try {
        const response = await api.put(`${ADMIN_COURSE_PATH}/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi từ chối khóa học:", error);
        throw error;
    }
};
