import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
};


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Armazena dados do usuário
    const [loading, setLoading] = useState(true); // Controla carregamento inicial

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token) {
            try {
                // Decodifica o JWT para pegar os dados do usuário
                const decoded = jwtDecode(token);
                
                setUser({
                    id: decoded.id,
                    nome: decoded.nome,
                    email: decoded.email,
                    role: decoded.role, // ⬅️ ID numérico (1, 2, 3)
                    department: decoded.department,
                    empresa: decoded.empresa
                });
            } catch (error) {
                // Se o token estiver corrompido, remove
                console.error("Token inválido:", error);
                sessionStorage.removeItem("token");
            }
        }
        
        setLoading(false); // Terminou de verificar
    }, []);

    const login = (token) => {
        sessionStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser({
            id: decoded.id,
            nome: decoded.nome,
            email: decoded.email,
            role: decoded.role,
            department: decoded.department,
            empresa: decoded.empresa
        });
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
export function PrivateRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth(); // ⬅️ USA O CONTEXT

    // Mostra loading enquanto verifica o token
    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh" 
            }}>
                Carregando...
            </div>
        );
    }

    // Se não estiver logado, redireciona para login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se houver restrição de papéis, verifica se o usuário tem permissão
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Sem permissão
    }

    // Se passou por todas as verificações, mostra a página
    return children;
}