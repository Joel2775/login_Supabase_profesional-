export interface Course {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreateCourseInput {
  name: string;
  description?: string | null;
}

export interface UpdateCourseInput {
  name?: string;
  description?: string | null;
}
