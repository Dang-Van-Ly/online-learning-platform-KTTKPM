import axios from 'axios';

const API_URL = "http://localhost:8080/api/courses";

export const getAllCourses = async () => {
    try {
        const response = await axios.get(API_URL);
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