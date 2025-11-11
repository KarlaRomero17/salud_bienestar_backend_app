// ✅ CORREGIR: Importar correctamente
const goalService = require('../services/goalService'); ERROR  SyntaxError: C:\Users\Lissette\Desktop\KARLA\CICLO II 2025\DAMA\PROYECTO\salud_bienestar_frontend_app\src\screens\Progress\HealthGoalsScreen.js: 'return' outside of function. (324:2)

  322 |   );
  323 |
> 324 |   return (
      |   ^
  325 |     <Layout title="Mis Objetivos">
  326 |       {loading && (
  327 |         <View style={styles.loadingContainer}>


class GoalController {
  // Crear nuevo objetivo
  async createGoal(req, res) {
    try {
      const { title, type, targetWeight, unit, targetDate, userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido'
        });
      }

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
      const { userId, type, isActive } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido en query parameters'
        });
      }

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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido en query parameters'
        });
      }

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
      const { userId, ...updateData } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido'
        });
      }

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
      const { progress, userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido'
        });
      }

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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido en query parameters'
        });
      }

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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido en query parameters'
        });
      }

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