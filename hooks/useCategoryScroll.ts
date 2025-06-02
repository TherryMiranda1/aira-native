import { useRef, useEffect } from "react";
import { FlatList } from "react-native";

interface Category {
  id: string;
  [key: string]: any;
}

/**
 * Hook personalizado para manejar el scroll sincronizado de categorías
 *
 * Este hook permite que cuando un usuario cambia de categoría mediante swipe o selección,
 * la lista horizontal de categorías se desplace automáticamente para mostrar la categoría
 * seleccionada en el centro o área visible.
 *
 * @param selectedCategory - ID de la categoría seleccionada actualmente
 * @param categories - Array de objetos de categoría que contienen al menos una propiedad 'id'
 * @param viewabilityConfig - Configuración opcional de visibilidad para el FlatList
 * @returns Un objeto con la referencia al FlatList y una función para manejar el scroll
 */
export function useCategoryScroll<T extends Category>(
  categories: T[],
  currentIndex: number,
  viewabilityConfig?: {
    itemVisiblePercentThreshold?: number;
    minimumViewTime?: number;
    waitForInteraction?: boolean;
  }
) {
  // Referencia al FlatList de categorías
  const categoriesListRef = useRef<FlatList<T>>(null);

  // Configuración predeterminada de visibilidad
  const defaultViewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
    waitForInteraction: false,
    ...viewabilityConfig,
  };

  // Efecto para manejar el scroll cuando cambia la categoría seleccionada
  useEffect(() => {
    if (categoriesListRef.current && currentIndex) {
      if (currentIndex !== -1 && currentIndex !== 0) {
        // Desplazamos la lista para mostrar la categoría seleccionada
        setTimeout(() => {
          categoriesListRef?.current?.scrollToIndex({
            index: currentIndex,
            animated: true,
            viewPosition: 0.5, // Centra el elemento en la vista (0 = inicio, 0.5 = centro, 1 = final)
            viewOffset: 0, // Offset adicional si es necesario
          });
        }, 100);
      }
    }
  }, [currentIndex]);

  // Manejador para errores de scrollToIndex (por ejemplo, cuando el índice está fuera de rango)
  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    // Si falla el scroll, intentamos primero desplazarnos a un elemento cercano visible
    // y luego volver a intentar con el elemento deseado
    const offset = info.averageItemLength * info.index;

    if (categoriesListRef.current) {
      categoriesListRef.current.scrollToOffset({
        offset,
        animated: true,
      });

      // Intentamos nuevamente después de un breve retraso
      setTimeout(() => {
        if (categoriesListRef.current && info.index < categories.length) {
          categoriesListRef.current.scrollToIndex({
            index: info.index,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }, 100);
    }
  };

  return {
    categoriesListRef,
    handleScrollToIndexFailed,
    viewabilityConfig: defaultViewabilityConfig,
  };
}

export default useCategoryScroll;
