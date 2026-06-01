import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  FileText,
  Video,
  UploadCloud,
  Trash2,
  CheckCircle,
  Loader2,
  Layers,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Film,
  FileIcon
} from "lucide-react";

const EMPTY_LESSON = () => ({
  title: "",
  content: "",
  isFree: false,
  fileName: "",
  fileUrl: "",
  fileType: "",
  file: null,
  uploading: false,
  uploadProgress: 0
});

export default function ChapterManagement() {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Form State
  const [chapterTitle, setChapterTitle] = useState("");
  const [lessons, setLessons] = useState([EMPTY_LESSON()]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedLessons, setExpandedLessons] = useState([0]); // First lesson expanded

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

  // -------- Lesson Management --------
  const addLesson = () => {
    setLessons(prev => [...prev, EMPTY_LESSON()]);
    setExpandedLessons(prev => [...prev, lessons.length]);
  };

  const removeLesson = (index) => {
    if (lessons.length <= 1) {
      setErrorMessage("Chương phải có ít nhất 1 bài học.");
      return;
    }
    setLessons(prev => prev.filter((_, i) => i !== index));
    setExpandedLessons(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const updateLesson = (index, field, value) => {
    setLessons(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleLessonExpanded = (index) => {
    setExpandedLessons(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // -------- File Upload per Lesson --------
  const uploadFileForLesson = async (index, file) => {
    if (!file) return;

    // Validate size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage(`File "${file.name}" vượt quá giới hạn 100MB.`);
      return;
    }

    // Validate type
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'application/pdf',
      'application/zip', 'application/x-zip-compressed'
    ];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('video/')) {
      setErrorMessage(`File "${file.name}" không được hỗ trợ. Chỉ chấp nhận Video (MP4, WebM) hoặc PDF.`);
      return;
    }

    updateLesson(index, 'uploading', true);
    updateLesson(index, 'uploadProgress', 0);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const res = await axios.post("/api/storage/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          updateLesson(index, 'uploadProgress', percent);
        }
      });

      updateLesson(index, 'fileName', file.name);
      updateLesson(index, 'fileUrl', res.data);
      updateLesson(index, 'fileType', file.type);
      updateLesson(index, 'file', file);
    } catch (err) {
      console.error("File upload failed", err);
      setErrorMessage(`Không thể upload file: ${file.name}`);
    } finally {
      updateLesson(index, 'uploading', false);
    }
  };

  const removeFileFromLesson = (index) => {
    updateLesson(index, 'fileName', '');
    updateLesson(index, 'fileUrl', '');
    updateLesson(index, 'fileType', '');
    updateLesson(index, 'file', null);
    updateLesson(index, 'uploadProgress', 0);
  };

  // -------- Submit Chapter --------
  const handlePublishChapter = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!chapterTitle.trim()) {
      setErrorMessage("Vui lòng nhập tên chương học.");
      return;
    }

    // Validate all lessons have titles
    for (let i = 0; i < lessons.length; i++) {
      if (!lessons[i].title.trim()) {
        setErrorMessage(`Bài học ${i + 1} chưa có tiêu đề.`);
        return;
      }
    }

    // Check if any lesson is still uploading
    if (lessons.some(l => l.uploading)) {
      setErrorMessage("Vui lòng chờ upload file hoàn tất trước khi đăng tải.");
      return;
    }

    try {
      setPublishing(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const payload = {
        courseId: Number(id),
        title: chapterTitle,
        lessons: lessons.map((l, i) => ({
          title: l.title,
          content: l.content,
          isFree: l.isFree,
          fileName: l.fileName || null,
          fileUrl: l.fileUrl || null,
          fileType: l.fileType || null
        }))
      };

      await axios.post("/api/chapters/publish", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(`Đăng tải chương "${chapterTitle}" với ${lessons.length} bài học thành công!`);
      // Reset form
      setChapterTitle("");
      setLessons([EMPTY_LESSON()]);
      setExpandedLessons([0]);

      // Refresh list
      await fetchCourseData();
    } catch (err) {
      console.error("Failed to publish chapter", err);
      const serverMsg = err?.response?.data?.error;
      setErrorMessage(serverMsg || "Đăng tải chương học thất bại. Vui lòng thử lại.");
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

  const getFileIcon = (type) => {
    if (!type) return <FileIcon size={16} />;
    if (type.startsWith('video/')) return <Film size={16} />;
    if (type === 'application/pdf') return <FileText size={16} />;
    return <FileIcon size={16} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

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
                      <div className="flex-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                          Chương {chap.orderNumber || idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-800 mt-0.5 leading-snug">
                          {chap.title}
                        </h3>
                        {/* Show lesson count */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                            <BookOpen size={12} />
                            {chap.lessons?.length || 0} bài học
                          </span>
                        </div>
                        {/* Show lesson names */}
                        {chap.lessons && chap.lessons.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {chap.lessons
                              .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                              .map((lesson, li) => (
                                <div key={lesson.id} className="flex items-center gap-2 text-xs text-slate-500 pl-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"></span>
                                  <span className="truncate">{lesson.title}</span>
                                  {lesson.isFree && (
                                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
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
                Đăng tải nội dung
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
              {/* Chapter Title */}
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

              {/* Lessons Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-500" />
                    Danh sách bài học ({lessons.length})
                  </label>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <PlusCircle size={14} />
                    Thêm bài học
                  </button>
                </div>

                {/* Lesson Cards */}
                <div className="space-y-3">
                  {lessons.map((lesson, index) => {
                    const isExpanded = expandedLessons.includes(index);
                    const hasFile = !!lesson.fileUrl;
                    const isVideo = lesson.fileType?.startsWith('video/');
                    const isPdf = lesson.fileType === 'application/pdf';

                    return (
                      <div
                        key={index}
                        className={`rounded-xl border transition-all duration-200 ${isExpanded
                            ? 'border-indigo-200 bg-indigo-50/30 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                      >
                        {/* Lesson Header (always visible) */}
                        <div
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          onClick={() => toggleLessonExpanded(index)}
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {lesson.title || `Bài học ${index + 1} (chưa đặt tên)`}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {hasFile && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${isVideo ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                  {isVideo ? <Film size={10} /> : <FileText size={10} />}
                                  {lesson.fileName}
                                </span>
                              )}
                              {lesson.isFree && (
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {lessons.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeLesson(index); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Xóa bài học"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                          </div>
                        </div>

                        {/* Lesson Body (expandable) */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                            {/* Lesson Title */}
                            <div className="space-y-1 pt-3">
                              <label className="text-xs font-semibold text-slate-600">Tiêu đề bài học *</label>
                              <input
                                type="text"
                                placeholder={`VD: Bài ${index + 1}: Tổng quan về khóa học`}
                                value={lesson.title}
                                onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                              />
                            </div>

                            {/* Lesson Content */}
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-600">Nội dung / Mô tả</label>
                              <textarea
                                rows={3}
                                placeholder="Mô tả nội dung bài học hoặc hướng dẫn cho học viên..."
                                value={lesson.content}
                                onChange={(e) => updateLesson(index, 'content', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                              />
                            </div>

                            {/* isFree Toggle */}
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`free-${index}`}
                                checked={lesson.isFree}
                                onChange={(e) => updateLesson(index, 'isFree', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                              <label htmlFor={`free-${index}`} className="text-xs font-medium text-slate-600">
                                Bài học miễn phí (cho học thử)
                              </label>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-600">
                                Tài liệu đính kèm (Video hoặc PDF — tối đa 100MB)
                              </label>

                              {hasFile ? (
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`p-2 rounded-lg ${isVideo ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                      {isVideo ? <Video size={18} /> : <FileText size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-slate-800 truncate pr-4">
                                        {lesson.fileName}
                                      </p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">
                                        {lesson.file ? formatFileSize(lesson.file.size) : 'Đã upload'}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFileFromLesson(index)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ) : lesson.uploading ? (
                                <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                    <span className="text-xs font-semibold text-indigo-700">
                                      Đang upload... {lesson.uploadProgress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-indigo-100 rounded-full h-1.5">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${lesson.uploadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <label className="block cursor-pointer">
                                  <input
                                    type="file"
                                    accept="video/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        uploadFileForLesson(index, e.target.files[0]);
                                      }
                                    }}
                                  />
                                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-1.5" />
                                    <p className="text-xs font-semibold text-slate-600">Click để chọn file</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">MP4, WebM, PDF — Tối đa 100MB</p>
                                  </div>
                                </label>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Lesson Button (bottom) */}
                <button
                  type="button"
                  onClick={addLesson}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                >
                  <PlusCircle size={18} />
                  Thêm bài học mới
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={publishing || lessons.some(l => l.uploading)}
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
                    <span>Đăng tải chương {nextChapterNumber} ({lessons.length} bài học)</span>
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
