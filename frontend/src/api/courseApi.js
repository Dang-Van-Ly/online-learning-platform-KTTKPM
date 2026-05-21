import axios from 'axios';

const API_URL = "/api/courses";
const CHAPTER_URL = "/api/chapters";

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
                // Exponential backoff: 1s, 2s, 4s, etc.
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`Rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
};

export const getAllCourses = async (category) => {
    const cacheKey = `courses_${category || 'all'}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const url = category ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;
        const response = await retryRequest(() => axios.get(url));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (id) => {
    const cacheKey = `course_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryRequest(() => axios.get(`${API_URL}/${id}`));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching course with id ${id}:`, error);
        return null;
    }
};

export const getChaptersByCourse = async (courseId) => {
    const cacheKey = `chapters_${courseId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryRequest(() => axios.get(`${CHAPTER_URL}/course/${courseId}`));
        const data = response.data;
        setCached(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching chapters for course ${courseId}:`, error);
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
        const response = await retryRequest(() => axios.get(`/api/lesson-files/lesson/${lessonId}`));
        const data = response.data;
        return Array.isArray(data) && data.length > 0 ? data : fallbackFiles(lessonId);
    } catch (error) {
        console.error(`Error fetching files for lesson ${lessonId}:`, error);
        return fallbackFiles(lessonId);
    }
};
