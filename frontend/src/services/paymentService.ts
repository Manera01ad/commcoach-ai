import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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

export const paymentService = {
    // Start checkout process (Smart Routing)
    createCheckout: async () => {
        const response = await api.post('/founders/create-checkout');
        return response.data;
    },

    // Verify Razorpay payment
    verifyRazorpay: async (data: any) => {
        const response = await api.post('/founders/verify-razorpay', data);
        return response.data;
    },

    // Verify Stripe payment (usually handled via redirect params, but useful for API)
    verifyStripe: async (sessionId: string) => {
        const response = await api.post('/founders/verify-stripe', { sessionId });
        return response.data;
    }
};

export default paymentService;
