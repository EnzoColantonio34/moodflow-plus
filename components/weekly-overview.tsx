"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, Meh, Frown, Heart, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import type { Mood, MoodData } from "@/app/journal/page"
import { getActivityIcon } from "@/lib/activity-icons"

interface WeeklyOverviewProps {
  moods: MoodData[]
  onMoodUpdate: (date: string, mood: Mood, note?: string) => void
  monthView?: boolean
}

const moodConfig = {
  amazing: { icon: Heart, color: "bg-pink-500", label: "Incroyable" },
  good: { icon: Smile, color: "bg-green-500", label: "Bien" },
  okay: { icon: Meh, color: "bg-yellow-500", label: "Correct" },
  bad: { icon: Frown, color: "bg-orange-500", label: "Pas bien" },
  terrible: { icon: Zap, color: "bg-red-500", label: "Terrible" },
}

/**
 * Génère les jours d'un mois donné pour l'affichage calendrier
 * Ajoute des cases vides au début pour aligner le premier jour sur le bon jour de la semaine
 */
function getMonthDays(year: number, month: number) {
  // Premier jour du mois
  const firstDay = new Date(year, month, 1)
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0)

  // Jour de la semaine du premier jour (0 = Dimanche, 1 = Lundi, etc.)
  let firstDayOfWeek = firstDay.getDay()
  // Conversion en base Lundi (0 = Lundi, 6 = Dimanche)
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const days: (Date | null)[] = []

  // Ajout de cases vides pour les jours avant le 1er du mois
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }

  // Ajout de tous les jours du mois
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  return days
}

/**
 * Génère les 7 jours de la semaine actuelle (Lundi à Dimanche)
 */
function getWeekDays() {
  const days = []
  const today = new Date()

  const currentDay = today.getDay()
  // Calcul de l'offset pour arriver au lundi
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + mondayOffset + i)
    days.push(date)
  }

  return days
}

/**
 * Composant WeeklyOverview
 * Affiche un aperçu visuel des humeurs sur une semaine ou un mois
 * - Vue semaine : 7 cercles colorés avec les humeurs
 * - Vue mois : Calendrier complet avec cases colorées et détails
 */
export function WeeklyOverview({ moods, monthView = false }: WeeklyOverviewProps) {
  // État pour la navigation mensuelle
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Génération des jours selon le mode (semaine ou mois)
  const days = monthView ? getMonthDays(currentYear, currentMonth) : getWeekDays()

  const monthName = monthView
    ? new Date(currentYear, currentMonth).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null

  // Fonctions de navigation pour le mode mois
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date().getMonth())
    setCurrentYear(new Date().getFullYear())
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-balance font-sans text-xl sm:text-2xl">
              {monthView ? monthName : "Votre semaine"}
            </CardTitle>
            <CardDescription className="font-sans mt-1">
              {monthView ? "Aperçu de votre humeur ce mois-ci" : "Aperçu de votre humeur cette semaine"}
            </CardDescription>
          </div>
          {/* Contrôles de navigation pour le mode mois */}
          {monthView && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-9 w-9 bg-transparent">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToCurrentMonth}
                className="h-9 px-3 font-sans bg-transparent"
              >
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-9 w-9 bg-transparent">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* En-têtes des jours de la semaine (mode mois uniquement) */}
        {monthView && (
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 pb-2 sm:pb-3 border-b">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-xs sm:text-sm font-semibold text-foreground font-sans">
                  {/* Nom complet sur desktop, abrégé sur mobile */}
                  <span className="hidden sm:inline">
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][index]}
                  </span>
                  <span className="sm:hidden">{day}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Grille des jours avec humeurs */}
        <div className={`grid ${monthView ? "grid-cols-7 gap-1 sm:gap-3" : "grid-cols-7 gap-2 sm:gap-3"}`}>
          {days.map((date, index) => {
            // Case vide pour l'alignement du calendrier
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const dateStr = date.toISOString().split("T")[0]
            const moodData = moods.find((m) => m.date === dateStr)
            const config = moodData ? moodConfig[moodData.mood] : null
            const Icon = config?.icon
            const isToday = dateStr === new Date().toISOString().split("T")[0]

            return (
              <div
                key={dateStr}
                className={`${
                  monthView ? "aspect-square" : "flex flex-col items-center gap-2"
                } animate-in fade-in duration-300`}
              >
                {monthView ? (
                  // Affichage en mode calendrier mensuel
                  <div
                    className={`w-full h-full rounded-md sm:rounded-lg border-2 p-1 sm:p-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                      isToday
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : config
                          ? "border-border bg-card"
                          : "border-dashed border-muted-foreground/20 bg-muted/30"
                    }`}
                  >
                    {/* Numéro du jour et icône d'humeur */}
                    <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                      <span
                        className={`text-xs sm:text-sm font-semibold font-sans ${isToday ? "text-primary" : "text-foreground"}`}
                      >
                        {date.getDate()}
                      </span>
                      {config && (
                        <div
                          className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${config.color} flex items-center justify-center`}
                        >
                          <Icon className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Tags d'activités (2 premiers + compteur) */}
                    {moodData?.tags && moodData.tags.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1 mb-1">
                        {moodData.tags.slice(0, 2).map((tag) => {
                          const ActivityIcon = getActivityIcon(tag)
                          return (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 font-sans flex items-center gap-0.5"
                            >
                              {ActivityIcon && <ActivityIcon className="w-2.5 h-2.5" />}
                              {tag}
                            </Badge>
                          )
                        })}
                        {moodData.tags.length > 2 && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 font-sans">
                            +{moodData.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    {/* Aperçu de la note (desktop uniquement) */}
                    {moodData?.note && (
                      <p className="hidden md:block text-xs text-muted-foreground line-clamp-2 mt-1 font-sans">
                        {moodData.note}
                      </p>
                    )}
                  </div>
                ) : (
                  // Affichage en mode semaine (cercles)
                  <>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer ${
                        config ? config.color : "bg-muted"
                      } ${isToday ? "ring-2 ring-primary ring-offset-2" : ""} transition-all duration-200 hover:scale-110 hover:shadow-md`}
                      title={config ? config.label : "Pas encore enregistré"}
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <span className="text-muted-foreground text-xs">?</span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground font-sans">
                        {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </p>
                      <p
                        className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"} font-sans`}
                      >
                        {date.getDate()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
