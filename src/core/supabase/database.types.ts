export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          user_id: string;
          identification: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          identification: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          identification?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          course_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_id: string;
          course_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_id?: string;
          course_id?: string;
          enrolled_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      enroll_student_in_courses: {
        Args: {
          p_student_id: string;
          p_course_ids: string[];
        };
        Returns: Database["public"]["Tables"]["enrollments"]["Row"][];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
