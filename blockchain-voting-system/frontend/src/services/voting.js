import api from './api'

export const getCandidates = async () => {
  const response = await api.get('/candidates')
  return response.data
}

export const getCurrentElection = async () => {
  const response = await api.get('/elections/current')
  return response.data
}

export const castVote = async (voterId, candidateId, signature) => {
  const response = await api.post('/votes', { voterId, candidateId, signature })
  return response.data
}

export const getResults = async () => {
  const response = await api.get('/votes/results')
  return response.data
}