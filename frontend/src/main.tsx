import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton, useUser } from '@clerk/clerk-react'
import { DataProvider, useData } from './contexts/DataContext'
import SupabaseService from './services/supabase'
import CheckInPage from './components/CheckInPage'
import { Toaster } from 'sonner'
import './index.css'

// Icons (using SVG for simplicity)
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
  </svg>
)

const GiftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const QrIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const ClipboardListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const ChartBarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const CogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA'

// Debug logging for deployment issues
console.log('App starting...', {
  clerkKey: PUBLISHABLE_KEY.slice(0, 20) + '...',
  environment: import.meta.env.MODE,
  url: window.location.href
})

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// User role management
type UserRole = 'employee' | 'admin'

const getUserRole = (user: any): UserRole => {
  // Check user metadata for role, default to employee
  return user?.publicMetadata?.role === 'admin' ? 'admin' : 'employee'
}

// Role-based route protection
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: UserRole }) {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (!user) {
    return <RedirectToSignIn />
  }
  
  const userRole = getUserRole(user)
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />
  }
  
  return <>{children}</>
}

// Navigation component
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const userRole = user ? getUserRole(user) : 'employee'

  const employeeNavItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/check-in', icon: QrIcon, label: 'Check In' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
    { path: '/rewards', icon: GiftIcon, label: 'Rewards' },
    { path: '/profile', icon: UserIcon, label: 'Profile' }
  ]

  const adminNavItems = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { path: '/admin/employees', icon: UsersIcon, label: 'Employees' },
    { path: '/admin/redemptions', icon: ClipboardListIcon, label: 'Redemptions' },
    { path: '/admin/rewards', icon: StarIcon, label: 'Rewards' },
    { path: '/admin/content', icon: BookOpenIcon, label: 'Content' },
    { path: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' }
  ]

  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SK</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  {userRole === 'admin' ? 'Admin Portal' : 'Employee Rewards'}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {userRole === 'admin' && (
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              )}
              <UserButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

// Layout wrapper
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}

