const Recordatorios = require('../models/Recordatorios');

// @desc    Obtener todos los recordatorios
// @route   GET /api/recordatorios
exports.obtenerTodosRecordatorios = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, activo, busqueda } = req.query;
    
    // Construir filtro
    const filtro = {};
    
    // Filtrar por estado activo/inactivo si se especifica
    if (activo !== undefined) {
      filtro.active = activo === 'true';
    }
    
    // Búsqueda por nombre
    if (busqueda) {
      filtro.name = { $regex: busqueda, $options: 'i' };
    }
    
    const recordatorios = await Recordatorios.find(filtro)
      .sort({ createdAt: -1 })
      .limit(limite * 1)
      .skip((pagina - 1) * limite);
    
    const total = await Recordatorios.countDocuments(filtro);
    
    res.json({
      exito: true,
      datos: recordatorios,
      paginacion: {
        paginaActual: parseInt(pagina),
        totalPaginas: Math.ceil(total / limite),
        totalRecordatorios: total,
        tieneSiguientePagina: pagina < Math.ceil(total / limite),
        tienePaginaAnterior: pagina > 1
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los recordatorios',
      error: error.message
    });
  }
};

// @desc    Obtener un recordatorio por ID
// @route   GET /api/recordatorios/:id
exports.obtenerRecordatorioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recordatorio = await Recordatorios.findById(id);
    
    if (!recordatorio) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recordatorio no encontrado'
      });
    }
    
    res.json({
      exito: true,
      datos: recordatorio
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el recordatorio',
      error: error.message
    });
  }
};

// @desc    Crear un nuevo recordatorio
// @route   POST /api/recordatorios
// @desc    Crear un nuevo recordatorio
// @route   POST /api/recordatorios
exports.crearRecordatorio = async (req, res) => {
  try {
    const { nombre, dosis, hora, dias, activo = true, zonaHoraria, userId } = req.body;

    // Validaciones
    if (!nombre || !dosis || !hora || !dias || dias.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Nombre, dosis, hora y días son campos requeridos'
      });
    }

    const regexHora = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regexHora.test(hora)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Formato de hora inválido. Use HH:MM (24 horas)'
      });
    }

    // Validar días
    const diasValidos = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const diasInvalidos = dias.filter(dia => !diasValidos.includes(dia));
    if (diasInvalidos.length > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: `Días inválidos: ${diasInvalidos.join(', ')}`
      });
    }

    // Función para calcular próxima fecha (copiada del modelo)
    const calcularProximaFecha = (time, days) => {
      const daysMap = {
        'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4, 
        'Vie': 5, 'Sáb': 6, 'Dom': 0
      };
      
      const today = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      
      // Buscar el próximo día que coincida
      for (let i = 0; i <= 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][nextDate.getDay()];
        
        if (days.includes(dayName)) {
          nextDate.setHours(hours, minutes, 0, 0);
          
          // Si es hoy pero ya pasó la hora, buscar el próximo
          if (i === 0 && nextDate < today) {
            continue;
          }
          
          return nextDate;
        }
      }
      
      // Fallback: próximo lunes
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7));
      nextMonday.setHours(hours, minutes, 0, 0);
      return nextMonday;
    };

    // Calcular nextReminderDate manualmente
    const nextReminderDate = calcularProximaFecha(hora, dias);

    const recordatorio = new Recordatorios({
      userId: userId || '-OdER-8T0_WKhxrfi5HY',
      name: nombre,
      dosage: dosis,
      time: hora,
      days: dias,
      active: activo,
      timezone: zonaHoraria || 'UTC',
      nextReminderDate: nextReminderDate 
    });

    await recordatorio.save();

    res.status(201).json({
      exito: true,
      mensaje: 'Recordatorio creado exitosamente',
      datos: recordatorio
    });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear el recordatorio',
      error: error.message
    });
  }
};


