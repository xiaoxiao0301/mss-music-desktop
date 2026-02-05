// import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import HomePage from "./pages/DesktopPlayer.jsx"

import './App.css'
import { FavoriteProvider, MusicPlayerProvider } from "./context/MusicContext.jsx"

export default function App() {
  return (
    <FavoriteProvider>
      <MusicPlayerProvider>
        <BrowserRouter>
          <Routes> 
            <Route path="/" element={<LoginPage />} /> 
            <Route path="/home" element={<HomePage />} />
          </Routes> 
        </BrowserRouter>
      </MusicPlayerProvider>
    </FavoriteProvider>
    
  )
}
