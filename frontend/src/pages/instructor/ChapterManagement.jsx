import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  FileText,
  Video,
  File,
  UploadCloud,
  Trash2,
  CheckCircle,
  Loader2,
  Layers,
  ChevronRight
} from "lucide-react";

export default function ChapterManagement() {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Form State
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]); // [{ name, url, type, size }]
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      const [courseRes, chaptersRes] = await Promise.all([
        axios.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/chapters/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCourse(courseRes.data);
      // Sort chapters by orderNumber
      const sortedChapters = (chaptersRes.data || []).sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );
      setChapters(sortedChapters);
    } catch (err) {
      console.error("Failed to load course details", err);
      setErrorMessage("Không thể tải thông tin chương học.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // -------- File Upload Handling --------
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const res = await axios.post("/api/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return res.data; // Returns public URL or local path
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    setUploading(true);
    setErrorMessage("");
    const newUploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Basic size validation (e.g. 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} vượt quá giới hạn 50MB.`);
        continue;
      }

      try {
        const fileUrl = await uploadSingleFile(file);
        newUploaded.push({
          name: file.name,
          url: fileUrl,
          type: file.type,
          size: file.size
        });
      } catch (err) {
        console.error("File upload failed", err);
        setErrorMessage(`Không thể upload file: ${file.name}`);
      }
    }

    setUploadedFiles((prev) => [...prev, ...newUploaded]);
    setUploading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // -------- Submit Chapter --------
  const handlePublishChapter = async (e) => {
    e.preventDefault();
    if (!chapterTitle.trim()) {
      setErrorMessage("Vui lòng nhập tên chương học.");
      return;
    }

    try {
      setPublishing(true);
      setErrorMessage("");
      setSuccessMessage("");

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const payload = {
        courseId: Number(id),
        title: chapterTitle,
        content: chapterContent,
        files: uploadedFiles.map((f) => ({
          fileName: f.name,
          fileUrl: f.url,
          fileType: f.type
        }))
      };

      await axios.post("/api/chapters/publish", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(`Đăng tải chương ${chapters.length + 1} thành công!`);
      // Reset form fields
      setChapterTitle("");
      setChapterContent("");
      setUploadedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh list
      await fetchCourseData();
    } catch (err) {
      console.error("Failed to publish chapter", err);
      setErrorMessage("Đăng tải chương học thất bại. Vui lòng thử lại.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const nextChapterNumber = chapters.length + 1;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Quản lý chương học
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Khóa học: <span className="text-indigo-600 font-semibold">{course?.name || course?.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Chapter List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-indigo-500" />
              <span>Chương trình học hiện tại ({chapters.length})</span>
            </h2>

            {chapters.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 font-medium">Chưa có chương học nào.</p>
                <p className="text-xs text-slate-400 mt-1">Hãy đăng tải chương học đầu tiên ở bên phải.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {chapters.map((chap, idx) => (
                  <div
                    key={chap.id}
                    className="p-4 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-100 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                          Chương {chap.orderNumber || idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-800 mt-0.5 leading-snug">
                          {chap.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chapter Creation Form */}
        <div className="lg:col-span-7 space-y-4">
          <form
            onSubmit={handlePublishChapter}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2.5 py-1 rounded-full">
                Publishing Step
              </span>
              <h2 className="text-xl font-extrabold text-slate-850 mt-2.5 flex items-center gap-2">
                <span>Đăng tải chương {nextChapterNumber}</span>
              </h2>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 text-sm text-red-650 font-medium border border-red-100">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 text-sm text-emerald-750 font-medium border border-emerald-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tên chương học *</label>
                <input
                  type="text"
                  required
                  placeholder={`VD: Chương ${nextChapterNumber}: Giới thiệu và Cài đặt môi trường`}
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Description/Content Textarea */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nội dung chi tiết (Mô tả, nội dung học tập...)</label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung học tập bằng văn bản hoặc hướng dẫn nhanh cho học viên..."
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Drag and drop file upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tài nguyên đính kèm (Video bài giảng, File PDF...)</label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <UploadCloud className="mx-auto h-10 w-10 text-indigo-500 mb-2.5" />
                  <p className="text-sm font-bold text-slate-700">Kéo & thả tài liệu vào đây</p>
                  <p className="text-xs text-slate-400 mt-1">Hoặc click để chọn file (Hỗ trợ MP4, PDF, Zip... tối đa 50MB)</p>
                </div>
              </div>

              {/* Uploaded Files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Danh sách tài nguyên ({uploadedFiles.length})
                  </span>
                  <div className="grid gap-2">
                    {uploadedFiles.map((file, index) => {
                      const isVideo = file.type.startsWith("video/");
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg ${isVideo ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-650'}`}>
                              {isVideo ? <Video size={18} /> : <FileText size={18} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate pr-4">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-450 mt-0.5">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(index)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {uploading && (
                <div className="flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tải tệp lên hệ thống lưu trữ S3...</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={publishing || uploading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-100 active:scale-[0.98] transition-all"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang đăng tải chương học...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    <span>Đăng tải chương {nextChapterNumber}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
