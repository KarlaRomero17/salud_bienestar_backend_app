// controllers/usersController.js
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Obtener perfil del usuario
// @route   GET /api/users/:uuid
exports.obtenerPerfil = async (req, res) => {
  try {
    const { uuid } = req.params;

    const usuario = await User.findOne({ uid: uuid, active: true })
      .select('-historial_peso -token -__v');

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      datos: usuario
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el perfil del usuario',
      error: error.message
    });
  }
};

// @desc    Registrar nuevo peso
// @route   POST /api/users/:uuid/peso
exports.registrarPeso = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      peso_actual,
      grasa_corporal,
      altura,
      edad,
      genero,
      medida_cintura,
      unidad = 'kg'
    } = req.body;

    // Validaciones
    if (!peso_actual || !altura || !edad || !genero) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Peso, altura, edad y género son campos requeridos'
      });
    }

    // Validar género
    const generosValidos = ['masculino', 'femenino'];
    if (!generosValidos.includes(genero)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Género debe ser "masculino" o "femenino"'
      });
    }

    // Validar unidad
    const unidadesValidas = ['kg', 'lb'];
    if (!unidadesValidas.includes(unidad)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Unidad debe ser "kg" o "lb"'
      });
    }

    // Buscar usuario
    const usuario = await User.findOne({ uid: uuid, active: true });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Preparar datos del registro de peso
    const pesoData = {
      peso: parseFloat(peso_actual),
      grasa_corporal: grasa_corporal ? parseFloat(grasa_corporal) : null,
      altura: parseFloat(altura),
      edad: parseInt(edad),
      genero: genero,
      medida_cintura: medida_cintura ? parseFloat(medida_cintura) : null,
      unidad: unidad
    };

    // Validar rangos
    if (pesoData.peso < 20 || pesoData.peso > 300) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El peso debe estar entre 20kg y 300kg'
      });
    }

    if (pesoData.altura < 100 || pesoData.altura > 250) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La altura debe estar entre 100cm y 250cm'
      });
    }

    if (pesoData.edad < 10 || pesoData.edad > 120) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La edad debe estar entre 10 y 120 años'
      });
    }

    if (pesoData.grasa_corporal && (pesoData.grasa_corporal < 5 || pesoData.grasa_corporal > 50)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El porcentaje de grasa debe estar entre 5% y 50%'
      });
    }

    // Agregar registro de peso
    await usuario.agregarRegistroPeso(pesoData);

    // Obtener usuario actualizado sin datos sensibles
    const usuarioActualizado = await User.findOne({ uid: uuid, active: true })
      .select('-token -__v');

    res.json({
      exito: true,
      mensaje: 'Peso registrado exitosamente',
      datos: {
        usuario: usuarioActualizado,
        registro: pesoData
      }
    });

  } catch (error) {
    console.error('Error al registrar peso:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar el peso',
      error: error.message
    });
  }
};

// @desc    Obtener historial de peso
// @route   GET /api/users/:uuid/historial-peso
exports.obtenerHistorialPeso = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { pagina = 1, limite = 20 } = req.query;

    const usuario = await User.findOne({ uid: uuid, active: true })
      .select('historial_peso unidad_peso');

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Ordenar historial por fecha descendente (más reciente primero)
    const historialOrdenado = usuario.historial_peso.sort((a, b) =>
      new Date(b.fecha) - new Date(a.fecha)
    );

    // Paginación
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const fin = inicio + limiteNum;

    const historialPaginado = historialOrdenado.slice(inicio, fin);
    const totalRegistros = usuario.historial_peso.length;
    const totalPaginas = Math.ceil(totalRegistros / limiteNum);

    res.json({
      exito: true,
      datos: historialPaginado,
      paginacion: {
        paginaActual: paginaNum,
        totalPaginas: totalPaginas,
        totalRegistros: totalRegistros,
        limite: limiteNum,
        tieneSiguientePagina: paginaNum < totalPaginas,
        tienePaginaAnterior: paginaNum > 1
      },
      unidad: usuario.unidad_peso
    });

  } catch (error) {
    console.error('Error al obtener historial de peso:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el historial de peso',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas de peso
// @route   GET /api/users/:uuid/estadisticas-peso
exports.obtenerEstadisticasPeso = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { dias = 30 } = req.query;

    const usuario = await User.findOne({ uid: uuid, active: true })
      .select('historial_peso peso_actual unidad_peso');

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    if (usuario.historial_peso.length === 0) {
      return res.json({
        exito: true,
        datos: {
          mensaje: 'No hay suficientes datos para generar estadísticas',
          totalRegistros: 0
        }
      });
    }

    // Filtrar registros de los últimos N días
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(dias));

    const registrosRecientes = usuario.historial_peso.filter(registro =>
      new Date(registro.fecha) >= fechaLimite
    );

    if (registrosRecientes.length === 0) {
      return res.json({
        exito: true,
        datos: {
          mensaje: 'No hay registros en el período seleccionado',
          totalRegistros: 0,
          dias: parseInt(dias)
        }
      });
    }

    // Calcular estadísticas
    const pesos = registrosRecientes.map(r => r.peso);
    const grasas = registrosRecientes.map(r => r.grasa_corporal).filter(g => g);

    const estadisticas = {
      totalRegistros: registrosRecientes.length,
      dias: parseInt(dias),
      peso: {
        actual: usuario.peso_actual,
        promedio: pesos.reduce((a, b) => a + b, 0) / pesos.length,
        maximo: Math.max(...pesos),
        minimo: Math.min(...pesos),
        cambio: pesos.length > 1 ? pesos[0] - pesos[pesos.length - 1] : 0
      }
    };

    // Estadísticas de grasa corporal si hay datos
    if (grasas.length > 0) {
      estadisticas.grasa_corporal = {
        actual: registrosRecientes[0].grasa_corporal,
        promedio: grasas.reduce((a, b) => a + b, 0) / grasas.length,
        maximo: Math.max(...grasas),
        minimo: Math.min(...grasas)
      };
    }

    // Tendencia
    if (pesos.length >= 2) {
      const primerPeso = pesos[pesos.length - 1];
      const ultimoPeso = pesos[0];
      estadisticas.tendencia = ultimoPeso < primerPeso ? 'bajando' :
        ultimoPeso > primerPeso ? 'subiendo' : 'estable';
    }

    res.json({
      exito: true,
      datos: estadisticas
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener las estadísticas',
      error: error.message
    });
  }
};

