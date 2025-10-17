"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, BarChart3, Cloud, Wind, Calendar, ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

/**
 * Page d'accueil de MoodFlow+
 * Présente l'application et ses objectifs de bien-être mental
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                M+
              </div>
              <h1 className="text-2xl font-bold text-foreground font-sans">MoodFlow+</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/journal">
                <Button size="lg" className="gap-2 font-sans">
                  Commencer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 animate-in fade-in slide-in-from-top-2 duration-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium font-sans">Votre compagnon de bien-être mental</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
            Prenez soin de votre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">santé mentale</span>
          </h2>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed font-sans animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
            MoodFlow+ vous aide à suivre votre humeur quotidienne, comprendre les facteurs qui influencent votre
            bien-être et développer des habitudes positives pour une meilleure santé mentale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in zoom-in-95 duration-700 delay-300">
            <Link href="/journal">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 font-sans">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Suivi quotidien</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Enregistrez votre humeur chaque jour avec des questions guidées et des tags d'activités pour mieux
                comprendre vos émotions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Corrélation météo</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Découvrez comment la météo influence votre humeur grâce à l'intégration automatique des données
                climatiques.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Analyses détaillées</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Visualisez vos tendances d'humeur, identifiez les patterns et comprenez ce qui favorise votre bien-être.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Exercices de respiration</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Accédez à des exercices guidés de respiration pour gérer le stress et l'anxiété au quotidien.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Historique complet</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Consultez et modifiez vos entrées passées pour maintenir un journal précis de votre parcours émotionnel.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-sans">Insights personnalisés</CardTitle>
              <CardDescription className="text-base leading-relaxed font-sans">
                Recevez des conseils adaptés et des encouragements basés sur vos données pour améliorer votre bien-être.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-24 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-700 delay-500">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl mb-4 font-sans text-center">Notre mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg text-muted-foreground leading-relaxed font-sans">
                MoodFlow+ a été créé avec la conviction que la santé mentale mérite autant d'attention que la santé
                physique. Notre objectif est de vous fournir les outils nécessaires pour mieux comprendre vos émotions,
                identifier les facteurs qui influencent votre bien-être et développer des stratégies pour cultiver une
                vie plus équilibrée et épanouie.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-sans">
                En combinant le suivi d'humeur, l'analyse de données environnementales et des exercices de bien-être,
                nous vous accompagnons dans votre parcours vers une meilleure santé mentale, un jour à la fois.
              </p>
              <div className="pt-6">
                <Link href="/journal">
                  <Button size="lg" className="gap-2 font-sans">
                    Commencer votre parcours
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-24 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="font-medium font-sans">MoodFlow+ — Hackathon M1 Dev, Data, Infra — Ynov Montpellier</p>
          <p className="mt-2 font-sans">Prenez soin de votre bien-être mental, chaque jour compte 💜</p>
        </div>
      </footer>
    </div>
  )
}
