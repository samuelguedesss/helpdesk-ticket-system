import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de uploads local (backend/uploads)
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

// Garante que o diretório de uploads existe
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// "Suporte Técnico" → "suporte-tecnico"
export function normalizeFolderName(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Faz upload de buffer e retorna a key completa
export async function uploadBuffer({ buffer, key, contentType }) {
    const fullPath = path.join(UPLOADS_DIR, key);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, buffer);
    return key;
}

// Deleta arquivo local pela key
export async function deleteFile(key) {
    const fullPath = path.join(UPLOADS_DIR, key);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

// Retorna a URL pública para acessar o arquivo
export async function getPresignedUrl({ key, expiresIn = 3600 }) {
    const baseUrl = process.env.BASE_URL || "http://localhost:8080";
    return `${baseUrl}/uploads/${key}`;
}

export default { uploadBuffer, deleteFile, getPresignedUrl, normalizeFolderName };
