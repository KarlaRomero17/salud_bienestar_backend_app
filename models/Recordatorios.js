const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: false,
    trim: true
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  days: [{
    type: String,
    enum: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  }],
  active: {
    type: Boolean,
    default: true
  },
  nextReminderDate: {
    type: Date,
    required: true
  },
  lastTaken: {
    type: Date
  },
  history: [{
    takenAt: Date,
    wasOnTime: Boolean
  }],
  timezone: {
    type: String,
    default: 'UTC'
  }
}, {
  timestamps: true
});

// Calcular próxima fecha al guardar
reminderSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('days') || this.isModified('time')) {
    this.nextReminderDate = this.calculateNextReminder();
  }
  next();
});

// Método para calcular próxima fecha
reminderSchema.methods.calculateNextReminder = function() {
  const daysMap = {
    'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4, 
    'Vie': 5, 'Sáb': 6, 'Dom': 0
  };
  
  const today = new Date();
  const [hours, minutes] = this.time.split(':').map(Number);
  
  // Buscar el próximo día que coincida
  for (let i = 0; i <= 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][nextDate.getDay()];
    
    if (this.days.includes(dayName)) {
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

// Método para avanzar al próximo recordatorio
reminderSchema.methods.advanceToNextReminder = function() {
  this.nextReminderDate = this.calculateNextReminder();
  return this.save();
};

module.exports = mongoose.model('Recordatorios', reminderSchema);