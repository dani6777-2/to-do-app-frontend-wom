export interface CreateListRequest {
  list_name: string;
}

export interface ListResponse {
  list_id: number;
  user_id: number;
  list_name: string;
  created_at: string;
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
} 