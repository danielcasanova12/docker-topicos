const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  # ----- TYPE DEFINITIONS -----
  type Harvest {
    id: ID!
    orchardId: ID!
    date: Date!
    quantityKg: Float!
    notes: String
    createdAt: Date
    updatedAt: Date
  }

  type Productivity {
    id: ID!
    orchardId: ID!
    date: Date!
    KgPerTree: Float!
    totalTrees: Int!
    createdAt: Date
    updatedAt: Date
  }

  type SensorData {
    id: ID!
    orchardId: ID!
    timestamp: Date!
    temperature: Float
    humidity: Float
    soilMoisture: Float
    createdAt: Date
    updatedAt: Date
  }

  type Report {
    id: ID!
    generatedAt: Date!
    content: String!
    createdAt: Date
    updatedAt: Date
  }

  # ----- INPUT TYPES (para mutações) -----
  input HarvestInput {
    orchardId: ID!
    date: Date!
    quantityKg: Float!
    notes: String
  }

  input ProductivityInput {
    orchardId: ID!
    date: Date!
    KgPerTree: Float!
    totalTrees: Int!
  }

  input SensorDataInput {
    orchardId: ID!
    timestamp: Date
    temperature: Float
    humidity: Float
    soilMoisture: Float
  }

  input ReportInput {
    generatedAt: Date
    content: String!
  }

  # ----- QUERY & MUTATION -----
  type Query {
    harvests: [Harvest!]!
    harvest(id: ID!): Harvest

    productivities: [Productivity!]!
    productivity(id: ID!): Productivity

    sensorData: [SensorData!]!
    sensorDatum(id: ID!): SensorData

    reports: [Report!]!
    report(id: ID!): Report
  }

  type Mutation {
    createHarvest(input: HarvestInput!): Harvest!
    updateHarvest(id: ID!, input: HarvestInput!): Harvest!
    deleteHarvest(id: ID!): Boolean!

    createProductivity(input: ProductivityInput!): Productivity!
    updateProductivity(id: ID!, input: ProductivityInput!): Productivity!
    deleteProductivity(id: ID!): Boolean!

    createSensorData(input: SensorDataInput!): SensorData!
    updateSensorData(id: ID!, input: SensorDataInput!): SensorData!
    deleteSensorData(id: ID!): Boolean!

    createReport(input: ReportInput!): Report!
    updateReport(id: ID!, input: ReportInput!): Report!
    deleteReport(id: ID!): Boolean!
  }
`;
