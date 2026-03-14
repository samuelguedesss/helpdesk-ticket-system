import { TextField, Box, Typography } from "@mui/material";

export default function DynamicCalledForm({
    fields,
    formData,
    onChange,
}) {
    return (
        <Box sx={{ width: "100%" }}>
            <Typography
                align="center"
                sx={{
                    mb: 2,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#2F3A32",
                }}
            >
                Preencha o formulário
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 280px)",
                    gap: "15px 15px",
                    justifyContent: "center",
                }}
            >
                {fields.map((field) => {
                    const isTextarea = field.type === "textarea";

                    return (
                        <Box
                            key={field.id}
                            sx={{ gridColumn: isTextarea ? "1 / -1" : "auto" }}
                        >
                            <Typography
                                sx={{
                                    mb: "6px",
                                    fontSize: 12,
                                    color: "#7C7C7C",
                                }}
                            >
                                {field.label}
                            </Typography>

                            <TextField
                                type={isTextarea ? "text" : field.type}
                                multiline={isTextarea}
                                minRows={isTextarea ? 1 : 1}
                                fullWidth={isTextarea}
                                size="small"
                                placeholder={field.placeholder}
                                value={formData[field.id] || ""}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                sx={{
                                    width: isTextarea ? "600px" : "280px",
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "6px",
                                        fontSize: 14,
                                        ...(isTextarea
                                            ? { alignItems: "flex-start" }
                                            : { height: 35 }),
                                    },
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
