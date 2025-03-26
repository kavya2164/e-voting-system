import * as faceapi from 'face-api.js'

let modelsLoaded = false

export const loadModels = async () => {
  if (modelsLoaded) return true
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ])
    modelsLoaded = true
    return true
  } catch (error) {
    console.error('Error loading face models:', error)
    return false
  }
}

export const getFaceDescriptor = async (imageSrc) => {
  const loaded = await loadModels()
  if (!loaded) throw new Error('Face models not loaded')
  
  const img = await faceapi.fetchImage(imageSrc)
  const detections = await faceapi
    .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors()
  
  if (detections.length === 0) {
    throw new Error('No faces detected')
  }
  
  if (detections.length > 1) {
    throw new Error('Multiple faces detected')
  }
  
  return detections[0].descriptor
}

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2)
  return distance < threshold
}