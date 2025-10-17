"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, Play, Pause, RotateCcw } from "lucide-react"

/**
 * Composant BreathingExercise
 * Guide l'utilisateur à travers un exercice de respiration 4-7-8
 * Technique de relaxation pour réduire le stress et l'anxiété
 */
export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [countdown, setCountdown] = useState(4)
  const [cycle, setCycle] = useState(0)

  // Durées de chaque phase (en secondes)
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isActive && countdown === 0) {
      // Passer à la phase suivante
      if (phase === "inhale") {
        setPhase("hold")
        setCountdown(phaseDurations.hold)
      } else if (phase === "hold") {
        setPhase("exhale")
        setCountdown(phaseDurations.exhale)
      } else {
        // Fin d'un cycle complet
        setCycle((prev) => prev + 1)
        setPhase("inhale")
        setCountdown(phaseDurations.inhale)

        // Arrêter après 4 cycles
        if (cycle >= 3) {
          setIsActive(false)
          setCycle(0)
        }
      }
    }

    return () => clearInterval(interval)
  }, [isActive, countdown, phase, cycle])

  const handleStart = () => {
    setIsActive(true)
    setPhase("inhale")
    setCountdown(phaseDurations.inhale)
    setCycle(0)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase("inhale")
    setCountdown(phaseDurations.inhale)
    setCycle(0)
  }

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Inspirez profondément"
      case "hold":
        return "Retenez votre souffle"
      case "exhale":
        return "Expirez lentement"
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "text-cyan-500"
      case "hold":
        return "text-amber-500"
      case "exhale":
        return "text-emerald-500"
    }
  }

  const getCircleScale = () => {
    if (!isActive) return "scale-100"
    switch (phase) {
      case "inhale":
        return "scale-150"
      case "hold":
        return "scale-150"
      case "exhale":
        return "scale-100"
    }
  }

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-accent" />
          Exercice de respiration 4-7-8
        </CardTitle>
        <CardDescription>
          Technique de relaxation pour calmer l'esprit et réduire le stress. Inspirez pendant 4 secondes, retenez
          pendant 7 secondes, expirez pendant 8 secondes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualisation de la respiration */}
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${getCircleScale()}`}
          >
            <div className="text-center">
              <p className={`text-5xl font-bold ${getPhaseColor()}`}>{countdown}</p>
              <p className="text-xs text-muted-foreground mt-1">secondes</p>
            </div>
          </div>
          <p className={`text-xl font-semibold mt-6 ${getPhaseColor()}`}>{getPhaseText()}</p>
          {isActive && <p className="text-sm text-muted-foreground mt-2">Cycle {cycle + 1} sur 4</p>}
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-3">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Commencer
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" size="lg" className="gap-2 bg-transparent">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
            </>
          )}
        </div>

        {/* Conseils */}
        <div className="p-4 rounded-lg space-y-2 text-left italic bg-transparent">
          <p className="text-sm font-medium">Conseils pour une pratique optimale :</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Trouvez un endroit calme et confortable</li>
            <li>Asseyez-vous avec le dos droit ou allongez-vous</li>
            <li>Placez le bout de votre langue contre votre palais</li>
            <li>Pratiquez régulièrement, idéalement 2 fois par jour</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
