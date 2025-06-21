import { apiClient } from "./apiClient"
import { API_CONFIG } from "./config"
import { stringify } from "qs-esm"

export interface Phrase {
  id: string
  id_frase: string
  frase: string
  categoria: string
  tags?: Array<{ tag: string }>
  momento_recomendado?: 'manana' | 'dia' | 'tarde' | 'noche' | 'cualquier-momento'
  estado_emocional?: Array<{ estado: string }>
  activo: boolean
  popularidad: number
  createdAt: string
  updatedAt: string
}

export interface PhraseFilters {
  categoria?: string
  momento_recomendado?: string
  estado_emocional?: string
  activo?: boolean
  search?: string
  limit?: number
  page?: number
  sort?: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

class PhraseService {
  private baseUrl = API_CONFIG.ENDPOINTS.PHRASES

  async getPhrases(filters: PhraseFilters = {}): Promise<PaginatedResponse<Phrase>> {
    try {
      const {
        categoria,
        momento_recomendado,
        estado_emocional,
        activo,
        search,
        limit = 10,
        page = 1,
        sort = '-popularidad'
      } = filters

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
      }

      const where: any = {}

      if (categoria) where.categoria = { equals: categoria }
      if (momento_recomendado) where.momento_recomendado = { equals: momento_recomendado }
      if (estado_emocional) {
        where['estado_emocional.estado'] = { contains: estado_emocional }
      }
      if (activo !== undefined) where.activo = { equals: activo }

      if (search) {
        where.or = [
          { frase: { contains: search } },
          { categoria: { contains: search } },
        ]
      }

      if (Object.keys(where).length > 0) {
        queryObj.where = where
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true })
      const response = await apiClient.get(`${this.baseUrl}${queryString}`)

      return response.data
    } catch (error) {
      console.error('Error fetching phrases:', error)
      throw new Error('Error al obtener las frases')
    }
  }

  async getPhraseById(id: string): Promise<Phrase> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching phrase:', error)
      throw new Error('Error al obtener la frase')
    }
  }

  async getPhrasesByCategory(categoria: string): Promise<Phrase[]> {
    try {
      const response = await this.getPhrases({ 
        categoria, 
        activo: true,
        limit: 100,
        sort: '-popularidad'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching phrases by category:', error)
      throw new Error('Error al obtener las frases por categoría')
    }
  }

  async getPhrasesByMoment(momento: 'manana' | 'dia' | 'tarde' | 'noche' | 'cualquier-momento'): Promise<Phrase[]> {
    try {
      const response = await this.getPhrases({ 
        momento_recomendado: momento,
        activo: true,
        limit: 50,
        sort: '-popularidad,-createdAt'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching phrases by moment:', error)
      throw new Error('Error al obtener las frases por momento')
    }
  }

  async getPhrasesByEmotion(estado: string): Promise<Phrase[]> {
    try {
      const response = await this.getPhrases({ 
        estado_emocional: estado,
        activo: true,
        limit: 50,
        sort: '-popularidad'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching phrases by emotion:', error)
      throw new Error('Error al obtener las frases por estado emocional')
    }
  }

  async getPopularPhrases(limit: number = 10): Promise<Phrase[]> {
    try {
      const response = await this.getPhrases({ 
        activo: true,
        limit,
        sort: '-popularidad,-createdAt'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching popular phrases:', error)
      throw new Error('Error al obtener las frases populares')
    }
  }

  async getRandomPhrases(limit: number = 5): Promise<Phrase[]> {
    try {
      const allPhrases = await this.getPhrases({ 
        activo: true,
        limit: 100
      })
      
      const shuffled = allPhrases.docs.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, limit)
    } catch (error) {
      console.error('Error fetching random phrases:', error)
      throw new Error('Error al obtener frases aleatorias')
    }
  }

  async searchPhrases(query: string): Promise<Phrase[]> {
    try {
      const response = await this.getPhrases({ 
        search: query,
        activo: true,
        limit: 50
      })
      return response.docs
    } catch (error) {
      console.error('Error searching phrases:', error)
      throw new Error('Error al buscar frases')
    }
  }

  async getAvailableCategories(): Promise<string[]> {
    try {
      const response = await this.getPhrases({ 
        activo: true,
        limit: 500
      })
      
      const categories = [...new Set(response.docs.map(phrase => phrase.categoria))]
      return categories.sort()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Error al obtener las categorías')
    }
  }

  async incrementPopularity(id: string): Promise<Phrase> {
    try {
      // Obtener el documento actual
      const current = await this.getPhraseById(id);
      
      // Incrementar popularidad
      const newPopularity = (current.popularidad || 0) + 1;
      
      // Actualizar el documento
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, {
        popularidad: newPopularity
      });
      
      return response.data;
    } catch (error) {
      console.error('Error incrementing popularity:', error);
      throw new Error('Error al incrementar popularidad');
    }
  }

  async createPhrase(
    phrase: Omit<Phrase, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Phrase> {
    try {
      const response = await apiClient.post(this.baseUrl, phrase)
      return response.data
    } catch (error) {
      console.error('Error creating phrase:', error)
      throw new Error('Error al crear frase')
    }
  }

  async updatePhrase(id: string, updates: Partial<Phrase>): Promise<Phrase> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Error updating phrase:', error)
      throw new Error('Error al actualizar frase')
    }
  }

  async deletePhrase(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting phrase:', error)
      throw new Error('Error al eliminar frase')
    }
  }

  getCategoryIcon(categoria: string): string {
    const categoryIcons: Record<string, string> = {
      'Inicio-del-Dia-General': '🌅',
      'Momentos-de-Desanimo-Falta-de-Motivacion': '😔',
      'Despues-de-un-Esfuerzo-Pequenos-Logros': '🎉',
      'Recordatorios-de-Autocuidado-Compasion': '💖',
      'Cuando-se-Falla-un-Objetivo-Flexibilidad': '🔄',
      'Para-Empezar-Algo-Nuevo-Superar-la-Inercia': '🚀',
      'Manejo-del-Estres-Cansancio': '😰',
      'Fomentar-la-Constancia': '💪',
      'Reflexion-al-Final-del-Dia': '🌙',
      'Conectando-con-el-Cuerpo-Ejercicio-Escucha': '🏃',
      'Alimentacion-Consciente': '🍎',
      'Celebrando-la-Resiliencia': '🌟'
    }
    
    return categoryIcons[categoria] || '💜'
  }

  getMomentLabel(momento: string): string {
    const momentLabels: Record<string, string> = {
      'manana': '🌅 Mañana',
      'dia': '☀️ Día',
      'tarde': '🌇 Tarde',
      'noche': '🌙 Noche',
      'cualquier-momento': '🔄 Cualquier momento'
    }
    
    return momentLabels[momento] || momento
  }

  getEmotionLabel(estado: string): string {
    const emotionLabels: Record<string, string> = {
      'motivacion': 'Motivación',
      'calma': 'Calma',
      'autocompasion': 'Autocompasión',
      'energia': 'Energía',
      'confianza': 'Confianza',
      'reflexion': 'Reflexión',
      'gratitud': 'Gratitud',
      'esperanza': 'Esperanza'
    }
    
    return emotionLabels[estado] || estado
  }
}

export const phraseService = new PhraseService() 