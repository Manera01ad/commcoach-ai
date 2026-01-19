import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const session = localStorage.getItem('supabase.auth.token');
    if (session) {
        const { access_token } = JSON.parse(session);
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
    }
    return config;
});

export const authService = {
    // Register a new user
    signup: async (email, password, fullName) => {
        const response = await api.post('/auth/signup', { email, password, fullName });
        return response.data;
    },

    // Log in a user
    signin: async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        return response.data;
    },

    // Log out a user
    signout: async () => {
        try {
            await api.post('/auth/signout');
        } finally {
            localStorage.removeItem('supabase.auth.token');
        }
    },

    // Get current session/profile
    getSession: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export default authService;
