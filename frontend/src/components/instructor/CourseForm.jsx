import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Save, X, Image as ImageIcon, LayoutDashboard, Tag, DollarSign, Loader2, Info, Upload, Trash2, Plus, BookOpen, Film, FileText, CheckCircle } from "lucide-react";

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
    status: "PENDING",
    image: "",
    category: "technology"
  });
  
  const [imageFile, setImageFile] = useState(null);     // File object
  const [imagePreview, setImagePreview] = useState(""); // preview URL
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  // Chapter creation states
  const [newChapters, setNewChapters] = useState([]);
  const [currChapterTitle, setCurrChapterTitle] = useState("");
  const [currChapterContent, setCurrChapterContent] = useState("");
  const [currChapterFiles, setCurrChapterFiles] = useState([]);
  const [uploadingChapterFile, setUploadingChapterFile] = useState(false);
  const [dragActiveChapter, setDragActiveChapter] = useState(false);
  const chapterFileInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`/api/courses/${id}`);
          const c = res.data;
          setFormData({
            name: c.name || c.title || "",
            description: c.description || "",
            price: c.price || 0,
            type: c.type || "FREE",
            status: c.status || "PENDING",
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

  // -------- Chapter drag & drop/upload handlers --------
  const handleChapterFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingChapterFile(true);
    const newFiles = [];
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá giới hạn 100MB.`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/storage/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
        newFiles.push({
          name: file.name,
          url: res.data,
          type: file.type,
          size: file.size
        });
      } catch (err) {
        console.error("Upload chapter file failed", err);
        alert(`Không thể tải tệp ${file.name} lên.`);
      }
    }
    setCurrChapterFiles(prev => [...prev, ...newFiles]);
    setUploadingChapterFile(false);
  };

  const handleChapterDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveChapter(true);
    } else if (e.type === "dragleave") {
      setDragActiveChapter(false);
    }
  };

  const handleChapterDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveChapter(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChapterFileUpload(e.dataTransfer.files);
    }
  };

  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!currChapterTitle.trim()) {
      alert("Vui lòng nhập tên chương học.");
      return;
    }
    const newChap = {
      title: currChapterTitle,
      content: currChapterContent,
      files: currChapterFiles
    };
    setNewChapters(prev => [...prev, newChap]);
    setCurrChapterTitle("");
    setCurrChapterContent("");
    setCurrChapterFiles([]);
  };

  const removeAddedChapter = (index) => {
    setNewChapters(prev => prev.filter((_, i) => i !== index));
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

      if (!isEditMode && payload.status !== "DRAFT") {
        payload.status = "PENDING";
      }

      let newCourseId = id;

      if (isEditMode) {
        await axios.put(`/api/courses/${id}`, payload, { headers });
      } else if (imageFile) {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description || "");
        fd.append("price", formData.type === "FREE" ? 0 : (formData.price || 0));
        fd.append("category", formData.category || "");
        fd.append("type", formData.type || "FREE");
        fd.append("status", formData.status === "DRAFT" ? "DRAFT" : "PENDING");
        fd.append("instructorId", user.username || "");
        fd.append("image", imageFile);
        const res = await axios.post("/api/courses/with-image", fd, { headers });
        newCourseId = res.data.id;
      } else {
        const res = await axios.post("/api/courses", payload, { headers });
        newCourseId = res.data.id;
      }

      // Publish newly added chapters if any
      if (newChapters.length > 0 && newCourseId) {
        for (const chap of newChapters) {
          // Validate files before submitting
          const hasInvalidFiles = chap.files.some(f => !f.url);
          if (hasInvalidFiles) {
            throw new Error(`Chương "${chap.title}" có tệp chưa được tải lên hoặc tải lên thất bại. Vui lòng kiểm tra lại.`);
          }

          const chapPayload = {
            courseId: Number(newCourseId),
            title: chap.title,
            content: chap.content,
            files: chap.files.map(f => ({
              fileName: f.name,
              fileUrl: f.url,
              fileType: f.type
            }))
          };
          
          try {
            await axios.post("/api/chapters/publish", chapPayload, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
              }
            });
          } catch (chapErr) {
            const errMsg = chapErr.response?.data?.error || chapErr.message || "Lỗi không xác định";
            throw new Error(`Lỗi xuất bản chương "${chap.title}": ${errMsg}`);
          }
        }
      }

      alert("Khóa học của bạn đã được gửi yêu cầu duyệt. Vui lòng chờ admin duyệt trước khi nó hiển thị công khai.");
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

          {/* ==================== CHAPTERS SECTION (MOVED TO LEFT) ==================== */}
          {!isEditMode && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1 border-b border-gray-100 pb-4">
                <BookOpen className="text-indigo-500" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chương trình học</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Thêm các chương học ngay khi tạo khóa học. Hỗ trợ video (tối đa 100MB) và file PDF.</p>
                </div>
              </div>

              {/* Already-added chapters list */}
              {newChapters.length > 0 && (
                <div className="mb-5 space-y-2">
                  {newChapters.map((chap, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{chap.title}</p>
                          {chap.content && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{chap.content}</p>}
                          {chap.files.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {chap.files.map((f, fi) => (
                                <span key={fi} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-indigo-100 rounded-full text-[10px] text-indigo-700 font-medium">
                                  {f.type.startsWith('video/') ? <Film size={10} /> : <FileText size={10} />}
                                  <span className="truncate max-w-[120px]">{f.name}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeAddedChapter(idx)} className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New chapter form */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Plus size={16} className="text-indigo-500" />
                  Thêm chương {newChapters.length + 1}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên chương <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={currChapterTitle}
                      onChange={e => setCurrChapterTitle(e.target.value)}
                      placeholder={`VD: Chương ${newChapters.length + 1}: Giới thiệu`}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tài nguyên đính kèm (Video / PDF)</label>
                    <input
                      ref={chapterFileInputRef}
                      type="file"
                      multiple
                      accept="video/*,.pdf"
                      className="hidden"
                      onChange={e => handleChapterFileUpload(e.target.files)}
                    />
                    
                    {/* DRAG & DROP ZONE FOR CHAPTER FILES */}
                    <div
                      onDragEnter={handleChapterDrag}
                      onDragOver={handleChapterDrag}
                      onDragLeave={handleChapterDrag}
                      onDrop={handleChapterDrop}
                      onClick={() => chapterFileInputRef.current?.click()}
                      className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 cursor-pointer transition-all select-none ${
                        dragActiveChapter 
                          ? "border-indigo-500 bg-indigo-50 scale-[1.01]" 
                          : "border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30"
                      }`}
                    >
                      {uploadingChapterFile ? (
                        <>
                          <Loader2 size={24} className="text-indigo-500 animate-spin mb-2" />
                          <p className="text-xs font-semibold text-indigo-600">Đang tải lên...</p>
                        </>
                      ) : (
                        <>
                          <Upload size={20} className={dragActiveChapter ? "text-indigo-500" : "text-gray-400"} />
                          <p className="text-xs font-semibold text-gray-600 mt-2 text-center px-2">
                            {dragActiveChapter ? "Thả tệp vào đây" : "Kéo thả hoặc Click để chọn tệp"}
                          </p>
                        </>
                      )}
                    </div>

                    {/* LIST OF FILES CURRENTLY UPLOADING/UPLOADED FOR THIS CHAPTER */}
                    {currChapterFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {currChapterFiles.map((file, fi) => (
                          <div key={fi} className="flex items-center justify-between gap-3 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`p-1.5 rounded ${file.type.startsWith('video/') ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'}`}>
                                {file.type.startsWith('video/') ? <Film size={14} /> : <FileText size={14} />}
                              </div>
                              <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                            </div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrChapterFiles(prev => prev.filter((_, i) => i !== fi)); }} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddChapter}
                  disabled={!currChapterTitle.trim() || uploadingChapterFile}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-indigo-500 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-40"
                >
                  <Plus size={18} /> Lưu chương vào danh sách
                </button>
              </div>
            </div>
          )}
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
                  <option value="PENDING">Chờ duyệt (PENDING)</option>
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
