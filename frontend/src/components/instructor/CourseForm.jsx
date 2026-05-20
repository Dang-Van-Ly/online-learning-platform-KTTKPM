import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Save, X, Image as ImageIcon, LayoutDashboard, Tag, DollarSign, Loader2, Info, Upload, Trash2 } from "lucide-react";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    type: "FREE",
    status: "PUBLISHED",
    image: "",
    category: "technology"
  });
  
  const [imageFile, setImageFile] = useState(null);     // File object
  const [imagePreview, setImagePreview] = useState(""); // preview URL
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
          // Nếu có imageUrl từ S3, set preview
          const existingImg = c.imageUrl || c.image || "";
          if (existingImg) setImagePreview(existingImg);
        } catch (err) {
          console.error("Failed to load course", err);
          setError("Không thể tải thông tin khóa học.");
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

  // -------- Drag & Drop / File pick handlers --------
  const applyFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP...).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Ảnh không được vượt quá 10MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleFileInput = (e) => applyFile(e.target.files[0]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      if (isEditMode) {
        // PUT vẫn dùng JSON
        const payload = {
          ...formData,
          price: formData.type === "FREE" ? 0 : formData.price,
          instructorId: user.username
        };
        await axios.put(`http://localhost:8080/api/courses/${id}`, payload, { headers });
      } else if (imageFile) {
        // POST với file ảnh → multipart/form-data → /with-image
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description || "");
        fd.append("price", formData.type === "FREE" ? 0 : (formData.price || 0));
        fd.append("category", formData.category || "");
        fd.append("type", formData.type || "FREE");
        fd.append("status", formData.status || "DRAFT");
        fd.append("instructorId", user.username || "");
        fd.append("image", imageFile);
        await axios.post("http://localhost:8080/api/courses/with-image", fd, {
          headers: { ...headers }
        });
      } else {
        // POST không có file → JSON
        const payload = {
          ...formData,
          price: formData.type === "FREE" ? 0 : formData.price,
          instructorId: user.username
        };
        await axios.post("http://localhost:8080/api/courses", payload, { headers });
      }

      navigate('/instructor/courses');
    } catch (err) {
      console.error("Failed to save course", err);
      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data);
      }
      setError("Không thể lưu khóa học! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full text-left font-sans pb-10">
      {/* Clean Minimalist Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học Mới'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Điền các thông tin chi tiết bên dưới để thiết lập khóa học của bạn.
          </p>
        </div>
        <button 
          onClick={() => navigate('/instructor/courses')} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 bg-white transition-all shadow-sm"
        >
          <X size={18} /> Hủy bỏ
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center gap-3">
          <Info size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <LayoutDashboard className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h2>
            </div>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề khóa học <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-800" 
                  placeholder="VD: Lập trình ReactJS Thực Chiến..." 
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="6" 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800" 
                  placeholder="Cung cấp thông tin chi tiết, lợi ích và lộ trình học của khóa học..."
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <input 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800" 
                    placeholder="VD: technology, business, design..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Media (1/3 width) */}
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Cài đặt phân phối</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại khóa học</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium cursor-pointer"
                >
                  <option value="FREE">Miễn phí (FREE)</option>
                  <option value="PAID">Trả phí (PAID)</option>
                </select>
              </div>

              {formData.type === "PAID" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá tiền (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      min="0" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái hiển thị</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium cursor-pointer"
                >
                  <option value="DRAFT">Bản nháp (DRAFT)</option>
                  <option value="PUBLISHED">Công khai (PUBLISHED)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Hình ảnh đại diện</h2>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              id="thumbnailFileInput"
            />

            {imagePreview ? (
              // Preview mode
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjODg4IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW52YWxpZCBJbWFnZTwvdGV4dD48L3N2Zz4="; 
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-white text-gray-800 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-gray-100 transition-colors"
                  >
                    <Upload size={14} /> Thay ảnh
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
                {imageFile && (
                  <p className="mt-2 text-xs text-gray-500 truncate">{imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)</p>
                )}
              </div>
            ) : (
              // Drop zone
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <div className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
                  <Upload size={24} className={isDragging ? "text-blue-500" : "text-gray-400"} />
                </div>
                <p className={`font-semibold text-sm ${isDragging ? "text-blue-600" : "text-gray-600"}`}>
                  {isDragging ? "Thả ảnh vào đây" : "Kéo & thả ảnh vào đây"}
                </p>
                <p className="text-xs text-gray-400 mt-1">hoặc <span className="text-blue-500 font-semibold">nhấp để chọn file</span></p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP · Tối đa 10MB</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
            ) : (
              <><Save size={20} /> {isEditMode ? 'Lưu Thay Đổi' : '🚀 Xuất Bản Khóa Học'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
