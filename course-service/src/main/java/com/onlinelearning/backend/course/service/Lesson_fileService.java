package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Lesson_file;
import com.onlinelearning.backend.course.repository.Lesson_fileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Lesson_fileService {

    private final Lesson_fileRepository repo;

    public Lesson_fileService(Lesson_fileRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Lesson_file create(Lesson_file file) {
        return repo.save(file);
    }

    // GET BY LESSON ID
    public List<Lesson_file> getByLessonId(Long lessonId) {
        return repo.findByLessonId(lessonId);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }
}