import { Box, Typography, Button, IconButton } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

export default function UploadPlaceholder({ onFilesChange }) {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const addFiles = (newFiles) => {
        const merged = [...files, ...newFiles].reduce((acc, file) => {
            if (!acc.find((f) => f.name === file.name && f.size === file.size)) {
                acc.push(file);
            }
            return acc;
        }, []);
        setFiles(merged);
        onFilesChange?.(merged);
    };

    const removeFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onFilesChange?.(updated);
    };

    const handleSelect = (e) => {
        addFiles(Array.from(e.target.files));
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 600 }}>
                <Typography sx={{ mb: 1, fontSize: 14, color: "#7C7C7C" }}>
                    Enviar arquivos:
                </Typography>

                {/* Área de drop */}
                <Box
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    sx={{
                        border: `2px dashed ${dragging ? "#1976d2" : "#C4C4C4"}`,
                        borderRadius: 2,
                        height: 170,
                        width: "600px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        backgroundColor: dragging ? "#E3F2FD" : "#FAFAFA",
                        transition: "all 0.2s",
                    }}
                >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#9E9E9E" }} />

                    <Typography sx={{ fontSize: 13, color: "#7A7A7A", textAlign: "center", maxWidth: 420 }}>
                        Arraste e solte ou selecione os arquivos para fazer o envio
                    </Typography>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => inputRef.current.click()}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#B0B0B0",
                            width: "194px",
                            borderRadius: "20px",
                            boxShadow: "none",
                            "&:hover": { backgroundColor: "#9E9E9E" },
                        }}
                    >
                        Selecionar arquivos
                    </Button>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleSelect}
                    />
                </Box>

                {/* Lista de arquivos selecionados */}
                {files.length > 0 && (
                    <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                        {files.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 2,
                                    backgroundColor: "#F5F5F5",
                                    border: "1px solid #E0E0E0",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: "#9E9E9E" }} />
                                    <Box>
                                        <Typography sx={{ fontSize: 13, color: "#3D3D3D", lineHeight: 1.2 }}>
                                            {file.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, color: "#9E9E9E" }}>
                                            {formatSize(file.size)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton size="small" onClick={() => removeFile(index)}>
                                    <CloseIcon sx={{ fontSize: 16, color: "#9E9E9E" }} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}