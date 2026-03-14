import axios from "axios";

const api_backend = `${import.meta.env.VITE_API_URL}/api`;

const apiBackend = axios.create({
    baseURL: api_backend,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 INTERCEPTOR REQUEST - Adiciona token
apiBackend.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token"); // ⬅️ MUDOU AQUI

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔐 INTERCEPTOR RESPONSE - Detecta token expirado
apiBackend.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se retornar 401 (Unauthorized), remove token e redireciona
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("token"); // ⬅️ MUDOU AQUI
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiBackend;