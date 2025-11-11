// salud_bienestar_backend_app/scripts/seedActividadData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Asegúrate de que la ruta sea correcta para acceder a tu .env
dotenv.config({ path: '../.env' }); 

const { TipoActividad, EjercicioPredefinido } = require('../models/ActividadModels/EjercicioModel');

// ⬇️ DATOS ESTATICOS DEL ARCHIVO ActividadData.js ⬇️
const TIPOS_ACTIVIDAD_FISICA = [
    { label: 'Trotar', value: 'trotar' },
    { label: 'Caminar', value: 'caminar' },
    { label: 'Correr', value: 'correr' },
    { label: 'Ciclismo (Exteriores)', value: 'ciclismo_exterior' },
    { label: 'Ciclismo (Estática)', value: 'ciclismo_estatica' },
    { label: 'Natación', value: 'natacion' },
    { label: 'Remo (Máquina)', value: 'remo' },
    { label: 'Elíptica', value: 'eliptica' },
    { label: 'Senderismo / Hiking', value: 'senderismo' },
    { label: 'Deporte de Equipo (Fútbol, Básquet, etc.)', value: 'deporte_equipo' },
];

const ENTRENAMIENTOS_PREDEFINIDOS = {
    'Fuerza - Tren Superior (Pesas)': [
        'Press de banca (Barra)', 'Press inclinado con mancuernas', 'Dominadas con peso (Weighted Pull-ups)', 
        'Remo con barra (Bent-over Row)', 'Press Militar (Shoulder Press)', 'Elevaciones laterales', 
        'Curl de bíceps con barra', 'Extensiones de tríceps (Skull crushers)', 'Face Pulls', 'Máquina Peck Deck',
    ],
    'Fuerza - Tren Inferior (Pesas)': [
        'Sentadilla con barra (Squat)', 'Peso Muerto (Deadlift)', 'Prensa de piernas', 'Extensiones de cuádriceps', 
        'Curl femoral tumbado', 'Zancadas con mancuernas (Dumbbell Lunges)', 'Hip Thrust (empuje de cadera)', 
        'Elevación de talones con peso (Gemelos)',
    ],
    'Fuerza - Peso Corporal (Calistenia)': [
        'Flexiones (Push-ups) - Estándar', 'Flexiones (Push-ups) - Picas (Pike)', 'Dominadas (Pull-ups) - Agarre ancho/prono', 
        'Fondos en paralelas (Dips)', 'Sentadillas (Bodyweight Squats)', 'Pistol Squats (Sentadilla a una pierna)',
        'Plancha (Plank) - Alta/Baja', 'Zancadas (Lunges) - Sin peso', 'Remo invertido (Inverted Row)', 'Handstand Push-ups (flexiones de pino)',
    ],
    'Cardiovascular y HIIT': [
        'Saltos de tijera (Jumping Jacks)', 'Cuerda (Jump Rope)', 'Burpees', 'Mountain Climbers', 'High Knees (Rodillas al pecho)', 
        'Sprint en el sitio', 'Entrenamiento Tabata (20/10)', 'Entrenamiento de 30 min en Elíptica',
    ],
    'Movilidad, Core y Estiramientos': [
        'Abdominales (Crunches)', 'Elevación de piernas', 'Bicicleta (Crunches)', 'Estiramientos estáticos (Post-entreno)', 
        'Yoga (Vinyasa/Hatha)', 'Pilates - Matwork', 'Movilidad de cadera (90/90)', 'Foam Rolling (Auto-masaje)', 'Rotaciones torácicas',
    ],
    'Rendimiento Específico': [
        'Entrenamiento de umbral (Running)', 'Series de velocidad (Ciclismo)', 'Técnica de nado (Drills)', 
        'Pliometría (Saltos al cajón)', 'Ejercicios de agilidad (Escalera de agilidad)',
    ],
    'Rehabilitación / Terapia Física': [
        'Ejercicios de manguito rotador (bandas)', 'Rehabilitación de rodilla (isométricos)', 'Ejercicios de espalda baja (Bird-Dog)', 
        'Estiramientos miofasciales', 'Descanso Activo',
    ],
};
// ⬆️ FIN DE DATOS ESTATICOS ⬆️

const CON_PESAS_CATEGORIES = [
    'Fuerza - Tren Superior (Pesas)',
    'Fuerza - Tren Inferior (Pesas)',
];


const seedData = async () => {
    try {
        const { MONGODB_URI } = process.env;

        if (!MONGODB_URI) {
            throw new Error("Falta la variable de entorno MONGODB_URI. Verifica tu archivo .env");
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conexión a MongoDB exitosa para el seeder.');

        // 1. Insertar Tipos de Actividad Física
        await TipoActividad.deleteMany({});
        await TipoActividad.insertMany(TIPOS_ACTIVIDAD_FISICA);
        console.log(`➡️ Insertados ${TIPOS_ACTIVIDAD_FISICA.length} Tipos de Actividad Física.`);

        // 2. Insertar Ejercicios Predefinidos
        await EjercicioPredefinido.deleteMany({});
        
        const ejerciciosBulk = [];
        for (const [categoria, ejercicios] of Object.entries(ENTRENAMIENTOS_PREDEFINIDOS)) {
            const esConPesas = CON_PESAS_CATEGORIES.includes(categoria);
            ejercicios.forEach(nombre => {
                ejerciciosBulk.push({ nombre, categoria, esConPesas });
            });
        }
        
        await EjercicioPredefinido.insertMany(ejerciciosBulk);
        console.log(`➡️ Insertados ${ejerciciosBulk.length} Ejercicios Predefinidos.`);

        console.log('🎉 Seed de ActividadData completado exitosamente.');

    } catch (error) {
        console.error('❌ Error en el seed de ActividadData:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada.');
    }
};

seedData();