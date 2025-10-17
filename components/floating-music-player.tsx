"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, X, Minimize2, Maximize2, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZenPlaylist {
  id: string
  title: string
  videoId: string
  thumbnail: string
}

const zenPlaylists: ZenPlaylist[] = [
  {
    id: "rain",
    title: "Pluie relaxante",
    videoId: "q76bMs-NwRk",
    thumbnail: "https://img.youtube.com/vi/q76bMs-NwRk/mqdefault.jpg",
  },
  {
    id: "ocean",
    title: "Vagues océan",
    videoId: "WHPEKLQID4U",
    thumbnail: "https://img.youtube.com/vi/WHPEKLQID4U/mqdefault.jpg",
  },
  {
    id: "forest",
    title: "Forêt zen",
    videoId: "xNN7iTA57jM",
    thumbnail: "https://img.youtube.com/vi/xNN7iTA57jM/mqdefault.jpg",
  },
  {
    id: "meditation",
    title: "Méditation guidée",
    videoId: "inpok4MKVLM",
    thumbnail: "https://img.youtube.com/vi/inpok4MKVLM/mqdefault.jpg",
  },
  {
    id: "piano",
    title: "Piano relaxant",
    videoId: "lTRiuFIWV54",
    thumbnail: "https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg",
  },
  {
    id: "nature",
    title: "Sons de la nature",
    videoId: "eKFTSSKCzWA",
    thumbnail: "https://img.youtube.com/vi/eKFTSSKCzWA/mqdefault.jpg",
  },
  {
    id: "spa",
    title: "Musique spa",
    videoId: "1ZYbU82GVz4",
    thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/mqdefault.jpg",
  },
  {
    id: "lofi",
    title: "Lo-fi chill",
    videoId: "jfKfPfyJRdk",
    thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg",
  },
  {
    id: "f1",
    title: "F1",
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  },
]

export function FloatingMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [iframeKey, setIframeKey] = useState(0)

  const currentPlaylist = zenPlaylists[currentIndex]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    setIframeKey((prev) => prev + 1)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % zenPlaylists.length)
    setIsPlaying(true)
    setIframeKey((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + zenPlaylists.length) % zenPlaylists.length)
    setIsPlaying(true)
    setIframeKey((prev) => prev + 1)
  }

  const handleSelectPlaylist = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(true)
    setShowPlaylist(false)
    setIframeKey((prev) => prev + 1)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          setShowPlaylist(true)
        }}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-accent hover:scale-110 transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-4"
      >
        <Music className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-6 shadow-2xl border-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden",
        isMinimized ? "w-80" : "w-96",
        showPlaylist && "w-[500px]",
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm font-sans">Zen Player</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPlaylist(!showPlaylist)}>
            {showPlaylist ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsOpen(false)
              setIsPlaying(false)
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main Player */}
        <div className={cn("flex-1", showPlaylist && "border-r")}>
          {!isMinimized && (
            <div className="relative aspect-video bg-black">
              <iframe
                key={iframeKey}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentPlaylist.videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${currentPlaylist.videoId}&controls=1`}
                title={currentPlaylist.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {/* Thumbnail when minimized */}
          {isMinimized && (
            <div className="relative h-32 bg-black">
              <img
                src={currentPlaylist.thumbnail || "/placeholder.svg"}
                alt={currentPlaylist.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          )}

          {/* Controls */}
          <div className="p-4 space-y-3 bg-card">
            <div className="flex items-center gap-2">
              <img
                src={currentPlaylist.thumbnail || "/placeholder.svg"}
                alt={currentPlaylist.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate font-sans">{currentPlaylist.title}</p>
                <p className="text-xs text-muted-foreground font-sans">Musique zen</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handlePrevious}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNext}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        {showPlaylist && (
          <div className="w-56 bg-muted/30 overflow-y-auto max-h-[500px]">
            <div className="p-3 border-b">
              <p className="text-sm font-semibold font-sans">Playlist</p>
            </div>
            <div className="p-2 space-y-1">
              {zenPlaylists.map((playlist, index) => (
                <button
                  key={playlist.id}
                  onClick={() => handleSelectPlaylist(index)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left",
                    currentIndex === index && "bg-accent/70",
                  )}
                >
                  <img
                    src={playlist.thumbnail || "/placeholder.svg"}
                    alt={playlist.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate font-sans">{playlist.title}</p>
                  </div>
                  {currentIndex === index && isPlaying && (
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-primary animate-pulse" />
                      <div className="w-0.5 h-3 bg-primary animate-pulse delay-75" />
                      <div className="w-0.5 h-3 bg-primary animate-pulse delay-150" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
