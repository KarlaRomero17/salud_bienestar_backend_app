const Usuario = require('../models/Usuario');

// Listar todos los usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID de MongoDB
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Obtener un usuario por UID (Firebase)
const obtenerUsuarioPorUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = await Usuario.findOne({ uid });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { uid, email, token, peso_actual, altura, edad, genero } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ uid });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const nuevoUsuario = new Usuario({
      uid,
      email,
      token,
      peso_actual,
      unidad_peso: 'kg',
      altura,
      edad,
      genero,
      active: true,
      historial_peso: [],
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizacion = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      actualizacion,
      { new: true, runValidators: true }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Actualizar usuario por UID (Firebase)
const actualizarUsuarioPorUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const actualizacion = req.body;

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { uid },
      actualizacion,
      { new: true, runValidators: true }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Agregar registro al historial de peso
const agregarHistorialPeso = async (req, res) => {
  try {
    const { uid } = req.params;
    const { peso, altura, edad, genero } = req.body;

    const usuario = await Usuario.findOne({ uid });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agregar nuevo registro al historial
    usuario.historial_peso.push({
      fecha: new Date(),
      peso,
      altura: altura || usuario.altura,
      edad: edad || usuario.edad,
      genero: genero || usuario.genero,
      unidad: 'kg',
    });

    // Actualizar el peso actual
    usuario.peso_actual = peso;

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar historial de peso' });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

// Desactivar usuario (soft delete)
const desactivarUsuario = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const usuario = await Usuario.findOneAndUpdate(
      { uid },
      { active: false },
      { new: true }
    );
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario desactivado correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desactivar el usuario' });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorUid,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioPorUid,
  agregarHistorialPeso,
  eliminarUsuario,
  desactivarUsuario,
};
