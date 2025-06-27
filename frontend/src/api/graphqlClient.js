import { request, gql } from 'graphql-request';

// URL da API GraphQL
const API_URL = 'http://localhost:4000/graphql';

/**
 * Função reutilizável para requisições GraphQL com token fake.
 * @param {string} query A query/mutation GraphQL
 * @param {object} variables Variáveis da requisição (opcional)
 * @returns {Promise<object>} Resultado da API
 */
export async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem('token') || 'fake-token-123'; // token fake

  return await request(API_URL, query, variables, {
    Authorization: `Bearer ${token}`,
  });
}
