import { useState, useEffect, useContext } from 'react'
import { Web3Context } from '../../contexts/Web3Context'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography
} from '@mui/material'
import { Block as BlockIcon, AccountBalanceWallet as WalletIcon } from '@mui/icons-material'

const BlockchainInfo = () => {
  const { web3, account, chainId, isConnected, connectWallet, disconnectWallet } = useContext(Web3Context)
  const [blockNumber, setBlockNumber] = useState(0)
  const [networkName, setNetworkName] = useState('Unknown')
  const [contractBalance, setContractBalance] = useState('0')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!web3) {
        setLoading(false)
        return
      }
      
      try {
        const blockNum = await web3.eth.getBlockNumber()
        setBlockNumber(blockNum)
        
        // Get network name
        const networkId = await web3.eth.net.getId()
        const networks = {
          1: 'Ethereum Mainnet',
          5: 'Goerli Testnet',
          137: 'Polygon Mainnet',
          80001: 'Mumbai Testnet',
          1337: 'Local Dev Chain'
        }
        setNetworkName(networks[networkId] || `Network ID: ${networkId}`)
        
        // Get contract balance (example)
        const balance = await web3.eth.getBalance(CONTRACT_ADDRESS)
        setContractBalance(web3.utils.fromWei(balance, 'ether'))
      } catch (error) {
        console.error('Error fetching blockchain data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlockchainData()
    
    // Set up block number subscription
    const subscription = web3?.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
      if (!error) {
        setBlockNumber(blockHeader.number)
      }
    })
    
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [web3])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blockchain Information
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Wallet Connection
              </Typography>
              
              {isConnected ? (
                <>
                  <Typography variant="body1">
                    <strong>Status:</strong> <Chip label="Connected" color="success" size="small" />
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Account:</strong> {account}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Network:</strong> {networkName} (Chain ID: {chainId})
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Connect your wallet to interact with the blockchain
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WalletIcon />}
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Status
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Typography variant="body1">
                    <strong>Connected to:</strong> {networkName}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Current Block:</strong> {blockNumber.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Node Status:</strong> <Chip label="Connected" color="success" size="small" />
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Smart Contract
              </Typography>
              
              <Typography variant="body1">
                <strong>Contract Address:</strong> {CONTRACT_ADDRESS}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Contract Balance:</strong> {contractBalance} ETH
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on Etherscan
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Blockchain Visualization
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: 2,
                mt: 2
              }}>
                {[...Array(5)].map((_, i) => (
                  <Card key={i} sx={{ 
                    width: 180,
                    textAlign: 'center',
                    p: 2,
                    position: 'relative'
                  }}>
                    <BlockIcon fontSize="large" color="primary" />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Block #{blockNumber - i}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {i === 0 ? 'Latest' : ''}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BlockchainInfo