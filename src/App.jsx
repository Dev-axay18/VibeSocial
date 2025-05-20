import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import ChatPage from './pages/ChatPage'
import SearchPage from './pages/SearchPage'
import NotificationsPage from './pages/NotificationsPage'
import CreatePostPage from './pages/CreatePostPage'
import VibeReelsPage from './pages/VibeReelsPage'

// Components
import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthContext'
import StorySection from './components/StorySection'
import CustomCursor from "./components/CustomCursor";

// import StoryCard from './components/StoryCard'

function App() {
  return (
    
    <AuthProvider>
      <CustomCursor />
      <Router>
        <div className="relative min-h-screen overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              <Route
                path="/home"
                element={
                  <> 
                    <Navbar />
                     <div className="pt-14 "></div>
                     <StorySection />
                    <HomePage />
                  </>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <>
                    <Navbar />
                    <ProfilePage />
                  </>
                }
              />
              <Route
                path="/explore"
                element={
                  <>
                    <Navbar />
                    <ExplorePage />
                  </>
                }
              />
              <Route
                path="/chat"
                element={
                  <>
                    <Navbar />
                    <ChatPage />
                  </>
                }
              />
              <Route
                path="/search"
                element={
                  <>
                    <Navbar />
                    <SearchPage />
                  </>
                }
              />
              <Route
                path="/notifications"
                element={
                  <>
                    <Navbar />
                    <NotificationsPage />
                  </>
                }
              />
              <Route
                path="/create"
                element={
                  <>
                    <Navbar />
                    <CreatePostPage />
                  </>
                }
              />
              <Route
                path="/vibe-reels"
                element={
                  <>
                    <Navbar />
                    <VibeReelsPage />
                  </>
                }
              />
            </Routes>
          </motion.div>

          {/* Aesthetic Gradient Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
