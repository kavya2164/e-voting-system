import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VotingArea from './pages/Voting/VotingArea'
import Results from './pages/Voting/Results'
import AdminDashboard from './pages/Admin/Dashboard'
import Voters from './pages/Admin/Voters'
import BlockchainInfo from './pages/Blockchain/Info'
import Transactions from './pages/Blockchain/Transactions'
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute from './components/common/AdminRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/voting" element={<PrivateRoute />}>
        <Route index element={<VotingArea />} />
        <Route path="results" element={<Results />} />
      </Route>
      
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="voters" element={<Voters />} />
      </Route>
      
      <Route path="/blockchain">
        <Route index element={<BlockchainInfo />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes