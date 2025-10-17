import { type NextRequest, NextResponse } from "next/server"

/**
 * Route handler pour l'API météo
 * Sécurise la clé API en la gardant côté serveur
 * Endpoint: GET /api/weather?lat={latitude}&lon={longitude} ou GET /api/weather?city={cityName}
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const city = searchParams.get("city")

    // Validation des paramètres - soit coordonnées, soit nom de ville
    if (!lat && !lon && !city) {
      return NextResponse.json({ error: "Latitude/longitude ou nom de ville requis" }, { status: 400 })
    }

    // Récupération de la clé API depuis les variables d'environnement serveur
    const API_KEY = process.env.OPENWEATHER_API_KEY

    // Si pas de clé API, retourner des données de démonstration
    if (!API_KEY || API_KEY === "demo") {
      return NextResponse.json({
        temp: 22,
        feels_like: 24,
        humidity: 65,
        description: "partiellement nuageux",
        icon: "02d",
        wind_speed: 3.5,
        visibility: 10,
        name: city || "Paris",
        demo: true,
      })
    }

    let apiUrl = ""
    if (city) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
    }

    // Appel à l'API OpenWeatherMap
    const response = await fetch(apiUrl, {
      next: { revalidate: 600 }, // Cache pendant 10 minutes
    })

    if (!response.ok) {
      throw new Error("Erreur API OpenWeatherMap")
    }

    const data = await response.json()

    // Formatage des données pour le client
    return NextResponse.json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      visibility: data.visibility / 1000,
      name: data.name,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de la météo:", error)

    // Retour de données de démonstration en cas d'erreur
    return NextResponse.json({
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
  }
}
