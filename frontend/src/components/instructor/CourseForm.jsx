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

  // Chapter + Lesson creation states
  // Structure: [{title, lessons: [{title, isFree, fileName, fileUrl, fileType, file, uploading, uploadProgress}]}]
  const [newChapters, setNewChapters] = useState([
    { title: "", lessons: [{ title: "", isFree: false, fileName: "", fileUrl: "", fileType: "", file: null, uploading: false, uploadProgress: 0 }] }
  ]);
  const emptyLesson = () => ({ title: "", isFree: false, fileName: "", fileUrl: "", fileType: "", file: null, uploading: false, uploadProgress: 0 });

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

  // -------- Chapter / Lesson helpers --------
  const updateChapterTitle = (ci, val) => {
    setNewChapters(prev => prev.map((ch, i) => i === ci ? { ...ch, title: val } : ch));
  };

  const addChapter = () => {
    setNewChapters(prev => [...prev, { title: "", lessons: [emptyLesson()] }]);
  };

  const removeChapter = (ci) => {
    if (newChapters.length <= 1) return;
    setNewChapters(prev => prev.filter((_, i) => i !== ci));
  };

  const addLesson = (ci) => {
    setNewChapters(prev => prev.map((ch, i) => i === ci ? { ...ch, lessons: [...ch.lessons, emptyLesson()] } : ch));
  };

  const removeLesson = (ci, li) => {
    setNewChapters(prev => prev.map((ch, i) => {
      if (i !== ci) return ch;
      if (ch.lessons.length <= 1) return ch;
      return { ...ch, lessons: ch.lessons.filter((_, j) => j !== li) };
    }));
  };

  const updateLesson = (ci, li, field, val) => {
    setNewChapters(prev => prev.map((ch, i) => {
      if (i !== ci) return ch;
      const lessons = ch.lessons.map((ls, j) => j === li ? { ...ls, [field]: val } : ls);
      return { ...ch, lessons };
    }));
  };

  const uploadLessonFile = async (ci, li, file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { alert(`File "${file.name}" vượt quá 100MB.`); return; }
    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'application/pdf'];
    if (!allowed.includes(file.type) && !file.type.startsWith('video/')) {
      alert(`File "${file.name}" không được hỗ trợ. Chỉ chấp nhận Video hoặc PDF.`); return;
    }
    updateLesson(ci, li, 'uploading', true);
    updateLesson(ci, li, 'uploadProgress', 0);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const fd = new FormData(); fd.append("file", file);
      const res = await axios.post("/api/storage/upload", fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user?.token}` },
        onUploadProgress: (p) => updateLesson(ci, li, 'uploadProgress', Math.round(p.loaded * 100 / p.total))
      });
      setNewChapters(prev => prev.map((ch, i) => {
        if (i !== ci) return ch;
        const lessons = ch.lessons.map((ls, j) => j !== li ? ls : {
          ...ls, fileName: file.name, fileUrl: res.data, fileType: file.type, file, uploading: false, uploadProgress: 100
        });
        return { ...ch, lessons };
      }));
    } catch (err) {
      alert(`Không thể upload: ${file.name}`);
      updateLesson(ci, li, 'uploading', false);
    }
  };

  const removeLessonFile = (ci, li) => {
    setNewChapters(prev => prev.map((ch, i) => {
      if (i !== ci) return ch;
      const lessons = ch.lessons.map((ls, j) => j !== li ? ls : { ...ls, fileName: '', fileUrl: '', fileType: '', file: null, uploadProgress: 0 });
      return { ...ch, lessons };
    }));
  };

  // -------- Chapter drag & drop/upload handlers (LEGACY - kept for compat) --------
  const handleChapterFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingChapterFile(true);
    const newFiles = [];
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá giới hạn 50MB.`);
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
      // For new courses: warn if no chapters, but allow creation
      // User can add chapters later via ChapterManagement page
      if (!isEditMode) {
        const chaptersToValidate = newChapters.filter(ch => ch.title.trim());
        
        // Validate all chapters that DO exist have lessons
        for (const chap of chaptersToValidate) {
          const lessonsWithTitle = chap.lessons.filter(ls => ls.title.trim());
          if (lessonsWithTitle.length === 0) {
            setError(`Chương "${chap.title}" không có bài học nào. Vui lòng thêm ít nhất 1 bài học cho mỗi chương.`);
            setLoading(false);
            return;
          }
        }
      }

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

      // Publish chapters with lessons
      const chaptersToPublish = newChapters.filter(ch => ch.title.trim());
      if (chaptersToPublish.length > 0 && newCourseId) {
        for (const chap of chaptersToPublish) {
          const lessons = chap.lessons.filter(ls => ls.title.trim());
          if (lessons.length === 0) continue;
          const chapPayload = {
            courseId: Number(newCourseId),
            title: chap.title,
            lessons: lessons.map(ls => ({
              title: ls.title,
              content: "",
              isFree: ls.isFree,
              fileName: ls.fileName || null,
              fileUrl: ls.fileUrl || null,
              fileType: ls.fileType || null
            }))
          };
          try {
            await axios.post("/api/chapters/publish", chapPayload, {
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` }
            });
          } catch (chapErr) {
            const errMsg = chapErr.response?.data?.error || chapErr.message || "Lỗi không xác định";
            throw new Error(`Lỗi xuất bản chương "${chap.title}": ${errMsg}`);
          }
        }
      }

      // Determine success message based on chapters
      if (chaptersToPublish.length === 0) {
        // No chapters were added
        alert(`✅ Khóa học "${formData.name}" đã được tạo thành công!\n\n⏭️ Bước tiếp theo:\nVui lòng quản lý chương học của bạn bằng cách nhấp vào nút "Quản lý chương học" trong trang Khóa học của tôi để thêm chương và bài học.`);
      } else {
        alert("✅ Khóa học của bạn đã được gửi yêu cầu duyệt. Vui lòng chờ admin duyệt trước khi nó hiển thị công khai.");
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

          {/* ==================== CHAPTERS SECTION ==================== */}
          {!isEditMode && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                <BookOpen className="text-indigo-500" size={24} />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">Chương trình học</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Thêm chương & bài học. Mỗi bài học hỗ trợ 1 video (≤50MB) hoặc PDF.</p>
                </div>
              </div>

              {/* Info box */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-1">💡 Tùy chọn:</p>
                  <p>Bạn có thể thêm chương & bài học ngay bây giờ, hoặc tạo khóa học trước rồi quản lý chương sau bằng nút "Quản lý chương học" trên trang của tôi.</p>
                </div>
              </div>

              <div className="space-y-4">
                {newChapters.map((chap, ci) => (
                  <div key={ci} className="border border-indigo-100 rounded-2xl bg-indigo-50/30 overflow-hidden">
                    {/* Chapter Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600">
                      <span className="text-white font-bold text-sm">Chương {ci + 1}</span>
                      <input
                        type="text"
                        value={chap.title}
                        onChange={e => updateChapterTitle(ci, e.target.value)}
                        placeholder={`VD: Chương ${ci + 1}: Giới thiệu`}
                        required
                        className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:bg-white/30 transition-all"
                      />
                      {newChapters.length > 1 && (
                        <button type="button" onClick={() => removeChapter(ci)} className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500 text-white transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Lessons */}
                    <div className="p-3 space-y-2">
                      {chap.lessons.map((ls, li) => (
                        <div key={li} className="bg-white border border-gray-100 rounded-xl p-3 space-y-2.5 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-400 w-6 text-center">{li + 1}</span>
                            <input
                              type="text"
                              value={ls.title}
                              onChange={e => updateLesson(ci, li, 'title', e.target.value)}
                              placeholder={`Bài ${li + 1}: Tên bài học`}
                              required
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
                            />
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input type="checkbox" checked={ls.isFree} onChange={e => updateLesson(ci, li, 'isFree', e.target.checked)} className="h-3.5 w-3.5 text-indigo-600 rounded" />
                              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Miễn phí</span>
                            </label>
                            {chap.lessons.length > 1 && (
                              <button type="button" onClick={() => removeLesson(ci, li)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>

                          {/* File upload per lesson */}
                          {ls.fileUrl ? (
                            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                              <span className={`p-1 rounded ${ls.fileType?.startsWith('video/') ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                                {ls.fileType?.startsWith('video/') ? <Film size={14} /> : <FileText size={14} />}
                              </span>
                              <span className="text-xs font-medium text-gray-700 flex-1 truncate">{ls.fileName}</span>
                              <button type="button" onClick={() => removeLessonFile(ci, li)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ) : ls.uploading ? (
                            <div className="px-2 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Loader2 size={14} className="animate-spin text-indigo-500" />
                                <span className="text-xs text-indigo-600 font-medium">Đang upload... {ls.uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-indigo-100 rounded-full h-1">
                                <div className="bg-indigo-500 h-1 rounded-full transition-all" style={{ width: `${ls.uploadProgress}%` }} />
                              </div>
                            </div>
                          ) : (
                            <label className="block cursor-pointer">
                              <input type="file" accept="video/*,application/pdf" className="hidden"
                                onChange={e => { if (e.target.files?.[0]) uploadLessonFile(ci, li, e.target.files[0]); }} />
                              <div className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                                <Upload size={14} className="text-gray-300" />
                                <span className="text-xs text-gray-400">Đính kèm video/PDF (≤100MB)</span>
                              </div>
                            </label>
                          )}
                        </div>
                      ))}

                      <button type="button" onClick={() => addLesson(ci)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 border border-dashed border-indigo-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                        <Plus size={14} /> Thêm bài học
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addChapter}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 rounded-2xl text-sm font-bold text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                  <Plus size={18} /> Thêm chương mới
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
                className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all select-none ${isDragging
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
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP · Tối đa 100MB</p>
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
