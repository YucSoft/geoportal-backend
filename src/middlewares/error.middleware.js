// Middleware para manejar errores no capturados en la aplicación
const errorMiddleware = (err, req, res, next) => {
    console.error('--- ERROR NO CAPTURADO ---');
    console.error(err.stack);
    console.error('--------------------------');

    // Responder con un mensaje de error genérico
    const statusCode = err.status || 500;
    const message = err.message || 'Error interno del servidor.';
    
    // Enviar la respuesta de error
    res.status(statusCode).json({ error: message });
};

export default errorMiddleware;