import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Chip, Box, IconButton, CircularProgress
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError("No user logged in");
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const res = await axios.get("http://localhost:8080/api/courses", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const allCourses = Array.isArray(res.data) ? res.data : (res.data.data || []);
      // Filter only courses created by this instructor
      const myCourses = allCourses.filter(c => c.instructorId === user.username);
      setCourses(myCourses);
      setError("");
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await axios.delete(`http://localhost:8080/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        alert("Deleted successfully");
        fetchCourses();
      } catch (err) {
        console.error("Failed to delete course", err);
        alert("Delete failed!");
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#2c3e50' }}>My Courses</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/instructor/create')}>
          + New Course
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {courses.length === 0 && !error ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No courses found.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/instructor/create')}>
            Create your first course
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map(course => {
                const id = course.id || course.courseId;
                return (
                  <TableRow key={id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={course.image || 'https://via.placeholder.com/60x40?text=No+Image'}
                          sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover', mr: 2, bgcolor: '#eee' }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {course.name || course.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {course.price === 0 || course.type === 'FREE' ? "Free" : `${course.price?.toLocaleString()} VND`}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={course.type || "UNKNOWN"} 
                        size="small" 
                        color={course.type === "FREE" ? "success" : "warning"} 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={course.status || "PUBLISHED"} 
                        size="small" 
                        sx={{ 
                          bgcolor: course.status === "DRAFT" ? '#e2e8f0' : '#dbeafe', 
                          color: course.status === "DRAFT" ? '#64748b' : '#1e40af',
                          fontWeight: 600
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="info" onClick={() => navigate(`/course/${id}`)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton color="primary" onClick={() => navigate(`/instructor/edit/${id}`)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