// Dashboard page
function Dashboard() {
  const { user, loading, error } = useData()
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome to System Kleen{user?.name ? `, ${user.name}` : ''}!</h2>
        <p className="mt-2">Your Employee Rewards Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Points</h3>
          <p className="text-3xl font-bold text-blue-600">{user?.points_balance || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-green-600">{user?.current_streak || 0} days</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-purple-600">{user?.total_points_earned || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Welcome to the Employee Rewards System!</span>
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          {user?.current_streak > 0 && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-gray-600">{user.current_streak}-day streak maintained!</span>
              </div>
              <span className="text-sm text-gray-500">Current</span>
            </div>
          )}
          {user?.total_points_earned > 0 && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Total points earned: {user.total_points_earned}</span>
              </div>
              <span className="text-sm text-gray-500">Lifetime</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Check-in page
function CheckIn() {
  return <CheckInPage />
}

// Leaderboard page
function Leaderboard() {
  const { user } = useData()
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const leaders = await SupabaseService.getLeaderboard(10)
        
        // Add rank and format data
        const formattedData = leaders.map((leader, index) => ({
          rank: index + 1,
          id: leader.id,
          name: leader.name,
          points: leader.points_balance,
          streak: leader.current_streak,
          isCurrentUser: user?.id === leader.id
        }))
        
        setLeaderboardData(formattedData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-gray-600">Top performers by points and streaks</p>
        </div>
        
        <div className="p-6">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No employees found. Be the first to check in!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    employee.isCurrentUser
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                      employee.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      employee.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      employee.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {employee.rank === 1 ? '🥇' : 
                       employee.rank === 2 ? '🥈' : 
                       employee.rank === 3 ? '🥉' : 
                       `#${employee.rank}`}
                    </div>
                    <div>
                      <div className={`font-semibold ${employee.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                        {employee.isCurrentUser ? `${employee.name} (You)` : employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.streak > 0 ? `${employee.streak} day streak` : 'No current streak'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">{employee.points}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Rewards page
function Rewards() {
  const { user, refreshUser } = useData()
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemStatus, setRedeemStatus] = useState<string | null>(null)

  const categories = ['all', 'weekly', 'monthly', 'quarterly', 'annual', 'special']

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true)
        const allRewards = await SupabaseService.getRewards()
        setRewards(allRewards)
      } catch (error) {
        console.error('Error fetching rewards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory)

  const handleRedeem = async (reward: any) => {
    if (!user || user.points_balance < reward.points_cost || redeeming) return

    setRedeeming(reward.id)
    setRedeemStatus(null)

    try {
      // Create redemption request
      await SupabaseService.createRedemption(user.id, reward.id, reward.points_cost)

      // Deduct points from user balance
      await SupabaseService.updateUser(user.id, {
        points_balance: user.points_balance - reward.points_cost
      })

      // Create point transaction
      await SupabaseService.createPointTransaction({
        user_id: user.id,
        transaction_type: 'spent',
        points_amount: -reward.points_cost,
        reference_type: 'redemption',
        reference_id: reward.id,
        description: `Redeemed: ${reward.name}`
      })

      setRedeemStatus(`Successfully redeemed ${reward.name}! Your request is pending approval.`)
      await refreshUser()

    } catch (error) {
      console.error('Redemption failed:', error)
      setRedeemStatus('Redemption failed. Please try again.')
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rewards Store</h2>
        <p className="text-gray-600">Redeem your points for amazing rewards</p>
        <div className="mt-2 text-lg">
          <span className="text-gray-700">Your Points: </span>
          <span className="font-bold text-blue-600">{user?.points_balance || 0}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {redeemStatus && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{redeemStatus}</p>
        </div>
      )}

      {filteredRewards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No rewards available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {reward.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                
                {reward.terms && (
                  <p className="text-xs text-gray-500 mb-4 italic">{reward.terms}</p>
                )}

                {reward.quantity_available !== -1 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Available: {reward.quantity_available}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-blue-600">{reward.points_cost} pts</div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={
                      !reward.is_active || 
                      (reward.quantity_available !== -1 && reward.quantity_available <= 0) ||
                      !user ||
                      reward.points_cost > user.points_balance ||
                      redeeming === reward.id
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !reward.is_active || (reward.quantity_available !== -1 && reward.quantity_available <= 0)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : !user || reward.points_cost > (user?.points_balance || 0)
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : redeeming === reward.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {!reward.is_active
                      ? 'Unavailable'
                      : reward.quantity_available !== -1 && reward.quantity_available <= 0
                      ? 'Out of Stock'
                      : !user || reward.points_cost > (user?.points_balance || 0)
                      ? 'Need More Points'
                      : redeeming === reward.id
                      ? 'Redeeming...'
                      : 'Redeem'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Profile page
function Profile() {
  const { user } = useData()
  const [checkIns, setCheckIns] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Fetch user's check-ins
        const userCheckIns = await SupabaseService.getUserCheckIns(user.id, 50)
        setCheckIns(userCheckIns)

        // Fetch user's badges
        const badges = await SupabaseService.getUserBadges(user.id)
        setUserBadges(badges)

        // Calculate user rank
        const leaderboard = await SupabaseService.getLeaderboard(100)
        const rank = leaderboard.findIndex(leader => leader.id === user.id) + 1
        setUserRank(rank || leaderboard.length + 1)

        // Check for new badge eligibility
        await checkAndAwardBadges(user, userCheckIns, badges)

      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  const checkAndAwardBadges = async (user: any, checkIns: any[], currentBadges: any[]) => {
    try {
      // Get all available badges
      const { data: allBadges } = await SupabaseService.supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)

      if (!allBadges) return

      const currentBadgeIds = currentBadges.map(ub => ub.badge_id)

      for (const badge of allBadges) {
        if (currentBadgeIds.includes(badge.id)) continue // Already has this badge

        let shouldAward = false

        switch (badge.criteria_type) {
          case 'points':
            shouldAward = user.total_points_earned >= badge.criteria_value
            break
          case 'streak':
            shouldAward = user.current_streak >= badge.criteria_value
            break
          case 'checkins':
            shouldAward = checkIns.length >= badge.criteria_value
            break
        }

        if (shouldAward) {
          await SupabaseService.awardBadge(user.id, badge.id)
          console.log(`Awarded badge: ${badge.name}`)
        }
      }
    } catch (error) {
      console.error('Error checking badge eligibility:', error)
    }
  }

  const getThisMonthStats = () => {
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    
    const thisMonthCheckIns = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.check_in_time)
      return checkInDate.getMonth() === thisMonth && checkInDate.getFullYear() === thisYear
    })

    const pointsThisMonth = thisMonthCheckIns.reduce((sum, checkIn) => sum + checkIn.points_earned, 0)
    const earlyCheckIns = thisMonthCheckIns.filter(checkIn => checkIn.check_in_type === 'early').length
    const onTimeCheckIns = thisMonthCheckIns.filter(checkIn => checkIn.check_in_type === 'ontime').length

    return {
      checkIns: thisMonthCheckIns.length,
      pointsEarned: pointsThisMonth,
      earlyCheckIns,
      onTimeCheckIns
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const monthStats = getThisMonthStats()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{user.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.department} • Employee since {new Date(user.hire_date).getFullYear()}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Points</span>
              <span className="font-semibold">{user.points_balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-semibold">{user.total_points_earned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold">{user.current_streak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Streak</span>
              <span className="font-semibold">{user.longest_streak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Check-ins</span>
              <span className="font-semibold">{checkIns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Company Rank</span>
              <span className="font-semibold">#{userRank}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-semibold">{monthStats.pointsEarned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-ins</span>
              <span className="font-semibold">{monthStats.checkIns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Early Check-ins</span>
              <span className="font-semibold">{monthStats.earlyCheckIns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">On-time Check-ins</span>
              <span className="font-semibold">{monthStats.onTimeCheckIns}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements ({userBadges.length} badges earned)</h3>
        {userBadges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No badges earned yet. Keep checking in to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userBadges.map((userBadge) => (
              <div key={userBadge.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{userBadge.badge?.icon || '🏆'}</div>
                <div className="font-semibold text-sm">{userBadge.badge?.name}</div>
                <div className="text-xs text-gray-500 mt-1">{userBadge.badge?.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Earned {new Date(userBadge.earned_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Check-ins</h3>
        {checkIns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No check-ins yet. Start your journey today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 10).map((checkIn) => (
              <div key={checkIn.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    checkIn.check_in_type === 'early' ? 'bg-green-400' :
                    checkIn.check_in_type === 'ontime' ? 'bg-blue-400' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-900">
                    {new Date(checkIn.check_in_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-sm text-gray-500">
                    at {new Date(checkIn.check_in_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    checkIn.check_in_type === 'early' ? 'text-green-600' :
                    checkIn.check_in_type === 'ontime' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {checkIn.check_in_type === 'early' ? 'Early' :
                     checkIn.check_in_type === 'ontime' ? 'On-time' :
                     'Late'}
                  </span>
                  <span className="font-semibold text-blue-600">+{checkIn.points_earned}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Dashboard
function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        
        // Fetch analytics data
        const analyticsData = await SupabaseService.getAnalyticsData()
        setAnalytics(analyticsData)

        // Fetch recent check-ins for activity feed
        const todayCheckIns = await SupabaseService.getAllCheckInsToday()
        const recentCheckIns = todayCheckIns.slice(0, 5).map(checkIn => ({
          type: 'checkin',
          message: `${checkIn.user?.name || 'Employee'} checked in`,
          time: new Date(checkIn.check_in_time),
          color: checkIn.check_in_type === 'early' ? 'bg-green-400' : 
                 checkIn.check_in_type === 'ontime' ? 'bg-blue-400' : 'bg-gray-400'
        }))

        // Fetch recent redemptions
        const pendingRedemptions = await SupabaseService.getPendingRedemptions()
        const recentRedemptions = pendingRedemptions.slice(0, 3).map(redemption => ({
          type: 'redemption',
          message: `${redemption.user?.name || 'Employee'} requested ${redemption.reward?.name}`,
          time: new Date(redemption.requested_date),
          color: 'bg-orange-400'
        }))

        // Combine and sort by time
        const combinedActivity = [...recentCheckIns, ...recentRedemptions]
          .sort((a, b) => b.time.getTime() - a.time.getTime())
          .slice(0, 5)

        setRecentActivity(combinedActivity)

      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 rounded-xl h-32 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white p-6 mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-2">System Kleen Employee Management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.totalEmployees || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Check-ins</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.todayCheckIns || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Redemptions</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics?.pendingRedemptions || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Points Awarded Today</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics?.totalPointsAwarded || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 ${activity.color} rounded-full mr-3`}></div>
                    <span className="text-gray-600">{activity.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{getTimeAgo(activity.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <NavLink 
              to="/admin/employees"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-left transition-colors"
            >
              View All Employees
            </NavLink>
            <NavLink 
              to="/admin/redemptions"
              className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-left transition-colors"
            >
              Approve Redemptions ({analytics?.pendingRedemptions || 0})
            </NavLink>
            <NavLink 
              to="/admin/analytics"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-left transition-colors"
            >
              View Analytics
            </NavLink>
            <NavLink 
              to="/admin/settings"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-left transition-colors"
            >
              System Settings
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Employee Management
function AdminEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [pointsAdjustment, setPointsAdjustment] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const employeeData = await SupabaseService.getAllEmployees()
        
        // Get last check-in for each employee
        const employeesWithCheckIns = await Promise.all(
          employeeData.map(async (emp) => {
            try {
              const checkIns = await SupabaseService.getUserCheckIns(emp.id, 1)
              return {
                ...emp,
                lastCheckIn: checkIns[0]?.check_in_time || null
              }
            } catch {
              return { ...emp, lastCheckIn: null }
            }
          })
        )
        
        setEmployees(employeesWithCheckIns)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePointsAdjustment = async () => {
    if (!selectedEmployee || !pointsAdjustment) return

    try {
      const adjustmentAmount = parseInt(pointsAdjustment)
      
      // Update user points
      await SupabaseService.updateUser(selectedEmployee.id, {
        points_balance: selectedEmployee.points_balance + adjustmentAmount,
        total_points_earned: selectedEmployee.total_points_earned + (adjustmentAmount > 0 ? adjustmentAmount : 0)
      })

      // Create point transaction record
      await SupabaseService.createPointTransaction({
        user_id: selectedEmployee.id,
        transaction_type: adjustmentAmount > 0 ? 'earned' : 'adjusted',
        points_amount: adjustmentAmount,
        reference_type: 'admin_adjustment',
        reference_id: selectedEmployee.id,
        description: adjustmentReason || 'Admin points adjustment',
        created_by: 'admin' // In real app, this would be the current admin user ID
      })

      // Refresh employee data
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, points_balance: emp.points_balance + adjustmentAmount }
          : emp
      )
      setEmployees(updatedEmployees)

      // Reset modal
      setShowPointsModal(false)
      setSelectedEmployee(null)
      setPointsAdjustment('')
      setAdjustmentReason('')

    } catch (error) {
      console.error('Error adjusting points:', error)
      alert('Failed to adjust points. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
              <p className="text-gray-600">View and manage all employees ({employees.length} total)</p>
            </div>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {employee.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{employee.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{employee.points_balance}</span>
                      <span className="text-xs text-gray-500 block">({employee.total_points_earned} total)</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{employee.current_streak} days</span>
                      <span className="text-xs text-gray-500 block">(best: {employee.longest_streak})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.lastCheckIn ? (
                        <span className="text-sm text-gray-900">
                          {new Date(employee.lastCheckIn).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          setSelectedEmployee(employee)
                          setShowPointsModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Adjust Points
                      </button>
                      <NavLink 
                        to={`/admin/employees/${employee.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        View Details
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points Adjustment Modal */}
      {showPointsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adjust Points for {selectedEmployee.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Adjustment
                </label>
                <input
                  type="number"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(e.target.value)}
                  placeholder="Enter points (positive or negative)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current balance: {selectedEmployee.points_balance} points
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handlePointsAdjustment}
                  disabled={!pointsAdjustment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Adjust Points
                </button>
                <button
                  onClick={() => {
                    setShowPointsModal(false)
                    setSelectedEmployee(null)
                    setPointsAdjustment('')
                    setAdjustmentReason('')
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Admin Redemptions
function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchRedemptions()
  }, [])

  const fetchRedemptions = async () => {
    try {
      setLoading(true)
      const data = await SupabaseService.getAllRedemptions()
      setRedemptions(data)
    } catch (error) {
      console.error('Error fetching redemptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (redemptionId: string) => {
    setProcessing(redemptionId)
    try {
      await SupabaseService.updateRedemption(redemptionId, { status: 'approved' })
      await fetchRedemptions()
    } catch (error) {
      console.error('Error approving redemption:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (redemptionId: string) => {
    setProcessing(redemptionId)
    try {
      // Get redemption details first
      const redemption = redemptions.find(r => r.id === redemptionId)
      if (redemption) {
        // Refund points to user
        await SupabaseService.updateUser(redemption.user_id, {
          points_balance: redemption.users.points_balance + redemption.points_cost
        })

        // Create refund transaction
        await SupabaseService.createPointTransaction({
          user_id: redemption.user_id,
          transaction_type: 'earned',
          points_amount: redemption.points_cost,
          reference_type: 'refund',
          reference_id: redemptionId,
          description: `Refund for rejected redemption: ${redemption.rewards.name}`
        })

        // Update redemption status
        await SupabaseService.updateRedemption(redemptionId, { status: 'rejected' })
        await fetchRedemptions()
      }
    } catch (error) {
      console.error('Error rejecting redemption:', error)
    } finally {
      setProcessing(null)
    }
  }

  const filteredRedemptions = statusFilter === 'all' 
    ? redemptions 
    : redemptions.filter(r => r.status === statusFilter)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reward Redemptions</h2>
              <p className="text-gray-600">Approve or reject employee reward requests</p>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {filteredRedemptions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No redemptions found for the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRedemptions.map((redemption) => (
                  <tr key={redemption.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {redemption.users?.first_name?.[0] || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {redemption.users?.first_name} {redemption.users?.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{redemption.rewards?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{redemption.points_cost} pts</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        redemption.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {redemption.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(redemption.created_at).toLocaleDateString()} {new Date(redemption.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {redemption.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(redemption.id)}
                            disabled={processing === redemption.id}
                            className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50"
                          >
                            {processing === redemption.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button 
                            onClick={() => handleReject(redemption.id)}
                            disabled={processing === redemption.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {processing === redemption.id ? 'Processing...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Analytics
function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<string>('7')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const days = parseInt(dateRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [checkIns, users, redemptions, pointTransactions] = await Promise.all([
        SupabaseService.getCheckInsAfterDate(startDate.toISOString()),
        SupabaseService.getAllUsers(),
        SupabaseService.getRedemptionsAfterDate(startDate.toISOString()),
        SupabaseService.getPointTransactionsAfterDate(startDate.toISOString())
      ])

      // Calculate previous period for comparison
      const prevStartDate = new Date(startDate)
      prevStartDate.setDate(prevStartDate.getDate() - days)
      const [prevCheckIns, prevRedemptions, prevPointTransactions] = await Promise.all([
        SupabaseService.getCheckInsAfterDate(prevStartDate.toISOString()).then(data => 
          data.filter(c => new Date(c.created_at) < startDate)
        ),
        SupabaseService.getRedemptionsAfterDate(prevStartDate.toISOString()).then(data => 
          data.filter(r => new Date(r.created_at) < startDate)
        ),
        SupabaseService.getPointTransactionsAfterDate(prevStartDate.toISOString()).then(data => 
          data.filter(t => new Date(t.created_at) < startDate)
        )
      ])

      const earnedPoints = pointTransactions
        .filter(t => t.transaction_type === 'earned')
        .reduce((sum, t) => sum + t.points_amount, 0)
      
      const prevEarnedPoints = prevPointTransactions
        .filter(t => t.transaction_type === 'earned')
        .reduce((sum, t) => sum + t.points_amount, 0)

      const checkInsChange = prevCheckIns.length > 0 
        ? ((checkIns.length - prevCheckIns.length) / prevCheckIns.length) * 100 
        : 0

      const pointsChange = prevEarnedPoints > 0 
        ? ((earnedPoints - prevEarnedPoints) / prevEarnedPoints) * 100 
        : 0

      const redemptionsChange = prevRedemptions.length > 0 
        ? ((redemptions.length - prevRedemptions.length) / prevRedemptions.length) * 100 
        : 0

      setAnalytics({
        checkInsCount: checkIns.length,
        checkInsChange: Math.round(checkInsChange),
        pointsAwarded: earnedPoints,
        pointsChange: Math.round(pointsChange),
        redemptionsCount: redemptions.length,
        redemptionsChange: Math.round(redemptionsChange),
        totalUsers: users.length,
        activeUsers: users.filter(u => u.last_check_in && 
          new Date(u.last_check_in) >= startDate).length,
        topPerformers: users
          .sort((a, b) => (b.points_balance || 0) - (a.points_balance || 0))
          .slice(0, 5)
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Check-ins</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.checkInsCount}</p>
            <p className={`text-sm ${analytics.checkInsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.checkInsChange >= 0 ? '+' : ''}{analytics.checkInsChange}% from previous period
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Points Awarded</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.pointsAwarded?.toLocaleString()}</p>
            <p className={`text-sm ${analytics.pointsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.pointsChange >= 0 ? '+' : ''}{analytics.pointsChange}% from previous period
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Redemptions</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.redemptionsCount}</p>
            <p className={`text-sm ${analytics.redemptionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.redemptionsChange >= 0 ? '+' : ''}{analytics.redemptionsChange}% from previous period
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-orange-600">{analytics.activeUsers}/{analytics.totalUsers}</p>
            <p className="text-sm text-orange-600">
              {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% engagement rate
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {analytics.topPerformers?.map((user: any, index: number) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium">{user.first_name} {user.last_name}</span>
                  </div>
                  <span className="font-bold text-blue-600">{user.points_balance} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-bold">{analytics.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users ({dateRange} days)</span>
                <span className="font-bold text-green-600">{analytics.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span>Engagement Rate</span>
                <span className="font-bold text-blue-600">
                  {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Settings
function AdminSettings() {
  const [settings, setSettings] = useState({
    earlyPoints: 2,
    onTimePoints: 1,
    latePoints: 0,
    companyName: 'System Kleen',
    checkInStart: '06:00',
    checkInEnd: '09:00',
    timezone: 'America/Denver'
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus(null)
    
    try {
      // In a real implementation, this would save to a settings table in Supabase
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('Settings saved successfully!')
      
      // You could implement this with a system_settings table in Supabase:
      // await SupabaseService.updateSystemSettings(settings)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Point System Configuration</h3>
            <p className="text-gray-600 mb-4">Configure how many points employees earn based on their check-in time.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-green-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Early Check-in (6-7 AM)
                </label>
                <input 
                  type="number" 
                  value={settings.earlyPoints}
                  onChange={(e) => handleInputChange('earlyPoints', parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2 bg-white" 
                  min="0"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">Extra reward for early arrivals</p>
              </div>
              <div className="border rounded-lg p-4 bg-blue-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  On-time Check-in (7-9 AM)
                </label>
                <input 
                  type="number" 
                  value={settings.onTimePoints}
                  onChange={(e) => handleInputChange('onTimePoints', parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2 bg-white" 
                  min="0"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">Standard check-in reward</p>
              </div>
              <div className="border rounded-lg p-4 bg-red-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Check-in (After 9 AM)
                </label>
                <input 
                  type="number" 
                  value={settings.latePoints}
                  onChange={(e) => handleInputChange('latePoints', parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2 bg-white" 
                  min="0"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">Points for late arrivals</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="America/Denver">Mountain Time (Denver)</option>
                  <option value="America/New_York">Eastern Time (New York)</option>
                  <option value="America/Chicago">Central Time (Chicago)</option>
                  <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Check-in Window</h3>
            <p className="text-gray-600 mb-4">Set the daily time window when employees can check in.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Window Start Time</label>
                <input 
                  type="time" 
                  value={settings.checkInStart}
                  onChange={(e) => handleInputChange('checkInStart', e.target.value)}
                  className="border rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Window End Time</label>
                <input 
                  type="time" 
                  value={settings.checkInEnd}
                  onChange={(e) => handleInputChange('checkInEnd', e.target.value)}
                  className="border rounded px-3 py-2" 
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                {saveStatus && (
                  <p className={`text-sm ${saveStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveStatus}
                  </p>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Preview</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• Early birds (before 7 AM): <strong>{settings.earlyPoints} points</strong></p>
              <p>• On-time arrivals (7-9 AM): <strong>{settings.onTimePoints} points</strong></p>
              <p>• Late arrivals (after 9 AM): <strong>{settings.latePoints} points</strong></p>
              <p>• Check-in window: <strong>{settings.checkInStart} - {settings.checkInEnd}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Rewards Management
function AdminRewards() {
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingReward, setEditingReward] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_cost: 0,
    category: 'weekly',
    availability: 'available'
  })

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      const data = await SupabaseService.getRewards()
      setRewards(data)
    } catch (error) {
      console.error('Error fetching rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingReward) {
        await SupabaseService.updateReward(editingReward.id, formData)
      } else {
        await SupabaseService.createReward(formData)
      }
      await fetchRewards()
      setShowModal(false)
      setEditingReward(null)
      setFormData({ name: '', description: '', points_cost: 0, category: 'weekly', availability: 'available' })
    } catch (error) {
      console.error('Error saving reward:', error)
    }
  }

  const handleEdit = (reward: any) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      description: reward.description,
      points_cost: reward.points_cost,
      category: reward.category,
      availability: reward.availability
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      try {
        await SupabaseService.deleteReward(id)
        await fetchRewards()
      } catch (error) {
        console.error('Error deleting reward:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reward Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Reward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  reward.category === 'weekly' ? 'bg-blue-100 text-blue-800' :
                  reward.category === 'monthly' ? 'bg-green-100 text-green-800' :
                  reward.category === 'quarterly' ? 'bg-purple-100 text-purple-800' :
                  reward.category === 'annual' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {reward.category}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                reward.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {reward.availability}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-blue-600">{reward.points_cost} pts</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(reward)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingReward ? 'Edit Reward' : 'Add New Reward'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points Cost</label>
                <input
                  type="number"
                  value={formData.points_cost}
                  onChange={(e) => setFormData({ ...formData, points_cost: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="special">Special</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  {editingReward ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingReward(null)
                    setFormData({ name: '', description: '', points_cost: 0, category: 'weekly', availability: 'available' })
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Admin Content Management (Badges & Quotes)
function AdminContent() {
  const [activeTab, setActiveTab] = useState<'badges' | 'quotes'>('badges')
  const [badges, setBadges] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon: '',
    criteria: '',
    points_required: 0
  })
  const [quoteForm, setQuoteForm] = useState({
    text: '',
    author: '',
    category: 'motivation'
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'badges') {
        const data = await SupabaseService.getBadges()
        setBadges(data)
      } else {
        const data = await SupabaseService.getMotivationalQuotes()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBadge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await SupabaseService.updateBadge(editingItem.id, badgeForm)
      } else {
        await SupabaseService.createBadge(badgeForm)
      }
      await fetchData()
      setShowModal(false)
      setEditingItem(null)
      setBadgeForm({ name: '', description: '', icon: '', criteria: '', points_required: 0 })
    } catch (error) {
      console.error('Error saving badge:', error)
    }
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await SupabaseService.updateMotivationalQuote(editingItem.id, quoteForm)
      } else {
        await SupabaseService.createMotivationalQuote(quoteForm)
      }
      await fetchData()
      setShowModal(false)
      setEditingItem(null)
      setQuoteForm({ text: '', author: '', category: 'motivation' })
    } catch (error) {
      console.error('Error saving quote:', error)
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    if (activeTab === 'badges') {
      setBadgeForm({
        name: item.name,
        description: item.description,
        icon: item.icon,
        criteria: item.criteria,
        points_required: item.points_required
      })
    } else {
      setQuoteForm({
        text: item.text,
        author: item.author,
        category: item.category || 'motivation'
      })
    }
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'badges') {
          await SupabaseService.deleteBadge(id)
        } else {
          await SupabaseService.deleteMotivationalQuote(id)
        }
        await fetchData()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New {activeTab === 'badges' ? 'Badge' : 'Quote'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'badges' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'quotes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Motivational Quotes
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'badges' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{badge.icon}</span>
                    <h3 className="font-semibold">{badge.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{badge.criteria}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">{badge.points_required} pts</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(badge)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(badge.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white rounded-lg shadow-md p-4">
                  <blockquote className="text-gray-800 italic mb-2">"{quote.text}"</blockquote>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm">— {quote.author}</p>
                      {quote.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                          {quote.category}
                        </span>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(quote)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'badges' ? 'Badge' : 'Quote'}
            </h3>
            
            {activeTab === 'badges' ? (
              <form onSubmit={handleSubmitBadge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={badgeForm.name}
                    onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={badgeForm.icon}
                    onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="🏆"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={badgeForm.description}
                    onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Criteria</label>
                  <textarea
                    value={badgeForm.criteria}
                    onChange={(e) => setBadgeForm({ ...badgeForm, criteria: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    placeholder="How to earn this badge..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                  <input
                    type="number"
                    value={badgeForm.points_required}
                    onChange={(e) => setBadgeForm({ ...badgeForm, points_required: parseInt(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                    min="0"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingItem(null)
                      setBadgeForm({ name: '', description: '', icon: '', criteria: '', points_required: 0 })
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
                  <textarea
                    value={quoteForm.text}
                    onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={quoteForm.author}
                    onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={quoteForm.category}
                    onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="motivation">Motivation</option>
                    <option value="success">Success</option>
                    <option value="teamwork">Teamwork</option>
                    <option value="leadership">Leadership</option>
                    <option value="perseverance">Perseverance</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingItem(null)
                      setQuoteForm({ text: '', author: '', category: 'motivation' })
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Notification System
function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([])
  
  const addNotification = (notification: any) => {
    const id = Date.now()
    const newNotification = { ...notification, id }
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      {children}
      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 ${
              notification.type === 'success' ? 'border-green-400' :
              notification.type === 'error' ? 'border-red-400' :
              notification.type === 'warning' ? 'border-yellow-400' :
              'border-blue-400'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'error' && (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'info' && (
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// Real-time Updates Hook
function useRealTimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  
  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(Date.now())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return lastUpdate
}

// PWA Install Hook
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
      }
    }
  }

  return { isInstallable, installPWA }
}

// PWA Install Banner
function PWAInstallBanner() {
  const { isInstallable, installPWA } = usePWAInstall()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (isInstallable) {
      // Show banner after 3 seconds
      const timer = setTimeout(() => setShowBanner(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable])

  if (!showBanner || !isInstallable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Install Employee Rewards</h4>
          <p className="text-sm text-blue-100">Get quick access and offline features</p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={installPWA}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium"
          >
            Install
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-blue-100 hover:text-white"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151'
            }
          }}
        />
        <SignedIn>
          <Routes>
          {/* Employee Routes */}
          <Route path="/" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/check-in" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><CheckIn /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Leaderboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Rewards /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminEmployees /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/redemptions" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminRedemptions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminAnalytics /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminSettings /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/rewards" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminRewards /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminContent /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all - redirect based on role */}
          <Route path="*" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />
        </Routes>
        {/* PWA Install Banner temporarily disabled */}
        {/* <PWAInstallBanner /> */}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
    </NotificationProvider>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{color: '#dc2626'}}>Something went wrong</h1>
          <p>The Employee Rewards app encountered an error.</p>
          <details style={{marginTop: '20px', textAlign: 'left'}}>
            <summary>Error Details</summary>
            <pre style={{
              background: '#f3f4f6',
              padding: '10px',
              borderRadius: '5px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <DataProvider>
            <App />
          </DataProvider>
        </ClerkProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
      <h1 style="color: #dc2626;">App Failed to Load</h1>
      <p>There was a critical error loading the Employee Rewards app.</p>
      <p>Error: ${error}</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `
}