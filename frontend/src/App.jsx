import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import HomePage from "./pages/DesktopPlayer.jsx"

import './App.css'
import { FavoriteProvider } from "./context/MusicContext.jsx"

export default function App() {
  return (
    <FavoriteProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </FavoriteProvider>
    
  )
}
