import { createContext, useState, useEffect } from 'react'
import Web3 from 'web3'
import { Web3Modal } from '@web3modal/standalone'
import { WalletConnectProvider } from '@walletconnect/web3-provider'

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [contract, setContract] = useState(null)

  const connectWallet = async () => {
    try {
      // Initialize WalletConnect provider
      const provider = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
          5: 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID',
          137: 'https://polygon-rpc.com'
        }
      })

      // Enable session (triggers QR Code modal)
      await provider.enable()

      // Create Web3 instance
      const web3Instance = new Web3(provider)
      setWeb3(web3Instance)

      // Get accounts
      const accounts = await web3Instance.eth.getAccounts()
      setAccount(accounts[0])

      // Get chain ID
      const chainId = await web3Instance.eth.getChainId()
      setChainId(chainId)

      // Initialize contract
      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      )
      setContract(contractInstance)

      setIsConnected(true)

      // Subscribe to accounts change
      provider.on('accountsChanged', (accounts) => {
        setAccount(accounts[0])
      })

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId) => {
        setChainId(chainId)
      })

      // Subscribe to disconnect event
      provider.on('disconnect', (code, reason) => {
        disconnectWallet()
      })

    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setWeb3(null)
    setAccount(null)
    setChainId(null)
    setContract(null)
    setIsConnected(false)
  }

  return (
    <Web3Context.Provider value={{
      web3,
      account,
      chainId,
      isConnected,
      contract,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  )
}