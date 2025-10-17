"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

export function YouTubeZenPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<ZenPlaylist | null>(null)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Music className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans">Sons zen et méditation</DialogTitle>
          <DialogDescription className="font-sans">Choisissez une ambiance sonore pour vous détendre</DialogDescription>
        </DialogHeader>

        {selectedPlaylist ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold font-sans">{selectedPlaylist.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPlaylist(null)}>
                <X className="w-4 h-4 mr-2" />
                Changer
              </Button>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedPlaylist.videoId}?autoplay=1&loop=1&playlist=${selectedPlaylist.videoId}`}
                title={selectedPlaylist.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {zenPlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={playlist.thumbnail || "/placeholder.svg"}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-center font-sans">{playlist.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
