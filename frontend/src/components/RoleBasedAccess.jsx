import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

// Renderiza apenas para Administrador (role = 1)
export function AdminOnly({ children }) {
    const { user } = useAuth();
    return user?.role === ROLES.ADMIN ? children : null;
}

// Renderiza apenas para Técnico (role = 2)
export function TechnicianOnly({ children }) {
    const { user } = useAuth();
    return user?.role === ROLES.TECNICO ? children : null;
}

// Renderiza apenas para Usuário comum (role = 3)
export function UserOnly({ children }) {
    const { user } = useAuth();
    return user?.role === ROLES.USUARIO ? children : null;
}

// Renderiza para múltiplas roles
export function RoleAccess({ roles, children }) {
    const { user } = useAuth();
    return roles.includes(user?.role) ? children : null;
}

// Renderiza para Admin OU Técnico
export function AdminOrTechnicianOnly({ children }) {
    const { user } = useAuth();
    return user?.role === ROLES.ADMIN || user?.role === ROLES.TECNICO ? children : null;
}

// Renderiza apenas para o departamento Financeiro (id_department = 7)
export function FinancialOnly({ children }) {
    const { user } = useAuth();
    return user?.department === 7 ? children : null;
}