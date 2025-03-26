import api from './api'

export const registerVoter = async (voterData) => {
  const response = await api.post('/voters/register', voterData)
  return response.data
}

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const faceLogin = async (faceDescriptor) => {
  const response = await api.post('/auth/face-login', { faceDescriptor })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}