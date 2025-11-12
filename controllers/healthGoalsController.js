// controllers/healthGoalsController.js
const HealthGoals = require('../models/HealthGoals');

// @desc    Obtener todos los objetivos de salud
// @route   GET /api/health-goals
exports.obtenerTodosObjetivos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, completado, busqueda, paginado = 'false' } = req.query;
        
        // Obtener el userId de los parámetros de la ruta
        const { userId } = req.params;

        console.log('🔍 Buscando objetivos para userId:', userId);

        // Validar que venga el userId
        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el userId del usuario'
            });
        }

        // Construir filtro - buscar por userId (campo en tu modelo)
        const filtro = { 
            userId: userId, // ← BUSCAR POR EL CAMPO "userId" 
            active: true 
        };
        
        if (completado !== undefined) filtro.completed = completado === 'true';
        if (busqueda) filtro.title = { $regex: busqueda, $options: 'i' };

        console.log('Filtro de búsqueda por userId:', filtro);

        let objetivos;
        let respuesta = { exito: true, datos: null };

        const esPaginado = paginado === 'true';

        if (esPaginado) {
            objetivos = await HealthGoals.find(filtro)
                .sort({ createdAt: -1 })
                .limit(limite * 1)
                .skip((pagina - 1) * limite);

            const total = await HealthGoals.countDocuments(filtro);

            respuesta.datos = objetivos;
            respuesta.paginacion = {
                paginaActual: parseInt(pagina),
                totalPaginas: Math.ceil(total / limite),
                totalObjetivos: total,
                tieneSiguientePagina: pagina < Math.ceil(total / limite),
                tienePaginaAnterior: pagina > 1
            };
        } else {
            objetivos = await HealthGoals.find(filtro)
                .sort({ createdAt: -1 });

            respuesta.datos = objetivos;
        }

        console.log(`✅ Encontrados ${objetivos.length} objetivos para el userId ${userId}`);

        res.json(respuesta);
    } catch (error) {
        console.error('Error en obtenerTodosObjetivos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener los objetivos de salud',
            error: error.message
        });
    }
};

// @desc    Obtener un objetivo por ID
// @route   GET /api/health-goals/:id
exports.obtenerObjetivoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const objetivo = await HealthGoals.findById(id);

        if (!objetivo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Objetivo no encontrado'
            });
        }

        res.json({
            exito: true,
            datos: objetivo
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener el objetivo',
            error: error.message
        });
    }
};

// @desc    Crear un nuevo objetivo de salud
// @route   POST /api/health-goals
exports.crearObjetivo = async (req, res) => {
    try {
        const {
            title,
            type,
            targetWeight,
            unit,
            targetDate,
            progress = 0,
            completed = false,
            userId
        } = req.body;

        // Validaciones
        if (!title || !type || !targetWeight || !targetDate) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Título, tipo, peso objetivo y fecha objetivo son campos requeridos'
            });
        }

        // Validar tipo
        const tiposValidos = ['loss', 'gain'];
        if (!tiposValidos.includes(type)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Tipo de objetivo inválido. Use "loss" o "gain"'
            });
        }

        // Validar unidad
        const unidadesValidas = ['kg', 'lb'];
        if (!unidadesValidas.includes(unit)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Unidad inválida. Use "kg" o "lb"'
            });
        }

        // Validar fecha
        const fechaObjetivo = new Date(targetDate);
        if (isNaN(fechaObjetivo.getTime())) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Fecha objetivo inválida'
            });
        }

        // Validar que la fecha no sea en el pasado
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaObjetivo < hoy) {
            return res.status(400).json({
                exito: false,
                mensaje: 'La fecha objetivo no puede ser en el pasado'
            });
        }

        const objetivo = new HealthGoals({
            userId: userId ,
            title,
            type,
            targetWeight: parseFloat(targetWeight),
            unit,
            targetDate: fechaObjetivo,
            progress: parseInt(progress),
            completed: Boolean(completed)
        });

        await objetivo.save();

        res.status(201).json({
            exito: true,
            mensaje: 'Objetivo creado exitosamente',
            datos: objetivo
        });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear el objetivo',
            error: error.message
        });
    }
};

// @desc    Actualizar un objetivo
// @route   PUT /api/health-goals/:id
exports.actualizarObjetivo = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            type,
            targetWeight,
            unit,
            targetDate,
            progress,
            completed
        } = req.body;

        // Buscar el objetivo
        let objetivo = await HealthGoals.findById(id);

        if (!objetivo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Objetivo no encontrado'
            });
        }

        // Actualizar campos
        if (title !== undefined) objetivo.title = title;
        if (type !== undefined) objetivo.type = type;
        if (targetWeight !== undefined) objetivo.targetWeight = parseFloat(targetWeight);
        if (unit !== undefined) objetivo.unit = unit;
        if (targetDate !== undefined) objetivo.targetDate = new Date(targetDate);
        if (progress !== undefined) objetivo.progress = parseInt(progress);
        if (completed !== undefined) objetivo.completed = Boolean(completed);

        await objetivo.save();

        res.json({
            exito: true,
            mensaje: 'Objetivo actualizado exitosamente',
            datos: objetivo
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el objetivo',
            error: error.message
        });
    }
};

