const { GraphQLScalarType, Kind } = require('graphql');
const Harvest = require('../models/Harvest');
const Productivity = require('../models/Productivity');
const SensorData = require('../models/SensorData');
const Report = require('../models/Report');
const { publishToQueue } = require('../rabbitmq');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // valor vindo do cliente
  },
  serialize(value) {
    return value.toISOString(); // valor enviado ao cliente
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

module.exports = {
  Date: dateScalar,

  Query: {
    // Harvest
    harvests: async () => await Harvest.find(),
    harvest: async (_parent, { id }) => await Harvest.findById(id),

    // Productivity
    productivities: async () => await Productivity.find(),
    productivity: async (_parent, { id }) => await Productivity.findById(id),

    // SensorData
    sensorData: async () => await SensorData.find(),
    sensorDatum: async (_parent, { id }) => await SensorData.findById(id),

    // Reports
    reports: async () => await Report.find(),
    report: async (_parent, { id }) => await Report.findById(id),
  },

  Mutation: {
    // Harvest
    createHarvest: async (_parent, { input }) => {
  const harvest = new Harvest({
    orchardId: input.orchardId,
    date: input.date,
    quantityKg: input.quantityKg,
    notes: input.notes || '',
  });

  const savedHarvest = await harvest.save();

  // --- salvar produtividade automaticamente ---
  // const orchard = await Orchard.findById(input.orchardId);
  // const totalTrees = orchard.totalTrees;
  const totalTrees = 100; // Valor fixo temporário. Ideal: buscar do model Orchard
  const productivity = new Productivity({
    orchardId: input.orchardId,
    date: input.date,
    totalTrees,
    KgPerTree: input.quantityKg / totalTrees,
  });

  await productivity.save();

  return savedHarvest;
},
    updateHarvest: async (_parent, { id, input }) =>
      await Harvest.findByIdAndUpdate(
        id,
        {
          orchardId: input.orchardId,
          date: input.date,
          quantityKg: input.quantityKg,
          notes: input.notes || '',
        },
        { new: true }
      ),
    deleteHarvest: async (_parent, { id }) => {
      await Harvest.findByIdAndDelete(id);
      return true;
    },

    // Productivity
    createProductivity: async (_parent, { input }) => {
      const prod = new Productivity({
        orchardId: input.orchardId,
        date: input.date,
        KgPerTree: input.KgPerTree,
        totalTrees: input.totalTrees,
      });
      return await prod.save();
    },
    updateProductivity: async (_parent, { id, input }) =>
      await Productivity.findByIdAndUpdate(
        id,
        {
          orchardId: input.orchardId,
          date: input.date,
          KgPerTree: input.KgPerTree,
          totalTrees: input.totalTrees,
        },
        { new: true }
      ),
    deleteProductivity: async (_parent, { id }) => {
      await Productivity.findByIdAndDelete(id);
      return true;
    },

    // SensorData
    createSensorData: async (_parent, { input }) => {
      const sd = new SensorData({
        orchardId: input.orchardId,
        timestamp: input.timestamp || Date.now(),
        temperature: input.temperature,
        humidity: input.humidity,
        soilMoisture: input.soilMoisture,
      });
      return await sd.save();
    },
    updateSensorData: async (_parent, { id, input }) =>
      await SensorData.findByIdAndUpdate(
        id,
        {
          orchardId: input.orchardId,
          timestamp: input.timestamp || Date.now(),
          temperature: input.temperature,
          humidity: input.humidity,
          soilMoisture: input.soilMoisture,
        },
        { new: true }
      ),
    deleteSensorData: async (_parent, { id }) => {
      await SensorData.findByIdAndDelete(id);
      return true;
    },

    // Reports
    createReport: async (_parent, { input }) => {
      const reportData = {
        generatedAt: input.generatedAt || new Date().toISOString(),
        content: input.content,
      };
      publishToQueue('reports_queue', reportData);
      // Retorna um ID temporário ou um objeto de sucesso, já que o salvamento é assíncrono
      return { id: 'temp-id', ...reportData };
    },
    updateReport: async (_parent, { id, input }) =>
      await Report.findByIdAndUpdate(
        id,
        {
          generatedAt: input.generatedAt || Date.now(),
          content: input.content,
        },
        { new: true }
      ),
    deleteReport: async (_parent, { id }) => {
      await Report.findByIdAndDelete(id);
      return true;
    },
  },
};
