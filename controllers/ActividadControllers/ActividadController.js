// C:\...\salud_bienestar_backend_app\controllers\ActividadControllers\ActividadController.js

// 🚨 1. CORRECCIÓN DE RUTAS DE IMPORTACIÓN
// Subimos dos niveles (..) desde ActividadControllers para llegar a models/
const { TipoActividad, EjercicioPredefinido } = require('../../models/ActividadModels/EjercicioModel'); 
const SesionActividad = require('../../models/ActividadModels/SesionActividadModel');


// --- FUNCIÓN 1: OBTENER CATÁLOGO (Usado por /actividad/catalogo) ---
exports.getActividadData = async (req, res) => {
    try {
        // Seleccionamos solo los campos necesarios para el Picker de Actividad Física
        const tiposActividad = await TipoActividad.find({}).select('label value').lean(); 
        
        // 🔑 CORRECCIÓN CLAVE: Traer solo el campo 'nombre' de MongoDB
        const ejerciciosRaw = await EjercicioPredefinido.find({}).select('nombre').lean(); 
        
        // 🚀 Mapeamos los documentos a un array simple de strings con los nombres
        // Esto cambia: [{ nombre: "Sentadillas" }, ...] -> A: ["Sentadillas", ...]
        const entrenamientosPredefinidos = ejerciciosRaw.map(ej => ej.nombre); 

        return res.status(200).json({
            tiposActividad,
            entrenamientosPredefinidos, // Array de strings (El formato que espera el frontend)
        });

    } catch (error) {
        console.error('❌ Error al obtener el catálogo (getActividadData):', error.message);
        return res.status(500).json({ 
            message: "Error del servidor al cargar el catálogo de actividades.",
            error: error.message
        });
    }
};


// --- FUNCIÓN 2: CREAR SESIÓN (Usado por /actividad/sesion) ---
exports.crearSesionActividad = async (req, res) => {
    try {
        const { idUsuario, fecha, actividades } = req.body; 

        if (!idUsuario || !actividades || actividades.length === 0) {
            return res.status(400).json({ msg: 'Datos de sesión incompletos.' });
        }

        // Mongoose usa pacienteId (del modelo) y el body trae idUsuario
        const nuevaSesion = new SesionActividad({ pacienteId: idUsuario, fecha, actividades });
        await nuevaSesion.save();
        
        // Devolvemos la sesión creada
        res.status(201).json(nuevaSesion);
    } catch (error) {
        console.error('❌ Error al crear sesión (crearSesionActividad):', error); 
        res.status(500).send('Error del servidor al crear sesión.');
    }
};


// --- FUNCIÓN 3: OBTENER SESIONES (Usado por /actividad/sesiones/:pacienteId) ---
exports.getSesionesPorPaciente = async (req, res) => {
    try {
        const sesiones = await SesionActividad.find({ pacienteId: req.params.pacienteId }).sort({ fecha: -1 });
        res.json(sesiones);
    } catch (error) {
        console.error('❌ Error al obtener sesiones (getSesionesPorPaciente):', error);
        res.status(500).send('Error del servidor al obtener sesiones.');
    }
};


// --- FUNCIÓN 4: ESTADÍSTICAS (Placeholder para la ruta /actividad/estadisticas) ---
exports.getEstadisticas = (req, res) => {
    // Esta función debe existir para que la ruta en actividad.js no falle
    return res.status(501).json({ msg: "Funcionalidad de estadísticas aún no implementada." });
};