// @desc    Eliminar un objetivo (eliminación lógica)
// @route   DELETE /api/health-goals/:id
exports.eliminarObjetivo = async (req, res) => {
    try {
        const { id } = req.params;

        const objetivo = await HealthGoals.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        );

        if (!objetivo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Objetivo no encontrado'
            });
        }

        res.json({
            exito: true,
            mensaje: 'Objetivo eliminado exitosamente',
            datos: objetivo
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar el objetivo',
            error: error.message
        });
    }
};


// @desc    Obtener objetivos próximos a vencer
// @route   GET /api/health-goals/proximos-vencer
exports.obtenerObjetivosProximosVencer = async (req, res) => {
    try {
        const { dias = 7 } = req.query;
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setDate(fechaInicio.getDate() + parseInt(dias));

        const objetivos = await HealthGoals.find({
            completed: false,
            targetDate: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        }).sort({ targetDate: 1 });

        res.json({
            exito: true,
            datos: objetivos,
            cantidad: objetivos.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener objetivos próximos a vencer',
            error: error.message
        });
    }
};

// @desc    Obtener objetivos vencidos
// @route   GET /api/health-goals/vencidos
exports.obtenerObjetivosVencidos = async (req, res) => {
    try {
        const ahora = new Date();

        const objetivos = await HealthGoals.find({
            completed: false,
            targetDate: { $lt: ahora }
        }).sort({ targetDate: 1 });

        res.json({
            exito: true,
            datos: objetivos,
            cantidad: objetivos.length
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener objetivos vencidos',
            error: error.message
        });
    }
};

// @desc    Obtener estadísticas de objetivos
// @route   GET /api/health-goals/estadisticas
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const totalObjetivos = await HealthGoals.countDocuments();
        const objetivosCompletados = await HealthGoals.countDocuments({ completed: true });
        const objetivosEnProgreso = await HealthGoals.countDocuments({
            completed: false,
            progress: { $gt: 0 }
        });
        const objetivosNoIniciados = await HealthGoals.countDocuments({
            completed: false,
            progress: 0
        });
        const objetivosVencidos = await HealthGoals.countDocuments({
            completed: false,
            targetDate: { $lt: new Date() }
        });

        const progresoPromedio = await HealthGoals.aggregate([
            { $match: { completed: false } },
            { $group: { _id: null, promedio: { $avg: "$progress" } } }
        ]);

        res.json({
            exito: true,
            datos: {
                totalObjetivos,
                objetivosCompletados,
                objetivosEnProgreso,
                objetivosNoIniciados,
                objetivosVencidos,
                progresoPromedio: progresoPromedio[0]?.promedio || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// controllers/healthGoalsController.js

// @desc    Actualizar progreso de un objetivo
// @route   PUT /api/health-goals/:id/progreso
exports.actualizarProgreso = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        console.log('📊 Actualizando progreso:', { id, progress });

        // Validar que el progreso sea un número entre 0 y 100
        const progresoValidado = Math.max(0, Math.min(100, parseFloat(progress)));

        const objetivo = await HealthGoals.findByIdAndUpdate(
            id,
            {
                progress: progresoValidado,
                // Si el progreso es 100%, marcar como completado automáticamente
                ...(progresoValidado >= 100 && { 
                    completed: true, 
                    completedAt: new Date() 
                })
            },
            { new: true, runValidators: true }
        );

        if (!objetivo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Objetivo no encontrado'
            });
        }

        console.log('✅ Progreso actualizado:', objetivo.progress);

        res.json({
            exito: true,
            mensaje: 'Progreso actualizado correctamente',
            datos: objetivo
        });

    } catch (error) {
        console.error('❌ Error al actualizar progreso:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el progreso',
            error: error.message
        });
    }
};

// @desc    Marcar objetivo como completado
// @route   PUT /api/health-goals/:id/completar
exports.marcarCompletado = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🎯 Marcando como completado:', id);

        const objetivo = await HealthGoals.findByIdAndUpdate(
            id,
            { 
                completed: true,
                progress: 100,
                completedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!objetivo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Objetivo no encontrado'
            });
        }

        console.log('✅ Objetivo marcado como completado:', objetivo.title);

        res.json({
            exito: true,
            mensaje: 'Objetivo marcado como completado',
            datos: objetivo
        });

    } catch (error) {
        console.error('❌ Error al marcar como completado:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al marcar el objetivo como completado',
            error: error.message
        });
    }
};

