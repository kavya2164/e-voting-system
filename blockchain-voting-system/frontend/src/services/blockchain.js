import { Web3 } from 'web3'
import VotingContractABI from '../../contracts/VotingContractABI.json'

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable()
      const web3 = new Web3(window.ethereum)
      return web3
    } catch (error) {
      console.error('User denied account access')
      return null
    }
  } else if (window.web3) {
    return new Web3(window.web3.currentProvider)
  } else {
    return new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
  }
}

export const getContractInstance = async (web3) => {
  return new web3.eth.Contract(VotingContractABI, CONTRACT_ADDRESS)
}

export const getVoterInfo = async (contract, voterId) => {
  return await contract.methods.getVoter(voterId).call()
}

export const getCandidateInfo = async (contract, candidateId) => {
  return await contract.methods.getCandidate(candidateId).call()
}

export const castVoteOnChain = async (contract, voterId, candidateId, signature, fromAddress) => {
  return await contract.methods.castVote(voterId, candidateId, signature)
    .send({ from: fromAddress, gas: 3000000 })
}

export const getTransactionHistory = async (web3, address, blocksToScan = 100) => {
  const currentBlock = await web3.eth.getBlockNumber()
  const transactions = []
  
  for (let i = 0; i < blocksToScan; i++) {
    const block = await web3.eth.getBlock(currentBlock - i, true)
    if (block && block.transactions) {
      const relevantTxs = block.transactions.filter(tx => 
        tx.from.toLowerCase() === address.toLowerCase() || 
        tx.to.toLowerCase() === address.toLowerCase()
      )
      transactions.push(...relevantTxs)
    }
  }
  
  return transactions.slice(0, 10)
}