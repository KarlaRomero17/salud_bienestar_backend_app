// controllers/statsController.js
const HealthGoals = require('../models/HealthGoals');
const User = require('../models/User');

// @desc    Obtener estadísticas generales de progreso
// @route   GET /api/stats/:userId
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el ID del usuario'
            });
        }

        // Obtener usuario con historial de peso
        const usuario = await User.findOne({ uid: userId, active: true });
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        // Obtener objetivos del usuario
        const objetivos = await HealthGoals.find({ 
            userId: userId, 
            active: true 
        });

        // Calcular estadísticas básicas
        const historialPeso = usuario.historial_peso || [];
        const totalRegistros = historialPeso.length;

        let estadisticas = {
            general: {},
            peso: {},
            objetivos: {},
            tendencias: {}
        };

        // Estadísticas de peso
        if (totalRegistros > 0) {
            const primerRegistro = historialPeso[totalRegistros - 1];
            const ultimoRegistro = historialPeso[0];
            const primerPeso = primerRegistro.peso;
            const ultimoPeso = ultimoRegistro.peso;
            const cambioPeso = ultimoPeso - primerPeso;

            estadisticas.peso = {
                actual: ultimoPeso,
                inicial: primerPeso,
                cambio: parseFloat(cambioPeso.toFixed(1)),
                unidad: usuario.unidad_peso || 'kg',
                tendencia: cambioPeso > 0 ? 'subiendo' : cambioPeso < 0 ? 'bajando' : 'estable',
                totalRegistros: totalRegistros
            };

            // Datos para gráfico de evolución (últimos 7 registros)
            const registrosRecientes = historialPeso.slice(0, 7).reverse();
            estadisticas.peso.evolucion = {
                datos: registrosRecientes.map(item => item.peso),
                fechas: registrosRecientes.map(item => 
                    new Date(item.fecha).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                    })
                ),
                registros: registrosRecientes.map(item => ({
                    fecha: item.fecha,
                    peso: item.peso,
                    grasa: item.grasa_corporal
                }))
            };
        }

        // Estadísticas de objetivos
        const totalObjetivos = objetivos.length;
        const objetivosCompletados = objetivos.filter(obj => obj.completed).length;
        const objetivosEnProgreso = totalObjetivos - objetivosCompletados;

        let progresoPromedio = 0;
        if (totalObjetivos > 0) {
            const sumaProgresos = objetivos.reduce((sum, obj) => sum + (obj.progress || 0), 0);
            progresoPromedio = parseFloat((sumaProgresos / totalObjetivos).toFixed(1));
        }

        estadisticas.objetivos = {
            total: totalObjetivos,
            completados: objetivosCompletados,
            enProgreso: objetivosEnProgreso,
            progresoPromedio: progresoPromedio,
            lista: objetivos.slice(0, 5).map(obj => ({
                _id: obj._id,
                title: obj.title,
                type: obj.type,
                progress: obj.progress || 0,
                completed: obj.completed,
                targetWeight: obj.targetWeight,
                unit: obj.unit,
                initialWeight: obj.initialWeight
            }))
        };

        // Estadísticas generales
        estadisticas.general = {
            fechaPrimerRegistro: historialPeso.length > 0 ? historialPeso[historialPeso.length - 1].fecha : null,
            fechaUltimoRegistro: historialPeso.length > 0 ? historialPeso[0].fecha : null,
            diasSeguimiento: historialPeso.length > 0 ? 
                Math.ceil((new Date() - new Date(historialPeso[historialPeso.length - 1].fecha)) / (1000 * 60 * 60 * 24)) : 0
        };

        // Tendencias
        if (historialPeso.length >= 2) {
            const pesosRecientes = historialPeso.slice(0, 3).map(item => item.peso);
            const tendenciaPeso = pesosRecientes[0] - pesosRecientes[pesosRecientes.length - 1];
            
            estadisticas.tendencias = {
                peso: parseFloat(tendenciaPeso.toFixed(1)),
                direccion: tendenciaPeso > 0 ? 'bajando' : tendenciaPeso < 0 ? 'subiendo' : 'estable',
                velocidad: parseFloat(Math.abs(tendenciaPeso).toFixed(1))
            };
        }

        res.json({
            exito: true,
            mensaje: 'Estadísticas obtenidas correctamente',
            datos: estadisticas
        });

    } catch (error) {
        console.error('Error en obtenerEstadisticas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener las estadísticas',
            error: error.message
        });
    }
};

