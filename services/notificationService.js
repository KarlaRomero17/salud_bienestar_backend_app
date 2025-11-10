const { Expo } = require('expo-server-sdk');
const cron = require('node-cron');
const Recordatorios = require('../models/Recordatorios');

const expo = new Expo();

// Almacén para tokens de usuarios
const userTokens = new Map();

class NotificationService {
    constructor() {
        this.initScheduler();
        console.log('🚀 Servicio de Notificaciones Iniciado');
    }

    // Registrar token/usuario para notificaciones
    registerUserToken(userId, token) {
    try {
        // EN DESARROLLO: Aceptar cualquier token, incluso de Expo Go
        if (token && typeof token === 'string') {
            if (!userTokens.has(userId)) {
                userTokens.set(userId, new Set());
            }
            
            userTokens.get(userId).add(token);
            console.log(`✅ Token registrado para usuario ${userId}:`, {
                token: token.substring(0, 30) + '...',
                totalTokens: userTokens.get(userId).size
            });
            return true;
        }
        
        console.log('❌ Token inválido:', token);
        return false;
    } catch (error) {
        console.error('❌ Error registrando token:', error);
        return false;
    }
}

// Modificar sendPushNotification para desarrollo
async sendPushNotification(token, title, body, data = {}) {
    try {
        // EN DESARROLLO: Simular éxito siempre
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
            console.log('🧪 MODO DESARROLLO - Simulando notificación:', {
                title,
                body,
                token: token ? token.substring(0, 20) + '...' : 'no-token',
                data
            });
            
            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }

        // Código original para producción...
        if (!Expo.isExpoPushToken(token)) {
            console.log('⚠️ Token no es de Expo:', token.substring(0, 20) + '...');
            return false;
        }

        const message = {
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            priority: 'high'
        };

        console.log('📤 Enviando notificación real:', { 
            title, 
            body, 
            token: token.substring(0, 20) + '...' 
        });

        const receipts = await expo.sendPushNotificationsAsync([message]);
        console.log('✅ Notificación enviada, receipt:', receipts);
        
        return receipts[0]?.status === 'ok';
    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
        return false;
    }
}

    // Enviar notificación a todos los dispositivos de un usuario
    async sendNotificationToUser(userId, title, body, data = {}) {
        if (!userTokens.has(userId) || userTokens.get(userId).size === 0) {
            console.log(`⚠️ Usuario ${userId} no tiene dispositivos registrados`);
            return false;
        }

        const tokens = Array.from(userTokens.get(userId));
        console.log(`📨 Enviando a ${tokens.length} dispositivos del usuario ${userId}`);

        let successCount = 0;
        for (const token of tokens) {
            try {
                const success = await this.sendPushNotification(token, title, body, data);
                if (success) {
                    successCount++;
                    console.log(`✅ Enviado a: ${token.substring(0, 20)}...`);
                }
            } catch (error) {
                console.error(`❌ Error enviando a dispositivo:`, error);
            }
        }
        
        console.log(`📊 Resultado: ${successCount}/${tokens.length} notificaciones enviadas`);
        return successCount > 0;
    }

    // Verificar recordatorios pendientes - EJECUTADO CADA MINUTO
    async checkPendingReminders() {
        try {
            const ahora = new Date();
            console.log('⏰ Buscando recordatorios para:', ahora.toLocaleTimeString());
            
            // Buscar recordatorios que deben dispararse ahora (± 2 minutos)
            const inicioRango = new Date(ahora.getTime() - 120000);
            const finRango = new Date(ahora.getTime() + 120000);

            const recordatoriosPendientes = await Recordatorios.find({
                active: true,
                nextReminderDate: {
                    $gte: inicioRango,
                    $lte: finRango
                }
            });

            console.log(`📋 ${recordatoriosPendientes.length} recordatorios pendientes`);

            for (const recordatorio of recordatoriosPendientes) {
                console.log('🔔 Procesando:', recordatorio.name, 'para:', recordatorio.nextReminderDate);
                await this.sendReminderNotification(recordatorio);
            }

            return recordatoriosPendientes.length;
        } catch (error) {
            console.error('❌ Error verificando recordatorios:', error);
            return 0;
        }
    }

    // Enviar notificación de recordatorio
    async sendReminderNotification(recordatorio) {
        const title = '💊 Recordatorio de Medicamento';
        const body = `Es hora de tomar ${recordatorio.name} - ${recordatorio.dosage}`;
        
        const data = {
            type: 'MEDICATION_REMINDER',
            recordatorioId: recordatorio._id.toString(),
            name: recordatorio.name,
            dosage: recordatorio.dosage,
            time: recordatorio.time
        };

        console.log(`🔔 Enviando recordatorio: "${recordatorio.name}" para usuario: ${recordatorio.userId}`);

        const success = await this.sendNotificationToUser(
            recordatorio.userId, 
            title, 
            body, 
            data
        );

        if (success) {
            console.log(`✅ Notificación enviada para: ${recordatorio.name}`);
            
            // Avanzar al próximo recordatorio
            try {
                if (typeof recordatorio.advanceToNextReminder === 'function') {
                    await recordatorio.advanceToNextReminder();
                    await recordatorio.save();
                    console.log(`📅 Próximo recordatorio: ${recordatorio.nextReminderDate}`);
                }
            } catch (error) {
                console.error('❌ Error avanzando recordatorio:', error);
            }
        } else {
            console.log(`❌ Falló el envío para: ${recordatorio.name}`);
        }

        return success;
    }

    // Enviar notificación de prueba
    async sendTestNotification(userId) {
        const title = '🧪 Prueba de Notificación';
        const body = '¡Esta es una notificación de prueba de tu app de recordatorios!';
        
        const data = {
            type: 'TEST_NOTIFICATION',
            timestamp: new Date().toISOString(),
            message: 'Notificación de prueba exitosa'
        };

        console.log(`🧪 Enviando notificación de prueba para usuario: ${userId}`);

        const success = await this.sendNotificationToUser(userId, title, body, data);
        
        if (success) {
            console.log('✅ Notificación de prueba enviada exitosamente');
        } else {
            console.log('❌ Falló el envío de notificación de prueba');
        }

        return success;
    }

    // Inicializar scheduler que verifica CADA MINUTO
    initScheduler() {
        // Ejecutar cada minuto
        cron.schedule('* * * * *', async () => {
            console.log('🔍 Verificando recordatorios...', new Date().toLocaleTimeString());
            const count = await this.checkPendingReminders();
            if (count > 0) {
                console.log(`✅ ${count} recordatorios procesados`);
            }
        });

        console.log('⏰ Scheduler iniciado - Verificando cada minuto');
    }

    // Obtener estadísticas
    getStats() {
        const stats = {
            totalUsers: userTokens.size,
            totalDevices: 0,
            users: {}
        };
        
        for (const [userId, tokens] of userTokens.entries()) {
            stats.totalDevices += tokens.size;
            stats.users[userId] = {
                devices: Array.from(tokens),
                count: tokens.size
            };
        }
        
        return stats;
    }
}

module.exports = new NotificationService();