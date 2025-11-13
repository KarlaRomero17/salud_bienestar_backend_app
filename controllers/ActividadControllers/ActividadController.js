const { TipoActividad, EjercicioPredefinido } = require('../../models/ActividadModels/EjercicioModel'); 
const SesionActividad = require('../../models/ActividadModels/SesionActividadModel');

// ====================================================================
// --- FUNCIÓN 1: OBTENER CATÁLOGO DE EJERCICIOS Y ACTIVIDADES ---
// ====================================================================
const getActividadData = async (req, res) => {
    try {
        
        const tiposActividad = await TipoActividad.find({}).select('label value').lean(); 
        
        const ejerciciosRaw = await EjercicioPredefinido.find({}).select('nombre').lean(); 
        
        const entrenamientosPredefinidos = ejerciciosRaw.map(ej => ej.nombre); 

        return res.status(200).json({
            tiposActividad,
            entrenamientosPredefinidos, 
        });

    } catch (error) {
        console.error('❌ Error al obtener catálogo (getActividadData):', error);
        res.status(500).send('Error del servidor al obtener catálogo.');
    }
};

// ====================================================================
// --- FUNCIÓN 2: CREAR SESIÓN  ---
// ====================================================================
const crearSesionActividad = async (req, res) => {
    try {
        
        const { idUsuario, fecha } = req.body; 
        
        if (!idUsuario) {
            return res.status(400).json({ msg: 'ID de usuario es requerido.' });
        }

        const nuevaSesion = new SesionActividad({ pacienteId: idUsuario, fecha, actividades: [] });
        await nuevaSesion.save();
        
       
        res.status(201).json({ sesionId: nuevaSesion._id, actividades: nuevaSesion.actividades });
    } catch (error) {
        console.error('❌ Error al crear sesión (crearSesionActividad):', error); 
        res.status(500).send('Error del servidor al crear sesión.');
    }
};

// ====================================================================
// --- FUNCIÓN 3: OBTENER SESIONES POR USUARIO  ---
// ====================================================================
const getSesionesPorPaciente = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        if (!pacienteId) {
            return res.status(400).json({ msg: 'ID de usuario es requerido.' });
        }
        const sesiones = await SesionActividad.find({ pacienteId: pacienteId }).sort({ fecha: -1 });
        res.json(sesiones);
    } catch (error) {
        console.error('❌ Error al obtener sesiones (getSesionesPorUsuarios):', error);
        res.status(500).send('Error del servidor al obtener sesiones.');
    }
};


// ====================================================================
// --- FUNCIÓN 4: ESTADÍSTICAS Y FILTRADO ---
// ====================================================================
const getEstadisticas = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const { fechaInicio, fechaFin } = req.query; 

        if (!pacienteId) {
            return res.status(400).json({ msg: 'ID de paciente es requerido.' });
        }

        let matchQuery = { pacienteId: pacienteId };

        
        if (fechaInicio || fechaFin) {
            matchQuery.fecha = {};
            if (fechaInicio) {
                matchQuery.fecha.$gte = new Date(fechaInicio);
            }
            if (fechaFin) {
                const end = new Date(fechaFin);
                end.setDate(end.getDate() + 1);
                matchQuery.fecha.$lt = end;
            }
        }

        
        const sesiones = await SesionActividad.find(matchQuery).sort({ fecha: 1 });

        
        let totalCalorias = 0;
        let totalKm = 0;
        const actividadCounts = {}; 

        sesiones.forEach(sesion => {
            sesion.actividades.forEach(actividad => {
                totalCalorias += actividad.calorias || 0;
                totalKm += actividad.distancia || 0;
                const nombre = actividad.nombre;
                actividadCounts[nombre] = (actividadCounts[nombre] || 0) + 1;
            });
        });

      
        let ejercicioMasHecho = { nombre: 'N/A', count: 0 };
        for (const nombre in actividadCounts) {
            if (actividadCounts[nombre] > ejercicioMasHecho.count) {
                ejercicioMasHecho.nombre = nombre;
                ejercicioMasHecho.count = actividadCounts[nombre];
            }
        }

        // Cálculo de calorías por día para la gráfica
        const caloriasPorDia = sesiones.reduce((acc, sesion) => {
            const fechaStr = sesion.fecha.toISOString().split('T')[0];
            const totalCaloriasDia = sesion.actividades.reduce((sum, act) => sum + (act.calorias || 0), 0);
            
            const existingEntry = acc.find(item => item._id === fechaStr);
            if (existingEntry) {
                existingEntry.totalCalorias += totalCaloriasDia;
            } else {
                acc.push({ _id: fechaStr, totalCalorias: totalCaloriasDia });
            }
            return acc;
        }, []);
        
        
        const estadisticas = {
            totalSesiones: sesiones.length,
            totalCalorias: parseFloat(totalCalorias.toFixed(1)),
            totalKm: parseFloat(totalKm.toFixed(2)),
            actividadMasComun: ejercicioMasHecho.nombre, 
            caloriasPorDia: caloriasPorDia,

            
            sesionesRecientes: sesiones.map(s => ({
                _id: s._id,
                fecha: s.fecha,
                actividades: s.actividades, 
            })).reverse(), 
        };

        res.json(estadisticas);

    } catch (error) {
        console.error('❌ Error al obtener estadísticas (getEstadisticas):', error);
        res.status(500).send('Error del servidor al obtener estadísticas.');
    }
};


