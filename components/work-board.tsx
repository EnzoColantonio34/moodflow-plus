"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, GripVertical, Trash2, Edit2, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface WorkItem {
  id: string
  title: string
  description: string
  color: string
  position: { x: number; y: number }
}

interface WorkBoardProps {
  items: WorkItem[]
  onItemsChange: (items: WorkItem[]) => void
}

const COLORS = [
  { name: "Rose", value: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700" },
  { name: "Bleu", value: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700" },
  { name: "Vert", value: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700" },
  { name: "Jaune", value: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700" },
  { name: "Violet", value: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700" },
]

/**
 * Composant WorkBoard
 * Tableau de travail interactif avec système de cartes déplaçables par glisser-déposer
 * Permet de créer, éditer, supprimer et organiser visuellement des tâches
 */
export function WorkBoard({ items, onItemsChange }: WorkBoardProps) {
  // États pour la gestion de l'interface
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({ title: "", description: "", color: COLORS[0].value })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState({ title: "", description: "" })

  // États pour le drag & drop
  const [draggedItem, setDraggedItem] = useState<string | null>(null) // ID de la carte en cours de déplacement
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }) // Offset entre le curseur et le coin de la carte
  const boardRef = useRef<HTMLDivElement>(null) // Référence au conteneur du tableau

  // Ajoute une nouvelle carte au tableau
  const addItem = () => {
    if (!newItem.title.trim()) return

    const item: WorkItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      color: newItem.color,
      // Position initiale aléatoire dans le tableau
      position: { x: Math.random() * 300, y: Math.random() * 200 },
    }

    onItemsChange([...items, item])
    setNewItem({ title: "", description: "", color: COLORS[0].value })
    setIsDialogOpen(false)
  }

  // Supprime une carte du tableau
  const deleteItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  // Active le mode édition pour une carte
  const startEdit = (item: WorkItem) => {
    setEditingId(item.id)
    setEditingText({ title: item.title, description: item.description })
  }

  // Sauvegarde les modifications d'une carte
  const saveEdit = (id: string) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, title: editingText.title, description: editingText.description } : item,
      ),
    )
    setEditingId(null)
  }

  // Annule l'édition en cours
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText({ title: "", description: "" })
  }

  /**
   * Démarre le déplacement d'une carte
   * Calcule l'offset entre la position du curseur et le coin supérieur gauche de la carte
   */
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    setDraggedItem(id)
    setDragOffset({
      x: e.clientX - item.position.x,
      y: e.clientY - item.position.y,
    })
  }

  /**
   * Gère le déplacement de la carte pendant le drag
   * Applique des contraintes pour empêcher la carte de sortir du tableau
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedItem) return

    // Calcul de la nouvelle position basée sur le curseur
    let newX = e.clientX - dragOffset.x
    let newY = e.clientY - dragOffset.y

    // Application des contraintes de limites du tableau
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect()
      const cardWidth = 256 // w-64 = 16rem = 256px
      const cardHeight = 150 // Hauteur approximative de la carte

      // Limites horizontales
      const minX = 0
      const maxX = boardRect.width - cardWidth
      newX = Math.max(minX, Math.min(newX, maxX))

      // Limites verticales
      const minY = 0
      const maxY = boardRect.height - cardHeight
      newY = Math.max(minY, Math.min(newY, maxY))
    }

    // Mise à jour de la position de la carte
    onItemsChange(items.map((item) => (item.id === draggedItem ? { ...item, position: { x: newX, y: newY } } : item)))
  }

  // Termine le déplacement de la carte
  const handleMouseUp = () => {
    setDraggedItem(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-balance font-sans text-xl sm:text-2xl">Tableau de travail</CardTitle>
            <CardDescription className="font-sans">Organisez vos tâches et projets de la semaine</CardDescription>
          </div>
          {/* Bouton d'ajout avec dialogue modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-sans w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="font-sans">
              <DialogHeader>
                <DialogTitle className="font-sans">Nouvelle tâche</DialogTitle>
                <DialogDescription className="font-sans">Ajoutez une nouvelle tâche à votre tableau</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Titre</label>
                  <Input
                    placeholder="Titre de la tâche"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="font-sans"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Description (optionnel)"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="font-sans"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Couleur</label>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewItem({ ...newItem, color: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${color.value} ${
                          newItem.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="font-sans">
                    Annuler
                  </Button>
                  <Button onClick={addItem} className="font-sans">
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Zone de travail avec gestion du drag & drop */}
        <div
          ref={boardRef}
          className="relative min-h-[300px] sm:min-h-[400px] bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 p-2 sm:p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Arrête le drag si la souris sort du tableau
        >
          {/* Message si aucune tâche */}
          {items.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-center font-sans text-sm sm:text-base">
                Aucune tâche pour le moment
                <br />
                <span className="text-xs sm:text-sm">Cliquez sur "Ajouter" pour commencer</span>
              </p>
            </div>
          ) : (
            // Rendu des cartes avec positionnement absolu
            items.map((item) => (
              <div
                key={item.id}
                className={`absolute w-56 sm:w-64 p-3 sm:p-4 rounded-lg border-2 shadow-md cursor-move transition-shadow hover:shadow-lg ${item.color} ${
                  draggedItem === item.id ? "shadow-xl scale-105" : ""
                }`}
                style={{
                  left: `${item.position.x}px`,
                  top: `${item.position.y}px`,
                }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
              >
                {/* Contenu de la carte avec icône de déplacement */}
                <div className="flex items-start gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <Input
                        value={editingText.title}
                        onChange={(e) => setEditingText({ ...editingText, title: e.target.value })}
                        className="mb-2 font-sans text-sm"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-sm break-words font-sans">{item.title}</h3>
                    )}
                  </div>
                </div>

                {/* Description (éditable ou affichage) */}
                {editingId === item.id ? (
                  <Textarea
                    value={editingText.description}
                    onChange={(e) => setEditingText({ ...editingText, description: e.target.value })}
                    className="mb-2 min-h-[60px] font-sans text-sm"
                  />
                ) : (
                  item.description && (
                    <p className="text-xs text-muted-foreground mb-3 break-words font-sans">{item.description}</p>
                  )
                )}

                {/* Boutons d'action (éditer, supprimer, sauvegarder, annuler) */}
                <div className="flex gap-1 justify-end">
                  {editingId === item.id ? (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => saveEdit(item.id)} className="h-7 w-7">
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-7 w-7">
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEdit(item)
                        }}
                        className="h-7 w-7"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItem(item.id)
                        }}
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
