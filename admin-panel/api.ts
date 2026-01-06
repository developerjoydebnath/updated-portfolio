import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Analytics
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

// Content
export const getContent = async () => {
  const response = await api.get('/content');
  return response.data;
};

export const updateContent = async (data: any) => {
  const isFormData = data instanceof FormData;
  const response = await api.put('/content', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

// Experience
export const getExperience = async () => {
  const response = await api.get('/experience');
  return response.data;
};

export const addExperience = async (data: any) => {
  const response = await api.post('/experience', data);
  return response.data;
};

export const updateExperience = async (id: string, data: any) => {
  const response = await api.put(`/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: string) => {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};

// Projects
export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const addProject = async (formData: FormData) => {
  const response = await api.post('/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProject = async (id: string, formData: FormData) => {
  const response = await api.put(`/projects/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Queries
export const getQueries = async () => {
  const response = await api.get('/queries');
  return response.data;
};

export const updateQuery = async (id: string, data: any) => {
  const response = await api.put(`/queries/${id}`, data);
  return response.data;
};

export const deleteQuery = async (id: string) => {
  const response = await api.delete(`/queries/${id}`);
  return response.data;
};

// Services
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const addService = async (data: any) => {
  const response = await api.post('/services', data);
  return response.data;
};

export const updateService = async (id: string, data: any) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Skills
export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const addSkill = async (data: any) => {
  const response = await api.post('/skills', data);
  return response.data;
};

export const updateSkill = async (id: string, data: any) => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id: string) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

// Testimonials
export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

export const addTestimonial = async (formData: FormData) => {
  const response = await api.post('/testimonials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTestimonial = async (id: string, formData: FormData) => {
  const response = await api.put(`/testimonials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteTestimonial = async (id: string) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};
