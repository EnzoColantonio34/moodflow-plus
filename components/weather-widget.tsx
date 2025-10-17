"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Eye, MapPin, Search } from "lucide-react"

// Interface pour les données météo
interface WeatherData {
  temp: number
  feels_like: number
  humidity: number
  description: string
  icon: string
  wind_speed: number
  visibility: number
  name: string
  demo?: boolean
}

/**
 * Composant WeatherWidget
 * Affiche les conditions météorologiques actuelles basées sur la géolocalisation de l'utilisateur
 * Utilise une route API sécurisée pour protéger la clé OpenWeatherMap
 */
export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [cityInput, setCityInput] = useState("")
  const [geoPermissionDenied, setGeoPermissionDenied] = useState(false)

  // Récupération des données météo au chargement du composant
  useEffect(() => {
    fetchWeather()
  }, [])

  /**
   * Récupère les données météo en utilisant la géolocalisation du navigateur
   * Appelle notre API route sécurisée qui gère la clé API côté serveur
   */
  const fetchWeather = async () => {
    try {
      // Vérification du support de la géolocalisation
      if (!navigator.geolocation) {
        setGeoPermissionDenied(true)
        loadDemoWeather()
        return
      }

      // Demande de permission pour la géolocalisation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Appel à notre API route sécurisée (la clé API reste sur le serveur)
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)

            if (!response.ok) {
              throw new Error("Impossible de récupérer les données météo")
            }

            const data = await response.json()
            setWeather(data)
            setLoading(false)
            setGeoPermissionDenied(false)
          } catch (err) {
            loadDemoWeather()
          }
        },
        (err) => {
          setGeoPermissionDenied(true)
          loadDemoWeather()
        },
      )
    } catch (err) {
      setError("Erreur lors de la récupération de la météo")
      setLoading(false)
    }
  }

  const loadDemoWeather = () => {
    setWeather({
      temp: 22,
      feels_like: 24,
      humidity: 65,
      description: "partiellement nuageux",
      icon: "02d",
      wind_speed: 3.5,
      visibility: 10,
      name: "Paris",
      demo: true,
    })
    setLoading(false)
  }

  const searchWeatherByCity = async () => {
    if (!cityInput.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityInput)}`)

      if (!response.ok) {
        throw new Error("Ville introuvable")
      }

      const data = await response.json()
      setWeather(data)
      setShowCitySearch(false)
      setCityInput("")
      setGeoPermissionDenied(false)
    } catch (err) {
      setError("Ville introuvable. Veuillez réessayer.")
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Retourne l'icône appropriée selon les conditions météo
   */
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.startsWith("01")) return <Sun className="w-12 h-12 text-yellow-500" />
    if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04"))
      return <Cloud className="w-12 h-12 text-gray-500" />
    if (iconCode.startsWith("09") || iconCode.startsWith("10")) return <CloudRain className="w-12 h-12 text-blue-500" />
    if (iconCode.startsWith("13")) return <CloudSnow className="w-12 h-12 text-blue-300" />
    return <Sun className="w-12 h-12 text-yellow-500" />
  }

  /**
   * Retourne un message personnalisé selon la météo pour lier avec l'humeur
   */
  const getWeatherMoodMessage = (temp: number, description: string) => {
    if (description.includes("pluie") || description.includes("orage")) {
      return "Le temps pluvieux peut influencer votre humeur. Prenez soin de vous !"
    }
    if (temp > 25) {
      return "Belle journée ensoleillée ! Profitez-en pour sortir et vous ressourcer."
    }
    if (temp < 10) {
      return "Temps frais aujourd'hui. Un bon moment pour se cocooner à l'intérieur."
    }
    return "Conditions météo agréables pour une belle journée !"
  }

  if (loading) {
    return (
      <Card className="border-accent/30">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !weather) {
    return null
  }

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5 animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-sans">
            {weather && getWeatherIcon(weather.icon)}
            <span>
              Météo à {weather?.name}
              {weather?.demo && (
                <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-1 bg-muted rounded font-sans">
                  Données exemple
                </span>
              )}
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCitySearch(!showCitySearch)}
            className="text-accent hover:text-accent/80 font-sans"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Changer
          </Button>
        </div>
        {geoPermissionDenied && weather?.demo && (
          <p className="text-xs text-muted-foreground mt-2 font-sans">
            Géolocalisation désactivée. Recherchez votre ville ci-dessous.
          </p>
        )}
        {showCitySearch && (
          <div className="flex gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              placeholder="Entrez une ville..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchWeatherByCity()}
              className="flex-1 font-sans"
            />
            <Button onClick={searchWeatherByCity} size="sm" className="bg-accent hover:bg-accent/90 font-sans">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        )}
        {error && <p className="text-sm text-destructive mt-2 font-sans">{error}</p>}
        {weather && (
          <CardDescription className="text-base mt-2 font-sans">
            {getWeatherMoodMessage(weather.temp, weather.description)}
          </CardDescription>
        )}
      </CardHeader>
      {weather && (
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Température */}
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg transition-all duration-200 hover:bg-background/70 hover:scale-105">
              <p className="text-3xl font-bold text-accent font-sans">{weather.temp}°C</p>
              <p className="text-sm text-muted-foreground capitalize font-sans">{weather.description}</p>
              <p className="text-xs text-muted-foreground mt-1 font-sans">Ressenti {weather.feels_like}°C</p>
            </div>

            {/* Humidité */}
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg transition-all duration-200 hover:bg-background/70 hover:scale-105">
              <Droplets className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-2xl font-bold font-sans">{weather.humidity}%</p>
              <p className="text-sm text-muted-foreground font-sans">Humidité</p>
            </div>

            {/* Vent */}
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg transition-all duration-200 hover:bg-background/70 hover:scale-105">
              <Wind className="w-6 h-6 text-gray-500 mb-2" />
              <p className="text-2xl font-bold font-sans">{weather.wind_speed} m/s</p>
              <p className="text-sm text-muted-foreground font-sans">Vent</p>
            </div>

            {/* Visibilité */}
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg transition-all duration-200 hover:bg-background/70 hover:scale-105">
              <Eye className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-2xl font-bold font-sans">{weather.visibility} km</p>
              <p className="text-sm text-muted-foreground font-sans">Visibilité</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
