"use client"

import { useState, useEffect } from "react"
import { MoodEntry } from "@/components/mood-entry"
import { WeeklyOverview } from "@/components/weekly-overview"
import { MoodAnalytics } from "@/components/mood-analytics"
import { ThemeToggle } from "@/components/theme-toggle"
import { DailyQuote } from "@/components/daily-quote"
import { WeatherWidget } from "@/components/weather-widget"
import { BreathingExercise } from "@/components/breathing-exercise"
import { WorkBoard, type WorkItem } from "@/components/work-board"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3, ChevronLeft, ChevronRight, Wind, BookOpen } from "lucide-react"
import Link from "next/link"

// Types pour les données d'humeur
export type Mood = "amazing" | "good" | "okay" | "bad" | "terrible"

export interface MoodData {
  date: string // Format ISO (YYYY-MM-DD)
  mood: Mood
  note?: string
  weather?: {
    temp: number
    condition: string
    icon: string
  }
  tags?: string[] // Tags d'activités (Sport, Travail, etc.)
}

/**
 * Page principale de l'application MoodFlow+
 * Gère l'état global de l'application et la navigation entre les différentes vues
 */
export default function JournalPage() {
  // État pour la vue active (journal, calendrier, analyses, respiration)
  const [view, setView] = useState<"journal" | "calendar" | "analytics" | "breathing">("journal")

  // État pour les données d'humeur stockées
  const [moods, setMoods] = useState<MoodData[]>([])

  // État pour les tâches du tableau de travail
  const [workItems, setWorkItems] = useState<WorkItem[]>([])

  // État pour la date actuellement affichée (permet de naviguer dans l'historique)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Chargement des données depuis localStorage au montage du composant
  useEffect(() => {
    const stored = localStorage.getItem("moodflow-data")
    if (stored) {
      try {
        setMoods(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored moods:", e)
      }
    }

    const storedWorkItems = localStorage.getItem("moodflow-work-items")
    if (storedWorkItems) {
      try {
        setWorkItems(JSON.parse(storedWorkItems))
      } catch (e) {
        console.error("Failed to parse stored work items:", e)
      }
    }
  }, [])

  // Sauvegarde automatique des humeurs dans localStorage à chaque modification
  useEffect(() => {
    if (moods.length > 0) {
      localStorage.setItem("moodflow-data", JSON.stringify(moods))
    }
  }, [moods])

  // Sauvegarde automatique des tâches dans localStorage à chaque modification
  useEffect(() => {
    if (workItems.length > 0) {
      localStorage.setItem("moodflow-work-items", JSON.stringify(workItems))
    }
  }, [workItems])

  /**
   * Met à jour ou ajoute une entrée d'humeur
   * Si une entrée existe déjà pour cette date, elle est mise à jour
   * Sinon, une nouvelle entrée est créée
   */
  const handleMoodUpdate = (
    date: string,
    mood: Mood,
    note?: string,
    weather?: MoodData["weather"],
    tags?: string[],
  ) => {
    setMoods((prev) => {
      const existing = prev.findIndex((m) => m.date === date)
      if (existing >= 0) {
        // Mise à jour d'une entrée existante
        const updated = [...prev]
        updated[existing] = { date, mood, note, weather, tags }
        return updated
      }
      // Ajout d'une nouvelle entrée
      return [...prev, { date, mood, note, weather, tags }]
    })
  }

  // Navigation vers le jour précédent
  const goToPreviousDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  /**
   * Navigation vers le jour suivant
   * Empêche la navigation vers des dates futures (on ne peut pas enregistrer l'humeur de demain)
   */
  const goToNextDay = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextDate = new Date(currentDate)
    nextDate.setDate(nextDate.getDate() + 1)
    nextDate.setHours(0, 0, 0, 0)

    // Autoriser la navigation uniquement si la date suivante n'est pas dans le futur
    if (nextDate <= today) {
      setCurrentDate(nextDate)
    }
  }

  // Retour à la date du jour
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Vérifications pour l'interface utilisateur
  const isToday = currentDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
  const isTodayOrFuture = currentDate >= new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation et contrôles de date */}
      <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                M+
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sans">MoodFlow+</h1>
            </Link>

            {/* Navigation principale (desktop) */}
            <nav className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg p-1 animate-in fade-in slide-in-from-top-2 duration-700">
              <Button
                variant={view === "journal" ? "default" : "ghost"}
                onClick={() => setView("journal")}
                className="gap-2 font-sans"
                size="sm"
              >
                <BookOpen className="w-4 h-4" />
                Journal
              </Button>
              <Button
                variant={view === "calendar" ? "default" : "ghost"}
                onClick={() => setView("calendar")}
                className="gap-2 font-sans"
                size="sm"
              >
                <Calendar className="w-4 h-4" />
                Calendrier
              </Button>
              <Button
                variant={view === "analytics" ? "default" : "ghost"}
                onClick={() => setView("analytics")}
                className="gap-2 font-sans"
                size="sm"
              >
                <BarChart3 className="w-4 h-4" />
                Analyses
              </Button>
              <Button
                variant={view === "breathing" ? "default" : "ghost"}
                onClick={() => setView("breathing")}
                className="gap-2 font-sans"
                size="sm"
              >
                <Wind className="w-4 h-4" />
                Respiration
              </Button>
            </nav>

            {/* Contrôles de navigation de date et toggle thème */}
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-700">
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={isToday ? "ghost" : "default"}
                  size="sm"
                  onClick={goToToday}
                  className="h-8 px-2 sm:px-3 text-xs sm:text-sm font-medium font-sans"
                >
                  {isToday ? (
                    <>
                      <span className="hidden sm:inline">Aujourd'hui</span>
                      <span className="sm:hidden">Auj.</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        {currentDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="sm:hidden">{currentDate.getDate()}</span>
                    </>
                  )}
                </Button>
                {/* Bouton suivant désactivé si on est déjà aujourd'hui ou dans le futur */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextDay}
                  className="h-8 w-8"
                  disabled={isTodayOrFuture}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation mobile (affichée uniquement sur petits écrans) */}
          <nav className="md:hidden flex items-center gap-2 mt-3 bg-muted/50 rounded-lg p-1 animate-in fade-in duration-500">
            <Button
              variant={view === "journal" ? "default" : "ghost"}
              onClick={() => setView("journal")}
              className="gap-2 flex-1"
              size="sm"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              onClick={() => setView("calendar")}
              className="gap-2 flex-1"
              size="sm"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "analytics" ? "default" : "ghost"}
              onClick={() => setView("analytics")}
              className="gap-2 flex-1"
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "breathing" ? "default" : "ghost"}
              onClick={() => setView("breathing")}
              className="gap-2 flex-1"
              size="sm"
            >
              <Wind className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Contenu principal - affichage conditionnel selon la vue active */}
      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-700">
        {/* Vue Journal : page principale avec tous les widgets */}
        {view === "journal" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <WeatherWidget />
              <DailyQuote moods={moods} />
            </div>
            <MoodEntry onMoodUpdate={handleMoodUpdate} moods={moods} currentDate={currentDate} />
            <WeeklyOverview moods={moods} onMoodUpdate={handleMoodUpdate} />
            <WorkBoard items={workItems} onItemsChange={setWorkItems} />
          </div>
        )}

        {/* Vue Calendrier : affichage mensuel des humeurs */}
        {view === "calendar" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-balance font-sans">Vue mensuelle</h2>
            <WeeklyOverview moods={moods} onMoodUpdate={handleMoodUpdate} monthView />
          </div>
        )}

        {/* Vue Analyses : graphiques et statistiques */}
        {view === "analytics" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-balance font-sans">Analyses et tendances</h2>
            <MoodAnalytics moods={moods} />
          </div>
        )}

        {/* Vue Respiration : exercices guidés */}
        {view === "breathing" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2 font-sans">Exercice de respiration</h2>
              <p className="text-muted-foreground font-sans">
                Prenez quelques minutes pour vous recentrer et apaiser votre esprit
              </p>
            </div>
            <BreathingExercise />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="font-medium font-sans">MoodFlow+ — Hackathon M1 Dev, Data, Infra — Ynov Montpellier</p>
          <p className="mt-2 font-sans">Prenez soin de votre bien-être mental, chaque jour compte 💜</p>
        </div>
      </footer>
    </div>
  )
}
