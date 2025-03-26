import crypto from 'crypto-js'

export const generateKeyPair = () => {
  // In a real app, use proper cryptographic libraries
  const privateKey = crypto.lib.WordArray.random(32).toString()
  const publicKey = crypto.SHA256(privateKey).toString()
  return { privateKey, publicKey }
}

export const createSignature = (privateKey, data) => {
  // In a real app, use proper cryptographic signing
  return crypto.HmacSHA256(data, privateKey).toString()
}

export const verifySignature = (publicKey, signature, data) => {
  // In a real app, use proper cryptographic verification
  const expectedSignature = crypto.HmacSHA256(data, publicKey).toString()
  return expectedSignature === signature
}

export const encryptData = (data, key) => {
  return crypto.AES.encrypt(JSON.stringify(data), key).toString()
}

export const decryptData = (ciphertext, key) => {
  const bytes = crypto.AES.decrypt(ciphertext, key)
  return JSON.parse(bytes.toString(crypto.enc.Utf8))
}