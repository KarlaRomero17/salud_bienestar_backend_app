const mongoose = require("mongoose");

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        const {
            MONGODB_HOST,
            MONGODB_PORT = 27017,
            MONGODB_DB
        } = process.env;

        if (!MONGODB_HOST || !MONGODB_DB) {
            throw new Error("Faltan variables de entorno para MongoDB");
        }

        const mongoUri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;
        await mongoose.connect(mongoUri);
        console.log(`Database connected ${process.env.MONGODB_DB}` );
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