// ====================================================================
// --- FUNCIÓN 5: OBTENER SESIÓN DE HOY ---
// ====================================================================
const getSesionHoy = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        
        if (!pacienteId) {
             return res.status(400).json({ msg: 'ID de usuario es requerido.' });
        }

       
        const today = new Date();
        const todayISO = today.toISOString().split('T')[0]; 

      
        const startOfTodayUTC = new Date(todayISO); 
       
        const startOfTomorrowUTC = new Date(todayISO);
        startOfTomorrowUTC.setDate(startOfTomorrowUTC.getDate() + 1); 
        
        const sesionHoy = await SesionActividad.findOne({ 
            pacienteId: pacienteId, 
            fecha: { 
                $gte: startOfTodayUTC,      
                $lt: startOfTomorrowUTC     
            } 
        });
        
        
        if (sesionHoy) {
            
            res.json({ sesionId: sesionHoy._id, actividades: sesionHoy.actividades });
        } else {
      
            res.json({}); 
        }

    } catch (error) {
        console.error('❌ Error al obtener sesión de hoy (getSesionHoy):', error);
        res.status(500).send('Error del servidor.');
    }
};
// ====================================================================\
// --- FUNCIÓN 6: AÑADIR ACTIVIDADES A SESIÓN  ---\
// ====================================================================\
const updateSesionActividad = async (req, res) => {
    try {
        const { idSesion } = req.params;
       
        const { actividades } = req.body; 

        if (!actividades) {
            return res.status(400).json({ msg: 'El array de actividades es requerido.' });
        }
        
        let sesionActualizada;

        if (req.query.action === 'replace') {
          
            sesionActualizada = await SesionActividad.findByIdAndUpdate(
                idSesion,
                { actividades: actividades }, 
                { new: true }
            );
        } else if (actividades.length > 0) {
           
            sesionActualizada = await SesionActividad.findByIdAndUpdate(
                idSesion,
                { $push: { actividades: { $each: actividades } } },
                { new: true }
            );
        } else {
            return res.status(400).json({ msg: 'No se encontraron actividades para añadir o reemplazar.' });
        }
        
        if (!sesionActualizada) {
            return res.status(404).json({ msg: 'Sesión no encontrada.' });
        }
        
        res.status(200).json(sesionActualizada);
    } catch (error) {
        console.error('❌ Error al actualizar sesión (updateSesionActividad):', error); 
        res.status(500).send('Error del servidor al actualizar sesión.');
    }
};


module.exports = {
    getActividadData,
    crearSesionActividad,
    getSesionesPorPaciente,
    getEstadisticas,
    getSesionHoy,           
    updateSesionActividad,  
};