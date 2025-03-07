export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  api_key: string;
  created_at: string;
  email: string;
  user_id: number;
  username: string;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
} 