// @desc    Obtener datos para gráfico de evolución de peso
// @route   GET /api/stats/:userId/grafico-peso
exports.obtenerGraficoPeso = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limite = 7 } = req.query;

        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el ID del usuario'
            });
        }

        const usuario = await User.findOne({ uid: userId, active: true });
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        const historialPeso = usuario.historial_peso || [];
        const registrosLimitados = historialPeso.slice(0, parseInt(limite)).reverse();

        const datosGrafico = {
            labels: registrosLimitados.map(item => 
                new Date(item.fecha).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                })
            ),
            datasets: [
                {
                    data: registrosLimitados.map(item => item.peso),
                    color: () => '#64c27b',
                    strokeWidth: 2
                }
            ],
            datosCompletos: registrosLimitados.map(item => ({
                fecha: item.fecha,
                peso: item.peso,
                grasa_corporal: item.grasa_corporal,
                fechaFormateada: new Date(item.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }))
        };

        res.json({
            exito: true,
            mensaje: 'Datos para gráfico de peso obtenidos correctamente',
            datos: datosGrafico
        });

    } catch (error) {
        console.error('Error en obtenerGraficoPeso:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener datos para gráfico de peso',
            error: error.message
        });
    }
};

// @desc    Obtener datos para gráfico de progreso de objetivos
// @route   GET /api/stats/:userId/grafico-objetivos
exports.obtenerGraficoObjetivos = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el ID del usuario'
            });
        }

        const objetivos = await HealthGoals.find({ 
            userId: userId, 
            active: true 
        }).sort({ progress: -1 });

        if (objetivos.length === 0) {
            return res.json({
                exito: true,
                mensaje: 'No hay objetivos para mostrar',
                datos: {
                    labels: [],
                    data: [],
                    objetivos: []
                }
            });
        }

        const datosGrafico = {
            labels: objetivos.map(obj => obj.title),
            data: objetivos.map(obj => (obj.progress || 0) / 100),
            colores: objetivos.map(obj => 
                obj.progress >= 100 ? '#2a8c4a' : 
                obj.progress >= 50 ? '#f39c12' : '#e74c3c'
            ),
            objetivos: objetivos.map(obj => ({
                _id: obj._id,
                title: obj.title,
                type: obj.type,
                progress: obj.progress || 0,
                completed: obj.completed,
                targetWeight: obj.targetWeight,
                initialWeight: obj.initialWeight,
                unit: obj.unit,
                color: obj.progress >= 100 ? '#2a8c4a' : 
                       obj.progress >= 50 ? '#f39c12' : '#e74c3c'
            }))
        };

        // Datos para gráfico circular de progreso promedio
        const progresoPromedio = objetivos.reduce((sum, obj) => sum + (obj.progress || 0), 0) / objetivos.length;
        
        datosGrafico.progresoPromedio = {
            valor: parseFloat(progresoPromedio.toFixed(1)),
            data: [progresoPromedio / 100],
            labels: ["Progreso General"]
        };

        res.json({
            exito: true,
            mensaje: 'Datos para gráfico de objetivos obtenidos correctamente',
            datos: datosGrafico
        });

    } catch (error) {
        console.error('Error en obtenerGraficoObjetivos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener datos para gráfico de objetivos',
            error: error.message
        });
    }
};

