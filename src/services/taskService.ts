import { CreateTaskRequest, TaskResponse } from '../interfaces/tasks';

const API_URL = 'http://127.0.0.1:8000';

export const createTask = async (data: CreateTaskRequest): Promise<TaskResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create task');
  }

  return response.json();
};

export const getAllTasks = async (): Promise<TaskResponse[]> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch tasks');
  }

  return response.json();
};

export const getTask = async (taskId: number): Promise<TaskResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch task');
  }

  return response.json();
};

interface UpdateTaskRequest {
  task_name?: string;
  description?: string;
  is_completed?: boolean;
}

export const updateTask = async (taskId: number, data: UpdateTaskRequest): Promise<TaskResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update task');
  }

  return response.json();
};

export const deleteTask = async (taskId: number): Promise<{ message: string }> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete task');
  }

  return response.json();
}; 