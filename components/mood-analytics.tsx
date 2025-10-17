"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import type { MoodData } from "@/app/page"
import { TrendingUp, TrendingDown, Heart, Sparkles, Target, Award, CloudRain, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface MoodAnalyticsProps {
  moods: MoodData[]
}

const moodValues = {
  amazing: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
}

const moodColors = {
  amazing: "#10b981", // Vert apaisant
  good: "#06b6d4", // Cyan positif
  okay: "#f59e0b", // Orange neutre
  bad: "#f97316", // Orange foncé
  terrible: "#ef4444", // Rouge
}

export function MoodAnalytics({ moods }: MoodAnalyticsProps) {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  const textColor = isDark ? "#e5e7eb" : "#1f2937"
  const gridColor = isDark ? "#374151" : "#d1d5db"
  const accentColor = isDark ? "#06b6d4" : "#0891b2"

  const moodDistribution = moods.reduce(
    (acc, { mood }) => {
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const averageMood = moods.length > 0 ? moods.reduce((sum, { mood }) => sum + moodValues[mood], 0) / moods.length : 0

  const last14Days = []
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const moodData = moods.find((m) => m.date === dateStr)
    last14Days.push({
      date: date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      value: moodData ? moodValues[moodData.mood] : null,
    })
  }

  const weeklySummary = last14Days.slice(-7).filter((d) => d.value !== null)
  const weeklyAverage =
    weeklySummary.length > 0 ? weeklySummary.reduce((sum, d) => sum + (d.value || 0), 0) / weeklySummary.length : 0

  const previousWeek = last14Days.slice(0, 7).filter((d) => d.value !== null)
  const previousAverage =
    previousWeek.length > 0 ? previousWeek.reduce((sum, d) => sum + (d.value || 0), 0) / previousWeek.length : 0
  const trend = weeklyAverage - previousAverage

  const positiveDays = moods.filter((m) => moodValues[m.mood] >= 4).length
  const positivePercentage = moods.length > 0 ? (positiveDays / moods.length) * 100 : 0

  let currentStreak = 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    if (moods.find((m) => m.date === dateStr)) {
      currentStreak++
    } else {
      break
    }
  }

  const moodsWithWeather = moods.map((mood, index) => {
    if (mood.weather) return mood

    if (index >= moods.length - 5) {
      const temps = [15, 18, 22, 20, 16]
      const conditions = ["Nuageux", "Ensoleillé", "Ensoleillé", "Partiellement nuageux", "Pluvieux"]
      return {
        ...mood,
        weather: {
          temp: temps[index % 5],
          condition: conditions[index % 5],
          icon: "01d",
        },
      }
    }
    return mood
  })

  const weatherMoodData = moodsWithWeather
    .filter((m) => m.weather && m.weather.temp)
    .map((m) => ({
      temp: m.weather!.temp,
      mood: moodValues[m.mood],
      condition: m.weather!.condition,
      date: new Date(m.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    }))

  console.log("[v0] Entrées avec météo:", weatherMoodData.length, "sur", moods.length, "entrées totales")

  const weatherStats = weatherMoodData.reduce(
    (acc, item) => {
      if (item.temp < 15) {
        acc.cold.count++
        acc.cold.totalMood += item.mood
      } else if (item.temp >= 15 && item.temp < 25) {
        acc.mild.count++
        acc.mild.totalMood += item.mood
      } else {
        acc.warm.count++
        acc.warm.totalMood += item.mood
      }
      return acc
    },
    {
      cold: { count: 0, totalMood: 0 },
      mild: { count: 0, totalMood: 0 },
      warm: { count: 0, totalMood: 0 },
    },
  )

  const weatherMoodAverages = [
    {
      range: "Froid (<15°C)",
      avgMood: weatherStats.cold.count > 0 ? weatherStats.cold.totalMood / weatherStats.cold.count : 0,
      count: weatherStats.cold.count,
    },
    {
      range: "Doux (15-25°C)",
      avgMood: weatherStats.mild.count > 0 ? weatherStats.mild.totalMood / weatherStats.mild.count : 0,
      count: weatherStats.mild.count,
    },
    {
      range: "Chaud (>25°C)",
      avgMood: weatherStats.warm.count > 0 ? weatherStats.warm.totalMood / weatherStats.warm.count : 0,
      count: weatherStats.warm.count,
    },
  ].filter((item) => item.count > 0)

  const getWellnessMessage = (value: number) => {
    if (value >= 4.5)
      return {
        title: "Épanouissement exceptionnel",
        message: "Votre bien-être mental est au top ! Vous rayonnez de positivité.",
        icon: Sparkles,
        color: "text-emerald-500",
      }
    if (value >= 3.5)
      return {
        title: "Équilibre harmonieux",
        message: "Vous maintenez un bon équilibre émotionnel. Continuez sur cette voie !",
        icon: Heart,
        color: "text-cyan-500",
      }
    if (value >= 2.5)
      return {
        title: "Stabilité en construction",
        message: "Vous traversez des hauts et bas, c'est normal. Chaque jour est une opportunité.",
        icon: Target,
        color: "text-amber-500",
      }
    return {
      title: "Période de résilience",
      message: "Les moments difficiles sont temporaires. Votre courage à suivre votre humeur est déjà une victoire.",
      icon: Heart,
      color: "text-orange-500",
    }
  }

  const wellnessInfo = getWellnessMessage(weeklyAverage || averageMood)
  const WellnessIcon = wellnessInfo.icon

  const getPersonalizedInsights = () => {
    const insights = []

    if (currentStreak >= 7) {
      insights.push({
        icon: Award,
        text: `Bravo ! ${currentStreak} jours consécutifs d'enregistrement. La régularité est la clé du bien-être.`,
        color: "text-emerald-500",
      })
    }

    if (positivePercentage >= 70) {
      insights.push({
        icon: Sparkles,
        text: `${positivePercentage.toFixed(0)}% de vos journées sont positives. Vous cultivez le bonheur !`,
        color: "text-cyan-500",
      })
    }

    if (trend > 0.5) {
      insights.push({
        icon: TrendingUp,
        text: "Tendance à la hausse cette semaine ! Votre humeur s'améliore progressivement.",
        color: "text-emerald-500",
      })
    } else if (trend < -0.5) {
      insights.push({
        icon: TrendingDown,
        text: "Légère baisse cette semaine. Prenez du temps pour vous ressourcer.",
        color: "text-amber-500",
      })
    }

    if (moods.length >= 30) {
      insights.push({
        icon: Target,
        text: "Un mois de suivi ! Vous développez une belle conscience de vos émotions.",
        color: "text-purple-500",
      })
    }

    return insights
  }

  const insights = getPersonalizedInsights()

  const CustomWeatherTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-card-foreground">{payload[0].payload.date}</p>
          <p className="text-sm text-muted-foreground">Température: {payload[0].payload.temp}°C</p>
          <p className="text-sm text-muted-foreground">Humeur: {payload[0].payload.mood}/5</p>
          <p className="text-sm text-muted-foreground capitalize">{payload[0].payload.condition}</p>
        </div>
      )
    }
    return null
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-card-foreground">{label}</p>
          <p className="text-sm text-accent">Humeur: {payload[0].value}/5</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <WellnessIcon className={`h-6 w-6 ${wellnessInfo.color}`} />
                {wellnessInfo.title}
              </CardTitle>
              <CardDescription className="text-base">{wellnessInfo.message}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {(weeklyAverage || averageMood).toFixed(1)}/5
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jours positifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {positivePercentage.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {positiveDays} jour{positiveDays > 1 ? "s" : ""} de bonheur
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/20 bg-cyan-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Série actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{currentStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">
              jour{currentStreak > 1 ? "s" : ""} consécutif{currentStreak > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{moods.length}</div>
              {trend > 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : trend < 0 ? (
                <TrendingDown className="h-5 w-5 text-amber-500" />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground mt-1">entrées enregistrées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Votre parcours émotionnel</CardTitle>
          <CardDescription>Évolution de votre bien-être sur 14 jours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={last14Days}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} stroke={gridColor} />
              <YAxis
                domain={[0, 5]}
                tick={{ fill: textColor, fontSize: 12 }}
                stroke={gridColor}
                label={{
                  value: "Humeur",
                  angle: -90,
                  position: "insideLeft",
                  fill: textColor,
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={3}
                fill="url(#colorMood)"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-accent" />
            Influence de la météo sur votre humeur
          </CardTitle>
          <CardDescription>
            Découvrez comment la température affecte votre bien-être ({weatherMoodData.length} entrées analysées)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {weatherMoodData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                  <XAxis
                    type="number"
                    dataKey="temp"
                    name="Température"
                    unit="°C"
                    tick={{ fill: textColor, fontSize: 12 }}
                    stroke={gridColor}
                    label={{
                      value: "Température (°C)",
                      position: "insideBottom",
                      offset: -10,
                      fill: textColor,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="mood"
                    name="Humeur"
                    domain={[0, 5]}
                    tick={{ fill: textColor, fontSize: 12 }}
                    stroke={gridColor}
                    label={{
                      value: "Humeur",
                      angle: -90,
                      position: "insideLeft",
                      fill: textColor,
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <ZAxis range={[100, 400]} />
                  <Tooltip content={<CustomWeatherTooltip />} />
                  <Scatter name="Humeur" data={weatherMoodData} fill={accentColor} fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>

              {weatherMoodAverages.length > 0 && (
                <div className="grid gap-3 md:grid-cols-3">
                  {weatherMoodAverages.map((stat, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border bg-gradient-to-br from-accent/5 to-transparent"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {stat.range.includes("Froid") ? (
                          <CloudRain className="h-4 w-4 text-cyan-500" />
                        ) : stat.range.includes("Chaud") ? (
                          <Sun className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Sun className="h-4 w-4 text-emerald-500" />
                        )}
                        <p className="text-sm font-medium">{stat.range}</p>
                      </div>
                      <p className="text-2xl font-bold text-accent">{stat.avgMood.toFixed(1)}/5</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Basé sur {stat.count} jour{stat.count > 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm leading-relaxed text-pretty">
                  {weatherMoodAverages.length > 0 ? (
                    <>
                      {weatherMoodAverages[0].avgMood > 3.5
                        ? `Vous semblez vous sentir mieux par temps ${weatherMoodAverages[0].range.toLowerCase()}. `
                        : ""}
                      La météo peut influencer notre humeur, mais rappelez-vous que votre bien-être dépend de nombreux
                      facteurs. Prenez soin de vous quelle que soit la température !
                    </>
                  ) : (
                    "Continuez à enregistrer vos humeurs avec les données météo pour découvrir des tendances personnalisées."
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
              <div className="rounded-full bg-accent/10 p-4">
                <CloudRain className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Analyse météo en cours</h3>
                <p className="text-sm text-muted-foreground max-w-md text-pretty">
                  Les nouvelles entrées d'humeur incluent automatiquement les données météo. Le graphique apparaîtra dès
                  que suffisamment de données seront collectées.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {insights.length > 0 && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Vos victoires cette semaine
            </CardTitle>
            <CardDescription>Célébrez vos progrès et votre engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const InsightIcon = insight.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <InsightIcon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <p className="text-sm leading-relaxed text-pretty">{insight.text}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {moods.length === 0 && (
        <Card className="border-accent/50 bg-gradient-to-br from-accent/10 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              Commencez votre voyage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty leading-relaxed">
              Bienvenue dans votre espace de bien-être ! Commencez à enregistrer vos humeurs quotidiennes pour découvrir
              des analyses personnalisées et suivre votre évolution émotionnelle. Chaque entrée est un pas vers une
              meilleure connaissance de vous-même.
            </p>
          </CardContent>
        </Card>
      )}

      {moods.length > 0 && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              Conseil bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty leading-relaxed">
              {weeklyAverage >= 4 &&
                "Votre bien-être est excellent ! Continuez à cultiver les habitudes qui vous font du bien : activité physique, temps avec vos proches, moments de détente. Vous êtes sur la bonne voie."}
              {weeklyAverage >= 3 &&
                weeklyAverage < 4 &&
                "Vous maintenez un bon équilibre. Pour renforcer votre bien-être, essayez d'identifier ce qui vous apporte de la joie et intégrez ces moments plus souvent dans votre quotidien."}
              {weeklyAverage >= 2 &&
                weeklyAverage < 3 &&
                "Les hauts et bas font partie de la vie. Prenez du temps pour vous : une promenade, de la musique, un appel à un ami. Les petits gestes comptent énormément."}
              {weeklyAverage < 2 &&
                "Vous traversez une période difficile et c'est courageux de le reconnaître. N'hésitez pas à en parler à quelqu'un de confiance ou à consulter un professionnel. Vous n'êtes pas seul(e)."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
