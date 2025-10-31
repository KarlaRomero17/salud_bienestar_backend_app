const mongoose = require("mongoose");

// Función para conectar a MongoDB Atlas
const connectDB = async () => {
    try {
        const { MONGODB_URI } = process.env;

        if (!MONGODB_URI) {
            throw new Error("Falta la variable de entorno MONGODB_URI");
        }

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Conectado a la base de datos MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a la base de datos MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
