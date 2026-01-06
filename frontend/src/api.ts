import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const recordVisit = async (path: string) => {
  try {
    await api.post('/analytics/visit', {
      path,
      userAgent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Error recording visit:', error);
  }
};

export const getContent = async () => {
  try {
    const response = await api.get('/content');
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
};

export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

export const getExperience = async () => {
  try {
    const response = await api.get('/experience');
    return response.data;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getTestimonials = async () => {
  try {
    const response = await api.get('/testimonials');
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const submitQuery = async (data: any) => {
  try {
    const response = await api.post('/queries', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    throw error;
  }
};
