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

  // useTheme already toggles the `dark` class on <html>.
  // The wrapper just provides the page background transition.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
          className:
            '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 !border !border-gray-200 dark:!border-white/10 !rounded-xl !shadow-lg',
          duration: 4000,
        }}
      />
    </div>
  )
}
