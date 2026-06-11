import { Toaster } from 'react-hot-toast'
import { useTheme } from './hooks/useTheme'
import FancyCursor from './components/FancyCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TechOrbit from './components/TechOrbit'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import GitHubActivity from './components/GitHubActivity'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <FancyCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <TechOrbit />
        <Projects />
        <Timeline />
        <GitHubActivity />
        <Blog />
        <Contact />
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-gray-800 !text-gray-100 !border !border-white/10 !rounded-xl',
          duration: 4000,
        }}
      />
    </div>
  )
}
