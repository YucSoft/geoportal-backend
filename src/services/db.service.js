import { Pool } from 'pg';
import 'dotenv/config';

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Función para ejecutar consultas SQL
export const queryDatabase = async (sql, params) => {
    // Medir el tiempo de ejecución de la consulta
    const start = Date.now();
    // Obtener un cliente del pool
    let client;
    // Ejecutar la consulta
    try {
        // Conectar al cliente
        client = await pool.connect();
        const result = await client.query(sql, params);
        const duration = Date.now() - start;
        console.log(`Consulta ejecutada (${duration}ms): ${sql.substring(0, 50)}...`);
        return result;
    } catch (e) {
        throw e; 
    } finally {
        if (client) client.release();
    }
};