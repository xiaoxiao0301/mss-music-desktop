import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import HomePage from "./pages/DesktopPlayer.jsx"

import './App.css'
import { FavoriteProvider, MusicPlayerProvider } from "./context/MusicContext.jsx"

import { IsLoggedIn } from "../wailsjs/go/backend/AuthBridge.js"

function AppRoutes() {
  const navigate = useNavigate()
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const loggedIn = await IsLoggedIn()
        console.log("IsLoggedIn:", loggedIn) 
        if (loggedIn) {
          navigate("/home")
        } else {
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        navigate("/")
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [navigate])
  
  if (checkingAuth) {
    return <div className="p-4">检查登录状态...</div>
  }
  
  return ( 
    <Routes> 
      <Route path="/" element={<LoginPage />} /> 
      <Route path="/home" element={<HomePage />} />
    </Routes> 
  );
}

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
