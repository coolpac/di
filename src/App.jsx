import { useState } from 'react'
import './App.css'
import FallingPetals from './components/FallingPetals'
import Hero from './components/Hero'
import Congratulation from './components/Congratulation'
import PhotoGallery from './components/PhotoGallery'
import WishesGallery from './components/WishesGallery'
import BouquetGame from './components/BouquetGame'
import Finale from './components/Finale'

function App() {
  const [gameCompleted, setGameCompleted] = useState(false)

  return (
    <div className="app">
      <FallingPetals />
      <Hero />
      <Congratulation />
      <PhotoGallery />
      <WishesGallery />
      <BouquetGame onComplete={() => setGameCompleted(true)} />
      <Finale showExtra={gameCompleted} />
    </div>
  )
}

export default App
