const goalService = require('../services/goalService');

class GoalController {
  // Crear nuevo objetivo
  async createGoal(req, res) {
    try {
      const { title, type, targetWeight, unit, targetDate } = req.body;
      const userId = req.user.id; // Asumiendo que tienes autenticación

      // Validaciones básicas
      if (!title || !type || !targetWeight || !targetDate) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
      }

      const goalData = {
        title,
        type,
        targetWeight: parseFloat(targetWeight),
        unit: unit || 'kg',
        targetDate: new Date(targetDate),
        userId
      };

      const goal = await goalService.createGoal(goalData);

      res.status(201).json({
        success: true,
        message: 'Objetivo creado exitosamente',
        data: goal
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener objetivos del usuario
  async getGoals(req, res) {
    try {
      const userId = req.user.id;
      const { type, isActive } = req.query;

      const filters = {};
      if (type) filters.type = type;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const goals = await goalService.getUserGoals(userId, filters);

      res.json({
        success: true,
        data: goals,
        count: goals.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener objetivo específico
  async getGoal(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const goal = await goalService.getGoalById(id, userId);

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
      }

      res.json({
        success: true,
        data: goal
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Actualizar objetivo
  async updateGoal(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Convertir tipos de datos si es necesario
      if (updateData.targetWeight) {
        updateData.targetWeight = parseFloat(updateData.targetWeight);
      }
      if (updateData.targetDate) {
        updateData.targetDate = new Date(updateData.targetDate);
      }

      const goal = await goalService.updateGoal(id, userId, updateData);

      res.json({
        success: true,
        message: 'Objetivo actualizado exitosamente',
        data: goal
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Actualizar progreso
  async updateProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userId = req.user.id;

      if (progress === undefined) {
        return res.status(400).json({
          success: false,
          message: 'El progreso es requerido'
        });
      }

      const goal = await goalService.updateProgress(id, userId, parseFloat(progress));

      res.json({
        success: true,
        message: 'Progreso actualizado exitosamente',
        data: goal
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Eliminar objetivo
  async deleteGoal(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await goalService.deleteGoal(id, userId);

      res.json({
        success: true,
        message: 'Objetivo eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtener estadísticas
  async getStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await goalService.getGoalsStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new GoalController();