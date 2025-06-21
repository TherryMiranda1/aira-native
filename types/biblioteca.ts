import { Ionicons } from "@expo/vector-icons";

export interface LibraryCategory {
  id: string;
  title: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: string;
  description?: string;
  featured?: boolean;
}

export interface LibrarySection {
  id: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: keyof typeof Ionicons.glyphMap;
  categories: LibraryCategory[];
}

export interface CarouselProps {
  section: LibrarySection;
  className?: string;
} 