// @desc    Actualizar un recordatorio
// @route   PUT /api/recordatorios/:id
exports.actualizarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dosis, hora, dias, activo, zonaHoraria } = req.body;
    
    // Buscar el recordatorio
    let recordatorio = await Recordatorios.findById(id);
    
    if (!recordatorio) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recordatorio no encontrado'
      });
    }
    
    // Actualizar campos
    if (nombre !== undefined) recordatorio.name = nombre;
    if (dosis !== undefined) recordatorio.dosage = dosis;
    if (hora !== undefined) recordatorio.time = hora;
    if (dias !== undefined) recordatorio.days = dias;
    if (activo !== undefined) recordatorio.active = activo;
    if (zonaHoraria !== undefined) recordatorio.timezone = zonaHoraria;
    
    await recordatorio.save();
    
    res.json({
      exito: true,
      mensaje: 'Recordatorio actualizado exitosamente',
      datos: recordatorio
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar el recordatorio',
      error: error.message
    });
  }
};

// @desc    Eliminar un recordatorio
// @route   DELETE /api/recordatorios/:id
exports.eliminarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recordatorio = await Recordatorios.findByIdAndDelete(id);
    
    if (!recordatorio) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recordatorio no encontrado'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Recordatorio eliminado exitosamente',
      datos: recordatorio
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar el recordatorio',
      error: error.message
    });
  }
};

// @desc    Activar/desactivar recordatorio
// @route   PATCH /api/recordatorios/:id/alternar
exports.alternarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recordatorio = await Recordatorios.findById(id);
    
    if (!recordatorio) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recordatorio no encontrado'
      });
    }
    
    recordatorio.active = !recordatorio.active;
    await recordatorio.save();
    
    res.json({
      exito: true,
      mensaje: `Recordatorio ${recordatorio.active ? 'activado' : 'desactivado'}`,
      datos: recordatorio
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar estado del recordatorio',
      error: error.message
    });
  }
};

// @desc    Obtener recordatorios de hoy
// @route   GET /api/recordatorios/hoy
exports.obtenerRecordatoriosHoy = async (req, res) => {
  try {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    const recordatorios = await Recordatorios.find({
      active: true,
      nextReminderDate: {
        $gte: hoy,
        $lt: manana
      }
    }).sort({ nextReminderDate: 1 });

    res.json({
      exito: true,
      datos: recordatorios,
      cantidad: recordatorios.length
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los recordatorios de hoy',
      error: error.message
    });
  }
};

// @desc    Marcar recordatorio como tomado
// @route   POST /api/recordatorios/:id/tomado
exports.marcarComoTomado = async (req, res) => {
  try {
    const { id } = req.params;
    const { tomadoEl = new Date() } = req.body;

    const recordatorio = await Recordatorios.findById(id);

    if (!recordatorio) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recordatorio no encontrado'
      });
    }

    // Calcular si fue a tiempo (±30 minutos)
    const horaRecordatorio = new Date(recordatorio.nextReminderDate);
    const horaToma = new Date(tomadoEl);
    const diferenciaTiempo = Math.abs(horaToma - horaRecordatorio);
    const fueATiempo = diferenciaTiempo <= 30 * 60 * 1000; // 30 minutos

    // Agregar al historial
    recordatorio.history.push({
      takenAt: horaToma,
      wasOnTime: fueATiempo
    });

    // Actualizar última toma
    recordatorio.lastTaken = horaToma;

    // Avanzar al próximo recordatorio
    await recordatorio.advanceToNextReminder();

    res.json({
      exito: true,
      mensaje: 'Medicamento marcado como tomado',
      datos: recordatorio,
      fueATiempo: fueATiempo
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al marcar como tomado',
      error: error.message
    });
  }
};

// @desc    Obtener recordatorios próximos
// @route   GET /api/recordatorios/proximos
exports.obtenerRecordatoriosProximos = async (req, res) => {
  try {
    const { dias = 1 } = req.query;
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + parseInt(dias));
    
    const recordatorios = await Recordatorios.find({
      active: true,
      nextReminderDate: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    }).sort({ nextReminderDate: 1 });

    res.json({
      exito: true,
      datos: recordatorios,
      cantidad: recordatorios.length
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los recordatorios próximos',
      error: error.message
    });
  }
};

// @desc    Obtener recordatorios vencidos
// @route   GET /api/recordatorios/vencidos
exports.obtenerRecordatoriosVencidos = async (req, res) => {
  try {
    const ahora = new Date();
    
    const recordatorios = await Recordatorios.find({
      active: true,
      nextReminderDate: { $lt: ahora }
    }).sort({ nextReminderDate: 1 });

    res.json({
      exito: true,
      datos: recordatorios,
      cantidad: recordatorios.length
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener recordatorios vencidos',
      error: error.message
    });
  }
};