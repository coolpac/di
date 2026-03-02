import { useState } from 'react'
import './App.css'
import FallingPetals from './components/FallingPetals'
import Hero from './components/Hero'
import Congratulation from './components/Congratulation'
import PhotoGallery from './components/PhotoGallery'
import WishesGallery from './components/WishesGallery'
import ScratchCard from './components/ScratchCard'
import TypewriterLove from './components/TypewriterLove'
import MemoryGame from './components/MemoryGame'
import MusicVisualizer from './components/MusicVisualizer'
import ParticleMorph from './components/ParticleMorph'
import Finale from './components/Finale'

function App() {
  const [gameCompleted, setGameCompleted] = useState(false)

  return (
    <div className="app">
      <FallingPetals />
      <Hero />
      <Congratulation />
      <PhotoGallery />
      <ScratchCard />
      <TypewriterLove />
      <WishesGallery />
      <MemoryGame onComplete={() => setGameCompleted(true)} />
      <MusicVisualizer />
      <ParticleMorph />
      <Finale showExtra={gameCompleted} />
    </div>
  )
}

export default App