// @desc    Obtener resumen ejecutivo
// @route   GET /api/stats/:userId/resumen
exports.obtenerResumenEjecutivo = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el ID del usuario'
            });
        }

        const usuario = await User.findOne({ uid: userId, active: true });
        const objetivos = await HealthGoals.find({ 
            userId: userId, 
            active: true 
        });

        const historialPeso = usuario?.historial_peso || [];
        const totalObjetivos = objetivos.length;
        const objetivosCompletados = objetivos.filter(obj => obj.completed).length;

        let resumen = {
            metricas: [],
            logros: [],
            recomendaciones: []
        };

        // Métricas principales
        if (historialPeso.length > 0) {
            const primerPeso = historialPeso[historialPeso.length - 1].peso;
            const ultimoPeso = historialPeso[0].peso;
            const cambioPeso = ultimoPeso - primerPeso;

            resumen.metricas.push({
                titulo: 'Cambio de Peso',
                valor: `${cambioPeso > 0 ? '+' : ''}${parseFloat(cambioPeso.toFixed(1))}${usuario?.unidad_peso || 'kg'}`,
                icono: cambioPeso < 0 ? '📉' : cambioPeso > 0 ? '📈' : '➡️',
                tendencia: cambioPeso < 0 ? 'positiva' : cambioPeso > 0 ? 'negativa' : 'neutral'
            });
        }

        if (totalObjetivos > 0) {
            resumen.metricas.push({
                titulo: 'Objetivos Completados',
                valor: `${objetivosCompletados}/${totalObjetivos}`,
                icono: '🎯',
                tendencia: 'positiva'
            });

            const progresoPromedio = objetivos.reduce((sum, obj) => sum + (obj.progress || 0), 0) / totalObjetivos;
            resumen.metricas.push({
                titulo: 'Progreso Promedio',
                valor: `${parseFloat(progresoPromedio.toFixed(1))}%`,
                icono: '📊',
                tendencia: progresoPromedio > 50 ? 'positiva' : 'neutral'
            });
        }

        resumen.metricas.push({
            titulo: 'Registros de Peso',
            valor: `${historialPeso.length}`,
            icono: '📝',
            tendencia: 'positiva'
        });

        // Logros
        if (objetivosCompletados > 0) {
            resumen.logros.push({
                titulo: '¡Objetivos Cumplidos!',
                descripcion: `Has completado ${objetivosCompletados} objetivo${objetivosCompletados > 1 ? 's' : ''}`,
                tipo: 'exito'
            });
        }

        if (historialPeso.length >= 5) {
            resumen.logros.push({
                titulo: 'Seguimiento Constante',
                descripcion: 'Llevas 5+ registros de peso',
                tipo: 'info'
            });
        }

        // Recomendaciones
        if (historialPeso.length === 0) {
            resumen.recomendaciones.push({
                titulo: 'Comienza tu Seguimiento',
                descripcion: 'Registra tu primer peso para ver tu progreso',
                accion: 'registrar_peso'
            });
        }

        if (totalObjetivos === 0) {
            resumen.recomendaciones.push({
                titulo: 'Establece tus Metas',
                descripcion: 'Crea tu primer objetivo de salud',
                accion: 'crear_objetivo'
            });
        }

        res.json({
            exito: true,
            mensaje: 'Resumen ejecutivo obtenido correctamente',
            datos: resumen
        });

    } catch (error) {
        console.error('Error en obtenerResumenEjecutivo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener el resumen ejecutivo',
            error: error.message
        });
    }
};

