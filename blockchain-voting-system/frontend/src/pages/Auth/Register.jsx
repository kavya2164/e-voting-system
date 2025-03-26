import { useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { registerVoter } from '../../services/auth'
import { faceRecognition } from '../../utils/faceRecognition'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import Webcam from 'react-webcam'

const Register = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const [faceDescriptor, setFaceDescriptor] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [step, setStep] = useState(1)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    dob: Yup.date().required('Date of birth is required'),
    aadharNumber: Yup.string()
      .length(12, 'Aadhar number must be 12 digits')
      .required('Aadhar number is required')
  })

  const captureFace = async () => {
    setIsCapturing(true)
    try {
      const imageSrc = webcamRef.current.getScreenshot()
      const descriptor = await faceRecognition.getFaceDescriptor(imageSrc)
      setFaceDescriptor(descriptor)
      setStep(2)
    } catch (error) {
      console.error('Face capture error:', error)
      alert('Face capture failed. Please try again.')
    } finally {
      setIsCapturing(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const voterData = {
        ...values,
        faceDescriptor: JSON.stringify(faceDescriptor),
        photo: '', // You would upload this to IPFS or your server
        aadharPhoto: '' // Same as above
      }
      
      const { token } = await registerVoter(voterData)
      login(token)
      navigate('/voting')
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ width: '100%', maxWidth: 800 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Voter Registration
          </Typography>
          
          {step === 1 && (
            <>
              <Typography variant="body1" gutterBottom>
                Step 1: Face Verification
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'user' }}
                  width="100%"
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={captureFace}
                disabled={isCapturing}
                startIcon={isCapturing ? <CircularProgress size={20} /> : null}
              >
                {isCapturing ? 'Capturing...' : 'Capture Face'}
              </Button>
            </>
          )}
          
          {step === 2 && (
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                dob: '',
                aadharNumber: '',
                gender: 'Male'
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Typography variant="body1" gutterBottom>
                    Step 2: Personal Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="name"
                        label="Full Name"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="name" component="div" />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="email" component="div" />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="password" component="div" />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="confirmPassword" component="div" />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="dob"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                      <ErrorMessage name="dob" component="div" />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="aadharNumber"
                        label="Aadhar Number"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="aadharNumber" component="div" />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      >
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register