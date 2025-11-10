const Goal = require('../models/Goal');

class GoalService {
  // Crear nuevo objetivo
  async createGoal(goalData) {
    try {
      const goal = new Goal(goalData);
      return await goal.save();
    } catch (error) {
      throw new Error(`Error al crear objetivo: ${error.message}`);
    }
  }

  // Obtener todos los objetivos de un usuario
  async getUserGoals(userId, filters = {}) {
    try {
      const query = { userId, isActive: true };
      
      // Aplicar filtros si existen
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      return await Goal.find(query)
        .sort({ targetDate: 1, createdAt: -1 })
        .lean();
    } catch (error) {
      throw new Error(`Error al obtener objetivos: ${error.message}`);
    }
  }

  // Obtener objetivo por ID
  async getGoalById(goalId, userId) {
    try {
      return await Goal.findOne({ _id: goalId, userId });
    } catch (error) {
      throw new Error(`Error al obtener objetivo: ${error.message}`);
    }
  }

  // Actualizar objetivo
  async updateGoal(goalId, userId, updateData) {
    try {
      // No permitir actualizar campos sensibles
      const { userId: _, _id: __, ...safeUpdateData } = updateData;

      const goal = await Goal.findOneAndUpdate(
        { _id: goalId, userId },
        { $set: safeUpdateData },
        { new: true, runValidators: true }
      );

      if (!goal) {
        throw new Error('Objetivo no encontrado');
      }

      return goal;
    } catch (error) {
      throw new Error(`Error al actualizar objetivo: ${error.message}`);
    }
  }

  // Actualizar progreso
  async updateProgress(goalId, userId, progress) {
    try {
      // Validar que el progreso esté entre 0 y 100
      if (progress < 0 || progress > 100) {
        throw new Error('El progreso debe estar entre 0 y 100');
      }

      const goal = await Goal.findOneAndUpdate(
        { _id: goalId, userId },
        { $set: { progress } },
        { new: true, runValidators: true }
      );

      if (!goal) {
        throw new Error('Objetivo no encontrado');
      }

      return goal;
    } catch (error) {
      throw new Error(`Error al actualizar progreso: ${error.message}`);
    }
  }

  // Eliminar objetivo (soft delete)
  async deleteGoal(goalId, userId) {
    try {
      const goal = await Goal.findOneAndUpdate(
        { _id: goalId, userId },
        { $set: { isActive: false } },
        { new: true }
      );

      if (!goal) {
        throw new Error('Objetivo no encontrado');
      }

      return goal;
    } catch (error) {
      throw new Error(`Error al eliminar objetivo: ${error.message}`);
    }
  }

  // Obtener estadísticas de objetivos
  async getGoalsStats(userId) {
    try {
      const stats = await Goal.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), isActive: true } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgProgress: { $avg: '$progress' },
            totalTargetWeight: { $sum: '$targetWeight' }
          }
        }
      ]);

      const totalGoals = await Goal.countDocuments({ userId, isActive: true });
      const completedGoals = await Goal.countDocuments({ 
        userId, 
        isActive: true, 
        progress: 100 
      });

      return {
        totalGoals,
        completedGoals,
        completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
        byType: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = new GoalService();