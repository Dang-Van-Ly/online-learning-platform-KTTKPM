import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box, Paper, Typography, TextField, MenuItem, Button, Grid, CircularProgress, Alert
} from "@mui/material";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    type: "FREE",
    status: "PUBLISHED",
    image: "",
    category: "technology"
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/courses/${id}`);
          const c = res.data;
          setFormData({
            name: c.name || c.title || "",
            description: c.description || "",
            price: c.price || 0,
            type: c.type || "FREE",
            status: c.status || "PUBLISHED",
            image: c.image || "",
            category: c.category || "technology"
          });
        } catch (err) {
          console.error("Failed to load course", err);
          setError("Failed to load course details.");
        } finally {
          setFetching(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error("Not logged in");
      
      const user = JSON.parse(userStr);
      const headers = { Authorization: `Bearer ${user.token}` };
      
      const payload = {
        ...formData,
        price: formData.type === "FREE" ? 0 : formData.price,
        instructorId: user.username // Important: Assign course to the logged in instructor
      };

      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/courses/${id}`, payload, { headers });
      } else {
        await axios.post("http://localhost:8080/api/courses", payload, { headers });
      }
      
      navigate('/instructor/courses');
    } catch (err) {
      console.error("Failed to save course", err);
      setError("Failed to save course! See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box maxWidth="800px" mx="auto">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#2c3e50' }}>
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/instructor/courses')}>
          Cancel
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Course Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="FREE">FREE</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="DRAFT">DRAFT</MenuItem>
                <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
              </TextField>
            </Grid>

            {formData.type === "PAID" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (VND)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={formData.type === "PAID" ? 6 : 12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                helperText="Provide a URL for the course thumbnail"
              />
              {formData.image && (
                <Box mt={2} textAlign="center">
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Thumbnail preview"
                    sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 2, border: '1px solid #ddd' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL' }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Save Changes" : "Publish Course")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
