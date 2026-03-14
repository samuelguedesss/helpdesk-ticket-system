// models/index.js
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { sequelize } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

const files = readdirSync(__dirname).filter(
  (file) => file !== "index.js" && file.endsWith(".js")
);

for (const file of files) {
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const ModelClass = (await import(modelPath)).default;

  const modelInstance = ModelClass.init(sequelize);

  db[ModelClass.name] = modelInstance;
}

Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;

export default db;
