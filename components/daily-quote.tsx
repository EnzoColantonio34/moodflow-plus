"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import type { MoodData } from "@/app/page"

interface DailyQuoteProps {
  moods: MoodData[]
}

const quotes = {
  amazing: [
    "Votre énergie positive illumine tout autour de vous ! ✨",
    "Continuez à rayonner, vous êtes incroyable ! 🌟",
    "Quelle belle journée pour être vous ! 💫",
  ],
  good: [
    "Une attitude positive mène à des résultats positifs. 🌈",
    "Vous êtes sur la bonne voie, continuez ! 🚀",
    "Chaque jour est une nouvelle opportunité. 🌅",
  ],
  okay: [
    "Les jours ordinaires font partie du voyage. 🌿",
    "Soyez patient avec vous-même. 🌸",
    "Demain est un nouveau jour. 🌙",
  ],
  bad: [
    "Les tempêtes ne durent pas éternellement. 🌧️",
    "Soyez doux avec vous-même aujourd'hui. 💙",
    "Il est normal de ne pas aller bien parfois. 🤗",
  ],
  terrible: [
    "Vous n'êtes pas seul dans cette épreuve. 💜",
    "Demander de l'aide est un signe de force. 🫂",
    "Prenez soin de vous, vous le méritez. 🌺",
  ],
}

export function DailyQuote({ moods }: DailyQuoteProps) {
  const today = new Date().toISOString().split("T")[0]
  const todayMood = moods.find((m) => m.date === today)

  const getQuote = () => {
    if (!todayMood) {
      return "Bienvenue sur MoodFlow+ ! Commencez par enregistrer votre humeur du jour. 🌟"
    }
    const moodQuotes = quotes[todayMood.mood]
    return moodQuotes[Math.floor(Math.random() * moodQuotes.length)]
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 20}px`,
              animation: `floatUp ${15 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0,
            }}
          />
        ))}

        {/* Gentle wave overlay */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--accent) / 0.08) 0%, transparent 50%)",
            animation: "gentleWave 20s ease-in-out infinite",
          }}
        />
      </div>

      <CardContent className="pt-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-pretty leading-relaxed font-sans">{getQuote()}</p>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 40 - 20}px);
            opacity: 0;
          }
        }

        @keyframes gentleWave {
          0%, 100% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(10px) scale(1.05);
          }
        }
      `}</style>
    </Card>
  )
}
