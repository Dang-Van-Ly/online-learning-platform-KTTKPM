import React from "react";
import SectionHeader from "./SectionHeader";
import CourseCard from "./CourseCard";

const CourseSection = ({ title, highlight, highlightColor, subtitle, courses }) => {
  return (
    <div className="mb-16">
      <SectionHeader 
        title={title} 
        highlight={highlight} 
        highlightColor={highlightColor} 
        subtitle={subtitle} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? 'w-8 bg-blue-500' : 'w-1.5 bg-gray-300'}`}></span>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;