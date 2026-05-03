import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Save, X, Image as ImageIcon, LayoutDashboard, Tag, DollarSign, Loader2, Info } from "lucide-react";

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
        instructorId: user.username 
      };

      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/courses/${id}`, payload, { headers });
      } else {
        await axios.post("http://localhost:8080/api/courses", payload, { headers });
      }
      
      navigate('/instructor/courses');
    } catch (err) {
      console.error("Failed to save course", err);
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Hình ảnh</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                  <input 
                    name="image" 
                    value={formData.image} 
                    onChange={handleChange} 
                    placeholder="https://..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="w-full h-44 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all group">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL' }} 
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-medium">Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
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
