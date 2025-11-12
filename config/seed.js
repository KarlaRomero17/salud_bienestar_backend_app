// SALUD_BIENESTAR_BACKEND_APP/config/seed.js

const mongoose = require('mongoose');
const path = require('path');
const PlanComida = require('../models/PlanComida');

// ==============================================================================
// PASO CLAVE: Cargar las variables de entorno del archivo .env que está en la raíz
// Le decimos a dotenv que suba un nivel ('../') desde la carpeta 'config' para encontrar el archivo .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// ==============================================================================

// Aquí va la lista completa de planes de comida que te pasé antes
const planesDeComida = [
  // =================================================================
  // --- PLAN 1: AUMENTAR MASA MUSCULAR ---
  // =================================================================
  {
    nombre: "Aumento de Masa Muscular",
    descripcion: "Plan alto en proteínas y carbohidratos complejos para maximizar el crecimiento muscular y la recuperación post-entrenamiento.",
    semana: [
      {
        nombre: 'Lunes',
        comidas: [
          { hora: '08:00', descripcion: '4 huevos revueltos, 1 taza de avena con plátano y un puñado de almendras.' },
          { hora: '11:00', descripcion: 'Yogur griego alto en proteínas con miel.' },
          { hora: '14:00', descripcion: '200g de pechuga de pollo a la plancha, 1 taza de arroz integral y brócoli al vapor.' },
          { hora: '17:00', descripcion: 'Batido de proteína de suero de leche y una manzana.' },
          { hora: '20:00', descripcion: '200g de salmón al horno con quinoa y espárragos.' },
        ],
      },
      {
        nombre: 'Martes',
        comidas: [
          { hora: '08:00', descripcion: 'Tortilla de 4 claras y 1 yema con espinacas y queso feta. 2 rebanadas de pan integral.' },
          { hora: '11:00', descripcion: 'Requesón (cottage cheese) con trozos de piña.' },
          { hora: '14:00', descripcion: '180g de filete de ternera, batata asada y ensalada verde.' },
          { hora: '17:00', descripcion: 'Un puñado de nueces y un plátano.' },
          { hora: '20:00', descripcion: '200g de pechuga de pavo guisada con lentejas.' },
        ],
      },
      {
        nombre: 'Miércoles',
        comidas: [
          { hora: '08:00', descripcion: 'Tazón de avena con proteína en polvo, fresas y semillas de chía.' },
          { hora: '11:00', descripcion: 'Dos huevos duros y una naranja.' },
          { hora: '14:00', descripcion: '200g de pechuga de pollo en tiras con pimientos y cebolla, con tortillas integrales.' },
          { hora: '17:00', descripcion: 'Yogur griego y un puñado de almendras.' },
          { hora: '20:00', descripcion: '180g de atún a la plancha con cuscús y verduras al vapor.' },
        ],
      },
      {
        nombre: 'Jueves',
        comidas: [
          { hora: '08:00', descripcion: 'Batido con leche, 1 scoop de proteína, espinacas, plátano y mantequilla de cacahuete.' },
          { hora: '11:00', descripcion: 'Requesón con arándanos.' },
          { hora: '14:00', descripcion: 'Guiso de garbanzos con 180g de carne de cerdo magra y arroz.' },
          { hora: '17:00', descripcion: 'Manzana con mantequilla de almendras.' },
          { hora: '20:00', descripcion: '200g de bacalao al horno con patatas cocidas y judías verdes.' },
        ],
      },
      {
        nombre: 'Viernes',
        comidas: [
          { hora: '08:00', descripcion: 'Panqueques de avena y proteína, cubiertos con frutas del bosque.' },
          { hora: '11:00', descripcion: 'Un puñado de pistachos.' },
          { hora: '14:00', descripcion: 'Pasta integral con 180g de carne picada magra y salsa de tomate casera.' },
          { hora: '17:00', descripcion: 'Batido de proteína y un plátano.' },
          { hora: '20:00', descripcion: '200g de pechuga de pollo al curry con arroz basmati.' },
        ],
      },
      {
        nombre: 'Sábado',
        comidas: [
          { hora: '09:00', descripcion: 'Tostadas francesas hechas con pan integral, 3 huevos y canela.' },
          { hora: '12:00', descripcion: 'Yogur griego con granola casera.' },
          { hora: '15:00', descripcion: 'Hamburguesa de ternera casera en pan integral con ensalada y batata frita al horno.' },
          { hora: '18:00', descripcion: 'Un puñado de anacardos.' },
          { hora: '21:00', descripcion: 'Revuelto de huevos con sobras de carne y verduras.' },
        ],
      },
      {
        nombre: 'Domingo',
        comidas: [
          { hora: '09:00', descripcion: 'Omelette de 4 huevos con queso, jamón y pimientos.' },
          { hora: '12:00', descripcion: 'Requesón con melocotón.' },
          { hora: '15:00', descripcion: 'Comida libre con control: Lasaña de carne o similar.' },
          { hora: '18:00', descripcion: 'Batido de proteína.' },
          { hora: '21:00', descripcion: 'Pechuga de pavo a la plancha con una ensalada ligera.' },
        ],
      },
    ],
  },
  // =================================================================
  // --- PLAN 2: BAJAR DE PESO ---
  // =================================================================
  {
    nombre: "Bajar de Peso",
    descripcion: "Plan enfocado en un déficit calórico saludable, rico en fibra y proteína magra para aumentar la saciedad y mantener el músculo.",
    semana: [
      {
        nombre: 'Lunes',
        comidas: [
          { hora: '08:00', descripcion: 'Revuelto de 3 claras de huevo con espinacas. 1 rebanada de pan integral.' },
          { hora: '11:00', descripcion: 'Una manzana verde.' },
          { hora: '14:00', descripcion: 'Ensalada grande con 150g de pechuga de pavo, hojas verdes, pepino y vinagreta.' },
          { hora: '17:00', descripcion: 'Yogur natural desnatado.' },
          { hora: '20:00', descripcion: '180g de merluza al horno con espárragos trigueros.' },
        ],
      },
      {
        nombre: 'Martes',
        comidas: [
          { hora: '08:00', descripcion: 'Tazón de avena con agua, canela y fresas.' },
          { hora: '11:00', descripcion: 'Un puñado de almendras (20g).' },
          { hora: '14:00', descripcion: '150g de pechuga de pollo a la plancha con puré de coliflor.' },
          { hora: '17:00', descripcion: 'Gelatina sin azúcar.' },
          { hora: '20:00', descripcion: 'Crema de calabacín y 150g de sepia a la plancha.' },
        ],
      },
      {
        nombre: 'Miércoles',
        comidas: [
          { hora: '08:00', descripcion: 'Yogur desnatado con semillas de chía y arándanos.' },
          { hora: '11:00', descripcion: 'Una pera.' },
          { hora: '14:00', descripcion: 'Lentejas guisadas solo con verduras.' },
          { hora: '17:00', descripcion: 'Pepinillos en vinagre.' },
          { hora: '20:00', descripcion: 'Revuelto de champiñones y gambas.' },
        ],
      },
      {
        nombre: 'Jueves',
        comidas: [
          { hora: '08:00', descripcion: 'Tostada integral con tomate rallado y 50g de jamón serrano.' },
          { hora: '11:00', descripcion: 'Un kiwi.' },
          { hora: '14:00', descripcion: 'Ensalada de quinoa con pimiento, pepino, tomate y 1 lata de atún al natural.' },
          { hora: '17:00', descripcion: 'Un yogur desnatado.' },
          { hora: '20:00', descripcion: 'Sopa juliana y 180g de filete de pavo a la plancha.' },
        ],
      },
      {
        nombre: 'Viernes',
        comidas: [
          { hora: '08:00', descripcion: 'Batido de espinacas, apio, pepino y manzana verde.' },
          { hora: '11:00', descripcion: 'Un puñado de nueces (20g).' },
          { hora: '14:00', descripcion: '150g de salmón a la plancha con brócoli al vapor.' },
          { hora: '17:00', descripcion: 'Té verde y una galleta de arroz integral.' },
          { hora: '20:00', descripcion: 'Caldo de verduras y tortilla francesa de 2 claras y 1 yema.' },
        ],
      },
      {
        nombre: 'Sábado',
        comidas: [
          { hora: '09:00', descripcion: 'Café con leche desnatada y una tostada integral con aguacate.' },
          { hora: '12:00', descripcion: 'Naranja.' },
          { hora: '15:00', descripcion: 'Parrillada de verduras con un filete de ternera magra de 150g.' },
          { hora: '18:00', descripcion: 'Yogur desnatado.' },
          { hora: '21:00', descripcion: 'Gazpacho y 150g de mejillones al vapor.' },
        ],
      },
      {
        nombre: 'Domingo',
        comidas: [
          { hora: '09:00', descripcion: 'Requesón bajo en grasa con miel y canela.' },
          { hora: '12:00', descripcion: 'Un puñado de frambuesas.' },
          { hora: '15:00', descripcion: '1/4 de pollo asado (sin piel) con ensalada de guarnición.' },
          { hora: '18:00', descripcion: 'Té rojo.' },
          { hora: '21:00', descripcion: 'Crema de champiñones y un huevo duro.' },
        ],
      },
    ],
  },
  // =================================================================
  // --- PLAN 3: DIETA EQUILIBRADA ---
  // =================================================================
  {
    nombre: "Dieta Equilibrada",
    descripcion: "Un plan balanceado que incluye todos los grupos de alimentos en porciones adecuadas para un estilo de vida saludable.",
    semana: [
      {
        nombre: 'Lunes',
        comidas: [
          { hora: '08:00', descripcion: 'Tazón de avena con frutas rojas y semillas de chía.' },
          { hora: '11:00', descripcion: 'Un puñado de nueces.' },
          { hora: '14:00', descripcion: 'Potaje de lentejas con verduras y una porción pequeña de arroz.' },
          { hora: '17:00', descripcion: 'Una naranja y un yogur natural.' },
          { hora: '20:00', descripcion: 'Pollo al horno con hierbas, patata asada y ensalada de tomate.' },
        ],
      },
      {
        nombre: 'Martes',
        comidas: [
          { hora: '08:00', descripcion: 'Tostada integral con aguacate y un huevo cocido.' },
          { hora: '11:00', descripcion: 'Una manzana.' },
          { hora: '14:00', descripcion: 'Salmón a la plancha con quinoa y espárragos.' },
          { hora: '17:00', descripcion: 'Yogur natural con miel.' },
          { hora: '20:00', descripcion: 'Crema de calabaza y una tortilla de espinacas.' },
        ],
      },
      {
        nombre: 'Miércoles',
        comidas: [
          { hora: '08:00', descripcion: 'Yogur griego con granola casera y plátano.' },
          { hora: '11:00', descripcion: 'Un puñado de almendras.' },
          { hora: '14:00', descripcion: 'Guiso de garbanzos con espinacas y bacalao.' },
          { hora: '17:00', descripcion: 'Una pera.' },
          { hora: '20:00', descripcion: 'Pechuga de pavo a la plancha con ensalada mixta.' },
        ],
      },
      {
        nombre: 'Jueves',
        comidas: [
          { hora: '08:00', descripcion: 'Batido de leche con avena, plátano y canela.' },
          { hora: '11:00', descripcion: 'Una naranja.' },
          { hora: '14:00', descripcion: 'Pasta integral con pesto, tomates cherry y pollo en tiras.' },
          { hora: '17:00', descripcion: 'Un yogur y un puñado de pasas.' },
          { hora: '20:00', descripcion: 'Pescado blanco al horno con verduras variadas (calabacín, pimiento, cebolla).' },
        ],
      },
      {
        nombre: 'Viernes',
        comidas: [
          { hora: '08:00', descripcion: 'Huevos revueltos con champiñones y una tostada integral.' },
          { hora: '11:00', descripcion: 'Kiwi.' },
          { hora: '14:00', descripcion: 'Arroz integral con verduras salteadas y un filete de ternera.' },
          { hora: '17:00', descripcion: 'Un puñado de anacardos.' },
          { hora: '20:00', descripcion: 'Pizza casera con base integral, tomate, queso y vegetales.' },
        ],
      },
      {
        nombre: 'Sábado',
        comidas: [
          { hora: '09:00', descripcion: 'Tazón de yogur con muesli y fruta fresca.' },
          { hora: '12:00', descripcion: 'Una manzana.' },
          { hora: '15:00', descripcion: 'Paella de marisco o fideuá (comida social).' },
          { hora: '18:00', descripcion: 'Un trozo de chocolate negro (>70%).' },
          { hora: '21:00', descripcion: 'Ensalada César con pollo a la plancha.' },
        ],
      },
      {
        nombre: 'Domingo',
        comidas: [
          { hora: '09:00', descripcion: 'Panqueques de avena con sirope de arce y frutas.' },
          { hora: '12:00', descripcion: 'Un plátano.' },
          { hora: '15:00', descripcion: 'Lasaña de carne o verduras, acompañada de ensalada.' },
          { hora: '18:00', descripcion: 'Un té con galletas integrales.' },
          { hora: '21:00', descripcion: 'Sopa de verduras y una porción de quiche.' },
        ],
      },
    ],
  },
  // =================================================================
  // --- PLAN 4: DIETA VEGETARIANA ---
  // =================================================================
  {
    nombre: "Dieta Vegetariana",
    descripcion: "Plan 100% vegetariano, rico en nutrientes, basado en legumbres, granos enteros, frutas, verduras, semillas y grasas saludables.",
    semana: [
      {
        nombre: 'Lunes',
        comidas: [
          { hora: '08:00', descripcion: 'Tofu revuelto con cúrcuma y espinacas. Tostada integral con aguacate.' },
          { hora: '11:00', descripcion: 'Manzana con mantequilla de cacahuete.' },
          { hora: '14:00', descripcion: 'Hamburguesa de lentejas casera con ensalada y boniato al horno.' },
          { hora: '17:00', descripcion: 'Yogur de soja con arándanos.' },
          { hora: '20:00', descripcion: 'Curry de garbanzos y batata con arroz basmati integral.' },
        ],
      },
      {
        nombre: 'Martes',
        comidas: [
          { hora: '08:00', descripcion: 'Avena cocida con leche de almendras, plátano en rodajas y nueces.' },
          { hora: '11:00', descripcion: 'Un puñado de edamames al vapor.' },
          { hora: '14:00', descripcion: 'Ensalada de quinoa con frijoles negros, maíz, pimiento y aguacate.' },
          { hora: '17:00', descripcion: 'Una pera.' },
          { hora: '20:00', descripcion: 'Salteado de tempeh con brócoli, zanahoria y salsa de soja.' },
        ],
      },
      {
        nombre: 'Miércoles',
        comidas: [
          { hora: '08:00', descripcion: 'Pudding de chía preparado la noche anterior con leche de coco y mango.' },
          { hora: '11:00', descripcion: 'Un puñado de almendras.' },
          { hora: '14:00', descripcion: 'Pasta integral con pesto de aguacate y tomates secos.' },
          { hora: '17:00', descripcion: 'Yogur de coco.' },
          { hora: '20:00', descripcion: 'Sopa de lentejas rojas con un chorrito de leche de coco.' },
        ],
      },
      {
        nombre: 'Jueves',
        comidas: [
          { hora: '08:00', descripcion: 'Batido de proteína vegetal, espinacas, plátano y leche de avena.' },
          { hora: '11:00', descripcion: 'Hummus con palitos de zanahoria y pepino.' },
          { hora: '14:00', descripcion: 'Bowl de arroz integral con tofu marinado, brócoli y salsa de cacahuete.' },
          { hora: '17:00', descripcion: 'Una naranja.' },
          { hora: '20:00', descripcion: 'Berenjenas rellenas de soja texturizada y verduras.' },
        ],
      },
      {
        nombre: 'Viernes',
        comidas: [
          { hora: '08:00', descripcion: 'Tostadas integrales con champiñones salteados al ajillo.' },
          { hora: '11:00', descripcion: 'Un puñado de pistachos.' },
          { hora: '14:00', descripcion: 'Tacos con relleno de frijoles negros, lechuga, tomate y salsa.' },
          { hora: '17:00', descripcion: 'Compota de manzana sin azúcar.' },
          { hora: '20:00', descripcion: 'Pizza vegetariana casera con base de coliflor.' },
        ],
      },
      {
        nombre: 'Sábado',
        comidas: [
          { hora: '09:00', descripcion: 'Gofres de avena con fruta fresca y sirope de agave.' },
          { hora: '12:00', descripcion: 'Un plátano.' },
          { hora: '15:00', descripcion: 'Lasaña de verduras con capas de calabacín en lugar de pasta.' },
          { hora: '18:00', descripcion: 'Un trozo de chocolate negro.' },
          { hora: '21:00', descripcion: 'Heura o "pollo" vegetal a la plancha con ensalada.' },
        ],
      },
      {
        nombre: 'Domingo',
        comidas: [
          { hora: '09:00', descripcion: 'Yogur de soja con granola casera y semillas.' },
          { hora: '12:00', descripcion: 'Un melocotón.' },
          { hora: '15:00', descripcion: 'Rissotto de champiñones y espárragos.' },
          { hora: '18:00', descripcion: 'Un té chai con leche vegetal.' },
          { hora: '21:00', descripcion: 'Sopa de miso con tofu y algas.' },
        ],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('No se encontró MONGODB_URI. Asegúrate de que tu archivo .env está en la raíz del proyecto y tiene la variable definida.');
    }

    console.log('Conectando a la base de datos...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB Conectado para el script seed.');

    console.log('Eliminando planes de comida antiguos...');
    await PlanComida.deleteMany({});
    console.log('Planes de comida antiguos eliminados.');

    console.log('Insertando nuevos planes de comida...');
    await PlanComida.insertMany(planesDeComida);
    console.log('¡Base de datos poblada con los nuevos planes de comida completos!');

  } catch (error) {
    console.error('ERROR EN EL SCRIPT SEED:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
    process.exit();
  }
};

seedDatabase();