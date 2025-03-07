import { CreateListRequest, ListResponse } from '../interfaces/lists';

const API_URL = 'http://127.0.0.1:8000';

export const createList = async (data: CreateListRequest): Promise<ListResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/lists/`, {
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
    throw new Error(errorData.detail || 'Failed to create list');
  }

  return response.json();
};

export const getAllLists = async (): Promise<ListResponse[]> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/lists/`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch lists');
  }

  return response.json();
};

export const getList = async (listId: number): Promise<ListResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch list');
  }

  return response.json();
};

export const updateList = async (listId: number, list_name: string): Promise<ListResponse> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({ list_name })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update list');
  }

  return response.json();
};

export const deleteList = async (listId: number): Promise<{ message: string }> => {
  const apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
      'X-API-Key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete list');
  }

  return response.json();
}; 