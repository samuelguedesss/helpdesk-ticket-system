import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import HistoryIcon from "@mui/icons-material/History";
import FolderIcon from "@mui/icons-material/Folder";   // <- ícone novo para categorias
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"; // Contorno
import { RoleAccess, FinancialOnly } from "../components/RoleBasedAccess";

export default function PageInit() {

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        top: "15rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        p: 1,
      }}
    >
      {/* Título */}
      <Typography variant="h5" fontWeight={600}>
        Olá, como podemos te ajudar?
      </Typography>

      {/* Container dos cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",   // <- agora empilha as linhas
          gap: 3,
          alignItems: "center",
        }}
      >
        {/* 1ª linha: 3 cards */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
          }}
        >
          <RoleAccess roles={[1, 2, 3]}>
            {/* Card 1 */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/solicitacao-chamado')}
                >
                  Abrir um novo chamado
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <RoleAccess roles={[1, 3]}>
            {/* Card 2 */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<ListIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/lista-chamados')}
                >
                  Lista de Chamados
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <RoleAccess roles={[2]}>
            {/* Card 2 */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<ListIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/Gerenciar-chamados')}
                >
                  Gereciar Chamados
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <RoleAccess roles={[1, 2, 3]}>
            {/* Card 3 */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/historico_chamado')}
                >
                  Histórico de Chamados
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>
        </Box>

        {/* 2ª linha: 2 cards */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
          }}
        >

          <RoleAccess roles={[1, 2]}>
            {/* Card 4 - Gerenciar categorias */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<FolderIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/Gerenciar-categoria')}
                >
                  Gerenciar categorias
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <RoleAccess roles={[1, 2]}>
            {/* Card 5 - Gerenciar usuários */}
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/Gerenciar-usarios')}
                >
                  Gerenciar usuários
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <RoleAccess roles={[1]}>
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<PeopleOutlineIcon sx={{ color: "#000000ff" }} />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/Gerenciar-tecnicos')}
                >
                  Gerenciar técnicos
                </Button>
              </CardContent>
            </Card>
          </RoleAccess>

          <FinancialOnly roles={[1]}>
            <Card sx={{ width: "290px", height: "55px", textAlign: "center", p: 1 }}>
              <CardContent>
                <Button
                  variant="outlined"
                  startIcon={<AssignmentTurnedInOutlinedIcon sx={{ color: "#000000ff" }} />}
                  sx={{ width: "100%", color: "black", border: "none", margin: "-4px 0px 0px 0px" }}
                  onClick={() => navigate('/fila-aprovacao')}
                >
                  Fila de Aprovações
                </Button>
              </CardContent>
            </Card>
          </FinancialOnly>
        </Box>
      </Box>
    </Box>
  );
}
