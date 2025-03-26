import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { Web3Context } from '../../contexts/Web3Context'
import { getCandidates, getCurrentElection } from '../../services/voting'
import { castVoteOnChain } from '../../services/blockchain'
import { createSignature } from '../../utils/cryptoUtils'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Modal,
  Typography
} from '@mui/material'

const VotingArea = () => {
  const { user } = useContext(AuthContext)
  const { web3, account, contract } = useContext(Web3Context)
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [election, setElection] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesData, electionData] = await Promise.all([
          getCandidates(),
          getCurrentElection()
        ])
        setCandidates(candidatesData.data)
        setElection(electionData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleVote = async () => {
    if (!selectedCandidate || !user || !contract || !account) return
    
    setIsSubmitting(true)
    try {
      // Create signature
      const voteData = `${user.voterId}-${selectedCandidate.candidateId}-${Date.now()}`
      const signature = createSignature(user.privateKey, voteData)
      
      // Submit to blockchain
      const tx = await castVoteOnChain(
        contract,
        user.voterId,
        selectedCandidate.candidateId,
        signature,
        account
      )
      
      setTxHash(tx.transactionHash)
      
      // Update backend
      await castVote(user.voterId, selectedCandidate.candidateId, signature)
      
      // Show success
      setOpenModal(true)
    } catch (error) {
      console.error('Voting error:', error)
      alert('Voting failed: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Voting Area
      </Typography>
      
      {election && (
        <Typography variant="h6" gutterBottom>
          Current Election: {election.title}
        </Typography>
      )}
      
      <Typography variant="body1" gutterBottom>
        Please select your preferred candidate:
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {candidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} key={candidate.candidateId}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedCandidate?.candidateId === candidate.candidateId 
                  ? '2px solid #3f51b5' 
                  : '2px solid transparent',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardMedia
                component="img"
                height="140"
                image={candidate.partySymbol || '/placeholder-candidate.jpg'}
                alt={candidate.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {candidate.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {candidate.party}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {candidate.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disabled={!selectedCandidate || isSubmitting}
          onClick={handleVote}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
        </Button>
      </Box>
      
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          navigate('/voting/results')
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Vote Submitted Successfully!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Your vote has been recorded on the blockchain.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, wordBreak: 'break-all' }}>
            Transaction Hash: {txHash}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => {
              setOpenModal(false)
              navigate('/voting/results')
            }}
          >
            View Results
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default VotingArea