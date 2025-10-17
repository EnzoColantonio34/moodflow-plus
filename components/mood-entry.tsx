"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Smile, Meh, Frown, Heart, Zap, HelpCircle, ChevronDown, X } from "lucide-react"
import type { Mood, MoodData } from "@/app/journal/page"
import { getActivityIcon } from "@/lib/activity-icons"

interface MoodEntryProps {
  onMoodUpdate: (date: string, mood: Mood, note?: string, weather?: MoodData["weather"], tags?: string[]) => void
  moods: MoodData[]
  currentDate: Date
}

// Configuration des options d'humeur avec icônes et couleurs
const moodOptions = [
  {
    value: "amazing" as Mood,
    label: "Incroyable",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950",
  },
  { value: "good" as Mood, label: "Bien", icon: Smile, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  {
    value: "okay" as Mood,
    label: "Correct",
    icon: Meh,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950",
  },
  {
    value: "bad" as Mood,
    label: "Pas bien",
    icon: Frown,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950",
  },
  { value: "terrible" as Mood, label: "Terrible", icon: Zap, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
]

const activityTags = [
  "Travail",
  "Sport",
  "Famille",
  "Amis",
  "Repos",
  "Loisirs",
  "Études",
  "Sortie",
  "Nature",
  "Lecture",
  "Musique",
  "Cuisine",
  "Méditation",
  "Voyage",
  "Shopping",
  "Cinéma",
]

const moodQuestions = [
  {
    question: "Comment était votre niveau d'énergie aujourd'hui ?",
    options: ["Très faible", "Faible", "Moyen", "Bon", "Excellent"],
  },
  {
    question: "Avez-vous ressenti du stress ou de l'anxiété ?",
    options: ["Beaucoup", "Un peu", "Modérément", "Peu", "Pas du tout"],
  },
  {
    question: "Comment évaluez-vous vos interactions sociales ?",
    options: ["Difficiles", "Tendues", "Neutres", "Agréables", "Excellentes"],
  },
]

/**
 * Composant MoodEntry
 * Permet à l'utilisateur de saisir son humeur du jour avec une note optionnelle,
 * des questions d'aide et des tags d'activités
 */
export function MoodEntry({ onMoodUpdate, moods, currentDate }: MoodEntryProps) {
  const dateStr = currentDate.toISOString().split("T")[0]
  const dateMood = moods.find((m) => m.date === dateStr)

  const [selectedMood, setSelectedMood] = useState<Mood | null>(dateMood?.mood || null)
  const [note, setNote] = useState(dateMood?.note || "")
  const [saved, setSaved] = useState(false)
  const [currentWeather, setCurrentWeather] = useState<MoodData["weather"] | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>(dateMood?.tags || [])
  const [helpOpen, setHelpOpen] = useState(false)
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, number>>({})

  // Mise à jour de l'état quand la date change
  useEffect(() => {
    const dateMood = moods.find((m) => m.date === dateStr)
    setSelectedMood(dateMood?.mood || null)
    setNote(dateMood?.note || "")
    setSelectedTags(dateMood?.tags || [])
    setQuestionAnswers({})
  }, [dateStr, moods])

  // Récupération des données météo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather")
        if (response.ok) {
          const data = await response.json()
          setCurrentWeather({
            temp: data.temp,
            condition: data.condition,
            icon: data.icon,
          })
        }
      } catch (error) {
        console.log("Météo non disponible pour cette entrée")
      }
    }
    fetchWeather()
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const suggestMood = (): Mood => {
    const scores = Object.values(questionAnswers)
    if (scores.length === 0) return "okay"

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

    if (avgScore >= 4) return "amazing"
    if (avgScore >= 3) return "good"
    if (avgScore >= 2) return "okay"
    if (avgScore >= 1) return "bad"
    return "terrible"
  }

  const applySuggestedMood = () => {
    const suggested = suggestMood()
    setSelectedMood(suggested)
    setHelpOpen(false)
  }

  /**
   * Sauvegarde l'humeur avec la note, les données météo et les tags
   */
  const handleSave = () => {
    if (selectedMood) {
      onMoodUpdate(dateStr, selectedMood, note, currentWeather || undefined, selectedTags)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const isToday = dateStr === new Date().toISOString().split("T")[0]
  const displayDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-balance font-sans">
          {isToday ? "Comment vous sentez-vous aujourd'hui ?" : `Comment vous sentiez-vous le ${displayDate} ?`}
        </CardTitle>
        <CardDescription className="font-sans">
          Prenez un moment pour noter votre humeur et vos activités
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible open={helpOpen} onOpenChange={setHelpOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full gap-2 bg-transparent font-sans text-sm">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Besoin d'aide pour évaluer votre humeur ?</span>
              <span className="sm:hidden">Aide pour évaluer</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${helpOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg border-border animate-in fade-in slide-in-from-top-2 duration-300 border-0">
            <p className="text-sm text-muted-foreground font-sans">
              Répondez à ces questions pour vous aider à identifier votre humeur globale :
            </p>
            {moodQuestions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-2">
                <p className="text-sm font-medium font-sans text-left">{q.question}</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {q.options.map((option, oIndex) => (
                    <Button
                      key={oIndex}
                      variant={questionAnswers[qIndex] === oIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuestionAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                      className="text-xs h-auto py-2 font-sans"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(questionAnswers).length === moodQuestions.length && (
              <Button onClick={applySuggestedMood} className="w-full gap-2 font-sans" variant="secondary">
                Appliquer l'humeur suggérée : {moodOptions.find((m) => m.value === suggestMood())?.label}
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {moodOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedMood === option.value
            return (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${option.bg} border-current ${option.color} scale-105 shadow-md`
                    : "border-border hover:border-primary/50 hover:scale-105 hover:shadow-sm bg-card"
                }`}
              >
                <Icon
                  className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 transition-colors ${isSelected ? option.color : "text-muted-foreground"}`}
                />
                <p
                  className={`text-xs sm:text-sm font-medium font-sans ${isSelected ? option.color : "text-foreground"}`}
                >
                  {option.label}
                </p>
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground font-sans">Activités de la journée</label>
          <p className="text-xs text-muted-foreground font-sans">
            Sélectionnez les activités qui ont marqué votre journée pour mieux comprendre ce qui influence votre humeur
          </p>
          <div className="flex flex-wrap gap-2 animate-in fade-in duration-500">
            {activityTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              const ActivityIcon = getActivityIcon(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-all duration-200 gap-1.5 font-sans py-1.5 px-2 sm:px-3 text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {ActivityIcon && <ActivityIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {tag}
                  {isSelected && <X className="w-3 h-3" />}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground font-sans">Note (optionnel)</label>
          <Textarea
            placeholder="Qu'est-ce qui a influencé votre humeur aujourd'hui ? (événements, pensées, etc.)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] resize-none font-sans"
          />
        </div>

        <Button onClick={handleSave} disabled={!selectedMood} className="w-full font-sans" size="lg">
          {saved ? "✓ Sauvegardé !" : "Enregistrer mon humeur"}
        </Button>
      </CardContent>
    </Card>
  )
}
