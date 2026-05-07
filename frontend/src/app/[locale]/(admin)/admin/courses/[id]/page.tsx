"use client";

import { CourseEditor } from "@/components/courses/course-editor";
import { useParams } from "next/navigation";

export default function EditCoursePage() {
  const params = useParams();
  const id = String(params?.id || "");
  return <CourseEditor courseId={id} mode="admin" />;
}
