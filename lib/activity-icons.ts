import {
  Briefcase,
  Dumbbell,
  Users,
  UserPlus,
  Bed,
  Gamepad2,
  GraduationCap,
  PartyPopper,
  Trees,
  BookOpen,
  Music,
  ChefHat,
  Sparkles,
  Plane,
  ShoppingBag,
  Film,
  type LucideIcon,
} from "lucide-react"

export const activityIcons: Record<string, LucideIcon> = {
  Travail: Briefcase,
  Sport: Dumbbell,
  Famille: Users,
  Amis: UserPlus,
  Repos: Bed,
  Loisirs: Gamepad2,
  Études: GraduationCap,
  Sortie: PartyPopper,
  Nature: Trees,
  Lecture: BookOpen,
  Musique: Music,
  Cuisine: ChefHat,
  Méditation: Sparkles,
  Voyage: Plane,
  Shopping: ShoppingBag,
  Cinéma: Film,
}

export function getActivityIcon(activity: string): LucideIcon | null {
  return activityIcons[activity] || null
}
