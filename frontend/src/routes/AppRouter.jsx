import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "../context/AuthContext";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import PageInit from "../pages/PageInit";
import Layout from "../components/Layout";
import Register from "../components/register";
import CategoryRegistration from "../components/CategoryRegistration";
import CalledOpen from "../pages/CalledOpen";
import CalledList from "../pages/CalledList";
import CalledDatails from "../pages/CalledDatail"
import PageConfig from "../pages/PageConfig";
import ManegeUsers from "../pages/ManageUsers";
import ManageCategory from "../pages/ManegeCategory";
import AddSubcategory from "../components/AddSubcategoryformFild";
import ManageTechnicians from "../pages/ManageTechnicians";
import ManageCalls from '../pages/ManageCalls'
import CallHistory from '../pages/CallHistory'
import FinacialApproval from '../pages/FinancialApproval'

export const AppRouter = () => {
    return (
        <Routes>
            {/* Página sem layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rotas protegidas com layout */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }
            >
                {/* Agora PageInit renderiza DENTRO do Layout */}
                <Route index element={<PageInit />} />
                <Route path="cadastro-usuario" element={<Register />} />
                <Route path="editar-usuario/:userId" element={<Register />} />
                <Route path="cadastro-categoria/:id?" element={<CategoryRegistration />} />
                <Route path="solicitacao-chamado" element={<CalledOpen />} />
                <Route path="lista-chamados" element={<CalledList />} />
                <Route path="page-configuracao" element={<PageConfig />} />
                <Route path="chamados/:id" element={<CalledDatails />} />
                <Route path="Gerenciar-usarios" element={<ManegeUsers />} />
                <Route path="Gerenciar-categoria" element={<ManageCategory />} />
                <Route path="adicionar-subcategoria/:categoryId" element={<AddSubcategory />} />
                <Route path="editar-subcategoria/:subcategoryId" element={<AddSubcategory />} />
                <Route path="Gerenciar-tecnicos" element={<ManageTechnicians />} />
                <Route path="Gerenciar-chamados" element={<ManageCalls />} />
                <Route path="historico_chamado" element={<CallHistory />} />
                <Route path="fila-aprovacao" element={<FinacialApproval />} />
            </Route>

        </Routes>
    );
};
