import dotenv from 'dotenv'
import app from './app.js'
import db from './models/index.js'


dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('🟢 Conectado ao banco de dados');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log('🔴 Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();



