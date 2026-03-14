import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiBackend from '../services/apiBackend';
import {
    Box, Paper, TextField, Typography, Button,
    MenuItem, Avatar, Stack, Grid, Divider,
    Checkbox, ListItemText, OutlinedInput, Select, Chip  // ← Chip aqui
} from "@mui/material";
import AppAlert from "./AppAlert";
import BackButton from "./BackButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

export default function UserRegister() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!userId;

    const [corporations, setCorporations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "", email: "", password: "",
        id_role: "", id_corporation: "", id_department: "",
        foto_user: null,
    });

    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    const closeAlert = () => setAlert(prev => ({ ...prev, open: false }));
    const showAlert = (message, severity = "success") => setAlert({ open: true, message, severity });

    useEffect(() => {
        loadCostCenter();
        loadCategories();
        if (isEditMode && userId) loadUserData(userId);
    }, [userId, isEditMode]);

    const loadCategories = async () => {
        try {
            const { data } = await apiBackend.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const loadUserData = async (id) => {
        try {
            setLoading(true);
            const response = await apiBackend.get(`/user/${id}`);
            const user = response.data;

            const costCenterId = user.id_cost_center || user.costCenter?.id;

            if (costCenterId) {
                const res = await apiBackend.get(`/departments/${costCenterId}`);
                setDepartments(res.data);
            }

            setTimeout(() => {
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    password: "",
                    id_role: user.id_role || "",
                    id_corporation: costCenterId || "",
                    id_department: user.id_department || "",
                    foto_user: null,
                });
            }, 100);

            if (user.id_role === 2) {
                const { data } = await apiBackend.get(`/user-categories/${id}`);
                setSelectedCategories(data);
            }

        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
            showAlert("Erro ao carregar dados do usuário", "error");
        } finally {
            setLoading(false);
        }
    };

    const loadCostCenter = async () => {
        try {
            const response = await apiBackend.get('/costcenters');
            setCorporations(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Erro ao carregar corporações:", error);
        }
    };

    const handleCostCenterChange = async (e) => {
        const id_corporation = e.target.value;
        setFormData({ ...formData, id_corporation, id_department: "" });
        try {
            const res = await apiBackend.get(`/departments/${id_corporation}`);
            setDepartments(res.data);
        } catch (error) {
            console.log("Erro ao carregar departamentos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "id_role" && Number(value) !== 2) setSelectedCategories([]);
        setFormData({ ...formData, [name]: value });
    };

    const handleImage = (e) => {
        setFormData({ ...formData, foto_user: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação de senha
        if (!isEditMode) {
            const senha = formData.password;
            const temMaiuscula = /[A-Z]/.test(senha);
            const temMinuscula = /[a-z]/.test(senha);
            const temNumero = /[0-9]/.test(senha);
            const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
            const temTamanho = senha.length >= 8;

            if (!temMaiuscula || !temMinuscula || !temNumero || !temEspecial || !temTamanho) {
                showAlert(
                    "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.",
                    "error"
                );
                return;
            }
        }

        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'password' && isEditMode && !formData[key]) return;
                payload.append(key, formData[key]);
            });

            let savedUserId = userId;

            if (isEditMode) {
                await apiBackend.put(`/user/${userId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showAlert("Usuário atualizado com sucesso!", "success");
            } else {
                const response = await apiBackend.post("/user", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                savedUserId = response.data.id;
                showAlert("Usuário cadastrado com sucesso!", "success");
            }

            if (Number(formData.id_role) === 2) {
                await apiBackend.post(`/user-categories/${savedUserId}`, {
                    categorias: selectedCategories
                });
            }

            setTimeout(() => navigate(-1), 1500);

        } catch (error) {
            console.error(error);
            showAlert(
                error.response?.data?.mensagem ||
                `Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} usuário.`,
                "error"
            );
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
                <Typography>Carregando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
            <BackButton to={-1} />

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, mt: -1 }}>
                {isEditMode ? "Editar Usuário" : "Cadastrar Usuário"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Preencha as informações abaixo para {isEditMode ? 'editar os dados do usuário' : 'criar um novo usuário'} no sistema.
            </Typography>

            <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>

                    {/* FOTO DO PERFIL */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={2}>
                            Foto do Perfil
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={3}>
                            <Avatar
                                src={formData.foto_user && URL.createObjectURL(formData.foto_user)}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Button
                                variant="outlined" component="label"
                                sx={{ textTransform: "none", borderColor: "#e0e0e0", color: "#666", "&:hover": { borderColor: "#999" } }}
                            >
                                Escolher arquivo
                                <input type="file" hidden accept="image/*" onChange={handleImage} />
                            </Button>
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* INFORMAÇÕES PESSOAIS */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={3}>
                            Informações Pessoais
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                    Nome Completo <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    name="name" size="small" fullWidth required
                                    placeholder="Digite o nome completo..."
                                    value={formData.name} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                    E-mail <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    name="email" size="small" fullWidth required
                                    placeholder="Digite o e-mail..."
                                    value={formData.email} onChange={handleChange}
                                />
                            </Grid>
                            {!isEditMode && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" fontWeight={500} mb={1}>
                                        Senha <span style={{ color: "red" }}>*</span>
                                    </Typography>
                                    <TextField
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        size="small"
                                        fullWidth
                                        required
                                        placeholder="Digite a senha..."
                                        value={formData.password}
                                        onChange={handleChange}
                                        helperText="Mín. 8 caracteres, maiúscula, minúscula, número e caractere especial"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setShowPassword(prev => !prev)} edge="end">
                                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* INFORMAÇÕES PROFISSIONAIS */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} mb={3}>
                            Informações Profissionais
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                    Cargo/Função <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    select name="id_role" size="small" fullWidth required
                                    value={formData.id_role} onChange={handleChange}
                                >
                                    <MenuItem value={1}>Administrador</MenuItem>
                                    <MenuItem value={2}>Técnico</MenuItem>
                                    <MenuItem value={3}>Usuário</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                    Centro de Custo <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    select name="id_corporation" size="small" fullWidth required
                                    value={formData.id_corporation} onChange={handleCostCenterChange}
                                >
                                    {corporations.map(corp => (
                                        <MenuItem key={corp.id} value={corp.id}>{corp.name.substring(0, 4)}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                    Departamento <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    select name="id_department" size="small" fullWidth required
                                    value={formData.id_department} onChange={handleChange}
                                    SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200 } } } }}
                                >
                                    {departments.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* CATEGORIAS — só aparece para Técnico */}
                            {Number(formData.id_role) === 2 && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" fontWeight={500} mb={1}>
                                        Categorias que atende <span style={{ color: "red" }}>*</span>
                                    </Typography>
                                    <Select
                                        multiple
                                        fullWidth
                                        size="small"
                                        value={selectedCategories}
                                        onChange={(e) => setSelectedCategories(e.target.value)}
                                        input={<OutlinedInput size="small" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map(id => {
                                                    const cat = categories.find(c => c.id === id);
                                                    return (
                                                        <Chip
                                                            key={id}
                                                            label={cat?.name}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: "#E8F5E9",
                                                                color: "#2F3A32",
                                                                fontWeight: 600,
                                                                fontSize: "0.72rem",
                                                                height: 22,
                                                                borderRadius: "999px",
                                                                border: "1px solid #2F3A32",
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        sx={{
                                            borderRadius: 2,
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2F3A32" },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2F3A32" },
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedCategories.includes(cat.id)}
                                                    sx={{ color: "#2F3A32", "&.Mui-checked": { color: "#2F3A32" } }}
                                                />
                                                <ListItemText
                                                    primary={cat.name}
                                                    primaryTypographyProps={{ fontSize: '0.85rem' }}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            )}

                        </Grid>
                    </Box>

                    {/* BOTÕES RODAPÉ */}
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
                        <Button
                            onClick={() => navigate(-1)} variant="outlined"
                            sx={{ color: "#666", borderColor: "#ccc", textTransform: "uppercase", px: 3, fontSize: 13, fontWeight: 600 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit" variant="contained"
                            sx={{ backgroundColor: "#2F3A32", "&:hover": { backgroundColor: "#1e2a22" }, textTransform: "uppercase", px: 3, fontSize: 13, fontWeight: 600 }}
                        >
                            {isEditMode ? "Salvar Alterações" : "Cadastrar Novo Usuário"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <AppAlert open={alert.open} message={alert.message} severity={alert.severity} onClose={closeAlert} />
        </Box>
    );
}