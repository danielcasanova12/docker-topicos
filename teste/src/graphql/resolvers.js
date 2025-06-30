const { GraphQLScalarType, Kind } = require('graphql');
const Harvest = require('../models/Harvest');
const Productivity = require('../models/Productivity');
const SensorData = require('../models/SensorData');
const Report = require('../models/Report');
const { getChannel } = require('../rabbitmq');

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
    reports: async () => {
      return await Report.find();
    },
    report: async (_parent, { id }) => await Report.findById(id),
  },

  Mutation: {
    // Harvest
    createHarvest: async (_parent, { input }) => {
      console.log('Mutação createHarvest recebida com input:', input);
      const harvest = new Harvest({
        orchardId: input.orchardId,
        date: input.date,
        quantityKg: input.quantityKg,
        notes: input.notes || '',
      });

      const savedHarvest = await harvest.save();

      // --- salvar produtividade automaticamente ---
      const totalTrees = 100; // Valor fixo temporário. Ideal: buscar do model Orchard
      const productivity = new Productivity({
        orchardId: input.orchardId,
        date: input.date,
        totalTrees,
        KgPerTree: input.quantityKg / totalTrees,
      });

      await productivity.save();

      // Enviar relatório de colheita para a api1 via RabbitMQ
      const reportContent = `Nova colheita registrada para o pomar ${input.orchardId}: ${input.quantityKg} Kg em ${input.date.toISOString().split('T')[0]}.`;
      const reportMessage = {
        generatedAt: new Date().toISOString(),
        content: reportContent,
      };
      const channel = getChannel();
      if (channel) {
        channel.sendToQueue('report_queue', Buffer.from(JSON.stringify(reportMessage)), { persistent: true });
        console.log('Relatório de colheita enviado para a fila.');
      } else {
        console.error('Canal RabbitMQ não disponível para enviar relatório de colheita.');
      }

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
      const orchardId =
        input.orchardId !== undefined && input.orchardId !== ''
          ? parseInt(input.orchardId, 10)
          : undefined;
      const rpt = new Report({
        orchardId,
        generatedAt: input.generatedAt || Date.now(),
        content: input.content,
      });
      const saved = await rpt.save();

      const channel = getChannel();
      if (channel) {
        channel.sendToQueue(
          'report_queue',
          Buffer.from(
            JSON.stringify({
              orchardId: saved.orchardId,
              generatedAt: saved.generatedAt,
              content: saved.content,
            })
          ),
          { persistent: true }
        );
        console.log('Relatório enviado para a fila.');
      } else {
        console.error('Canal RabbitMQ não disponível para enviar relatório.');
      }

      return saved;
    },
    updateReport: async (_parent, { id, input }) => {
      const orchardId =
        input.orchardId !== undefined && input.orchardId !== ''
          ? parseInt(input.orchardId, 10)
          : undefined;
      return await Report.findByIdAndUpdate(
        id,
        {
          orchardId,
          generatedAt: input.generatedAt || Date.now(),
          content: input.content,
        },
        { new: true }
      );
    },
    deleteReport: async (_parent, { id }) => {
      await Report.findByIdAndDelete(id);
      return true;
    },

    sendMessage: (_parent, { message }) => {
      const channel = getChannel();
      const queue = 'task_queue';
      channel.sendToQueue(queue, Buffer.from(message));
      return `Mensagem "${message}" enviada para a fila "${queue}"`;
    },
  },
};