exports.obtenerEstadisticasPorPeriodo = async (req, res) => {
    try {
        const { userId } = req.params;
        const { periodo = 'mensual' } = req.query;

        if (!userId) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere el ID del usuario'
            });
        }

        const usuario = await User.findOne({ uid: userId, active: true });
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        const objetivos = await HealthGoals.find({ 
            userId: userId, 
            active: true 
        });

        const historialPeso = usuario.historial_peso || [];
        
        // Filtrar historial por período
        let historialFiltrado = [...historialPeso];
        const ahora = new Date();

        switch (periodo) {
            case 'semanal':
                const unaSemanaAtras = new Date(ahora.setDate(ahora.getDate() - 7));
                historialFiltrado = historialPeso.filter(item => 
                    new Date(item.fecha) >= unaSemanaAtras
                );
                break;
                
            case 'mensual':
                const unMesAtras = new Date(ahora.setMonth(ahora.getMonth() - 1));
                historialFiltrado = historialPeso.filter(item => 
                    new Date(item.fecha) >= unMesAtras
                );
                break;
                
            case 'anual':
                const unAnioAtras = new Date(ahora.setFullYear(ahora.getFullYear() - 1));
                historialFiltrado = historialPeso.filter(item => 
                    new Date(item.fecha) >= unAnioAtras
                );
                break;
                
            default:
                // 'todos' - usar todos los registros
                break;
        }

        // Calcular estadísticas con el historial filtrado
        const totalRegistros = historialFiltrado.length;
        let estadisticas = {
            periodo: periodo,
            general: {},
            peso: {},
            objetivos: {},
            tendencias: {}
        };

        // Estadísticas de peso para el período seleccionado
        if (totalRegistros > 0) {
            const primerRegistro = historialFiltrado[historialFiltrado.length - 1];
            const ultimoRegistro = historialFiltrado[0];
            const primerPeso = primerRegistro.peso;
            const ultimoPeso = ultimoRegistro.peso;
            const cambioPeso = ultimoPeso - primerPeso;

            // Para períodos largos, limitar los puntos del gráfico
            let puntosGrafico = totalRegistros;
            if (periodo === 'anual' && totalRegistros > 12) {
                puntosGrafico = 12; // Máximo 12 puntos para año
            } else if (periodo === 'mensual' && totalRegistros > 30) {
                puntosGrafico = 30; // Máximo 30 puntos para mes
            }

            const registrosGrafico = historialFiltrado.slice(0, puntosGrafico).reverse();

            estadisticas.peso = {
                actual: ultimoPeso,
                inicial: primerPeso,
                cambio: parseFloat(cambioPeso.toFixed(1)),
                unidad: usuario.unidad_peso || 'kg',
                tendencia: cambioPeso > 0 ? 'subiendo' : cambioPeso < 0 ? 'bajando' : 'estable',
                totalRegistros: totalRegistros,
                periodo: periodo
            };

            estadisticas.peso.evolucion = {
                datos: registrosGrafico.map(item => item.peso),
                fechas: registrosGrafico.map(item => 
                    new Date(item.fecha).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: periodo === 'anual' ? 'short' : 'numeric'
                    })
                ),
                registros: registrosGrafico
            };
        } else {
            // Si no hay datos en el período, usar el último registro
            const ultimoRegistro = historialPeso[0];
            if (ultimoRegistro) {
                estadisticas.peso = {
                    actual: ultimoRegistro.peso,
                    inicial: ultimoRegistro.peso,
                    cambio: 0,
                    unidad: usuario.unidad_peso || 'kg',
                    tendencia: 'estable',
                    totalRegistros: 0,
                    periodo: periodo,
                    sinDatosPeriodo: true
                };
            }
        }

        // El resto de las estadísticas (objetivos, etc.) se mantiene igual
        const totalObjetivos = objetivos.length;
        const objetivosCompletados = objetivos.filter(obj => obj.completed).length;
        
        let progresoPromedio = 0;
        if (totalObjetivos > 0) {
            const sumaProgresos = objetivos.reduce((sum, obj) => sum + (obj.progress || 0), 0);
            progresoPromedio = parseFloat((sumaProgresos / totalObjetivos).toFixed(1));
        }

        estadisticas.objetivos = {
            total: totalObjetivos,
            completados: objetivosCompletados,
            enProgreso: totalObjetivos - objetivosCompletados,
            progresoPromedio: progresoPromedio,
            lista: objetivos.slice(0, 5).map(obj => ({
                _id: obj._id,
                title: obj.title,
                type: obj.type,
                progress: obj.progress || 0,
                completed: obj.completed,
                targetWeight: obj.targetWeight,
                unit: obj.unit,
                initialWeight: obj.initialWeight
            }))
        };

        res.json({
            exito: true,
            mensaje: `Estadísticas ${periodo} obtenidas correctamente`,
            datos: estadisticas
        });

    } catch (error) {
        console.error('Error en obtenerEstadisticasPorPeriodo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener las estadísticas',
            error: error.message
        });
    }
};