export interface Student {
  id: string;
  userId: string;
  identification: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface CreateStudentInput {
  identification: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
}

export interface UpdateStudentInput {
  identification?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
}
