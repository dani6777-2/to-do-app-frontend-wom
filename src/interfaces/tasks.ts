export interface CreateTaskRequest {
  list_id: number;
  task_name: string;
  description?: string;
  is_completed?: boolean;
}

export interface TaskResponse {
  task_id: number;
  list_id: number;
  task_name: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
} 