// @desc    Crear usuario (para testing/registro)
// @route   POST /api/users
exports.crearUsuario = async (req, res) => {
  try {
    const { email, token, peso_actual, altura, edad, genero, unidad_peso = 'kg' } = req.body;

    // Validaciones
    if (!email || !token) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Email y token son campos requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({
      $or: [{ email }, { token }]
    });

    if (usuarioExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const usuario = new User({
      uuid: uuidv4(),
      email,
      token,
      peso_actual: peso_actual ? parseFloat(peso_actual) : null,
      altura: altura ? parseFloat(altura) : null,
      edad: edad ? parseInt(edad) : null,
      genero: genero || null,
      unidad_peso
    });

    // Si hay peso inicial, agregarlo al historial
    if (peso_actual) {
      usuario.historial_peso.push({
        fecha: new Date(),
        peso: parseFloat(peso_actual),
        altura: altura ? parseFloat(altura) : null,
        edad: edad ? parseInt(edad) : null,
        genero: genero || null,
        unidad: unidad_peso
      });
    }

    await usuario.save();

    // No enviar token en la respuesta
    const usuarioResponse = usuario.toObject();
    delete usuarioResponse.token;
    delete usuarioResponse.__v;

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario creado exitosamente',
      datos: usuarioResponse
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear el usuario',
      error: error.message
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/:uuid
exports.actualizarPerfil = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { altura, edad, genero, unidad_peso } = req.body;

    const usuario = await User.findOne({ uid: uuid, active: true });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (altura !== undefined) usuario.altura = parseFloat(altura);
    if (edad !== undefined) usuario.edad = parseInt(edad);
    if (genero !== undefined) usuario.genero = genero;
    if (unidad_peso !== undefined) usuario.unidad_peso = unidad_peso;

    await usuario.save();

    // No enviar datos sensibles
    const usuarioActualizado = usuario.toObject();
    delete usuarioActualizado.token;
    delete usuarioActualizado.__v;
    delete usuarioActualizado.historial_peso;

    res.json({
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      datos: usuarioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

// @desc    Eliminar registro específico del historial de peso
// @route   DELETE /api/users/:uuid/historial-peso/:registroId
exports.eliminarRegistroPeso = async (req, res) => {
  try {
    const { uuid, registroId } = req.params;

    const usuario = await User.findOne({ uid: uuid, active: true });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Encontrar el índice del registro
    const registroIndex = usuario.historial_peso.findIndex(
      registro => registro._id.toString() === registroId
    );

    if (registroIndex === -1) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Registro no encontrado'
      });
    }

    // Eliminar el registro
    usuario.historial_peso.splice(registroIndex, 1);

    // Si era el registro más reciente, actualizar peso_actual
    if (registroIndex === 0 && usuario.historial_peso.length > 0) {
      usuario.peso_actual = usuario.historial_peso[0].peso;
    } else if (usuario.historial_peso.length === 0) {
      usuario.peso_actual = null;
    }

    await usuario.save();

    res.json({
      exito: true,
      mensaje: 'Registro eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar el registro',
      error: error.message
    });
  }


};