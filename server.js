// Importa 'app' y las variables de entorno
import 'dotenv/config';
import app from './app.js';

// Define el puerto y arranca el servidor
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`[API] Servidor (Refactorizado) corriendo en el puerto ${PORT}`);
});