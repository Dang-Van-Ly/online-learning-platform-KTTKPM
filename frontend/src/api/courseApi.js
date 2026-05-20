import axios from 'axios';

const API_URL = "http://localhost:8080/api/courses";

export const getAllCourses = async (category) => {
    try {
        const url = category ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id ${id}:`, error);
        return null;
    }
};

export const getTopCourses = async (limit = 6) => {
    try {
        const response = await axios.get(`${API_URL}/top?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top courses:", error);
        return [];
    }
};

export const getNewestCourses = async (limit = 6) => {
    try {
        const response = await axios.get(`${API_URL}/newest?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching newest courses:", error);
        return [];
    }
};

export const getHomepageData = async () => {
    try {
        const response = await axios.get(`${API_URL}/homepage`);
        return response.data;
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return null;
    }
};