import { apiClient } from "./apiClient"
import { API_CONFIG } from "./config"
import { stringify } from "qs-esm"

export interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  categoria: string
  duration: string
  tags?: Array<{ tag: string }>
  dificultad: 'facil' | 'intermedio' | 'avanzado'
  beneficios?: Array<{ beneficio: string }>
  instrucciones_adicionales?: string
  activo: boolean
  popularidad: number
  createdAt: string
  updatedAt: string
}

export interface ChallengeFilters {
  categoria?: string
  dificultad?: string
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

class ChallengeService {
  private baseUrl = API_CONFIG.ENDPOINTS.CHALLENGES

  async getChallenges(filters: ChallengeFilters = {}): Promise<PaginatedResponse<Challenge>> {
    try {
      const {
        categoria,
        dificultad,
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
      if (dificultad) where.dificultad = { equals: dificultad }
      if (activo !== undefined) where.activo = { equals: activo }

      if (search) {
        where.or = [
          { title: { contains: search } },
          { description: { contains: search } },
        ]
      }

      if (Object.keys(where).length > 0) {
        queryObj.where = where
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true })
      const response = await apiClient.get(`${this.baseUrl}${queryString}`)

      return response.data
    } catch (error) {
      console.error('Error fetching challenges:', error)
      throw new Error('Error al obtener los mini retos')
    }
  }

  async getChallengeById(id: string): Promise<Challenge> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching challenge:', error)
      throw new Error('Error al obtener el mini reto')
    }
  }

  async getChallengesByCategory(categoria: string): Promise<Challenge[]> {
    try {
      const response = await this.getChallenges({ 
        categoria, 
        activo: true,
        limit: 100,
        sort: '-popularidad'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching challenges by category:', error)
      throw new Error('Error al obtener los mini retos por categoría')
    }
  }

  async getPopularChallenges(limit: number = 10): Promise<Challenge[]> {
    try {
      const response = await this.getChallenges({ 
        activo: true,
        limit,
        sort: '-popularidad,-createdAt'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching popular challenges:', error)
      throw new Error('Error al obtener los mini retos populares')
    }
  }

  async getRandomChallenges(limit: number = 5): Promise<Challenge[]> {
    try {
      const allChallenges = await this.getChallenges({ 
        activo: true,
        limit: 100
      })
      
      const shuffled = allChallenges.docs.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, limit)
    } catch (error) {
      console.error('Error fetching random challenges:', error)
      throw new Error('Error al obtener mini retos aleatorios')
    }
  }

  async searchChallenges(query: string): Promise<Challenge[]> {
    try {
      const response = await this.getChallenges({ 
        search: query,
        activo: true,
        limit: 50,
        sort: '-popularidad'
      })
      return response.docs
    } catch (error) {
      console.error('Error searching challenges:', error)
      throw new Error('Error al buscar mini retos')
    }
  }

  async getChallengesByDifficulty(dificultad: 'facil' | 'intermedio' | 'avanzado'): Promise<Challenge[]> {
    try {
      const response = await this.getChallenges({ 
        dificultad,
        activo: true,
        limit: 100,
        sort: '-popularidad'
      })
      return response.docs
    } catch (error) {
      console.error('Error fetching challenges by difficulty:', error)
      throw new Error('Error al obtener mini retos por dificultad')
    }
  }

  async getAvailableCategories(): Promise<string[]> {
    try {
      const response = await this.getChallenges({ 
        activo: true,
        limit: 500
      })
      
      const categories = [...new Set(response.docs.map(challenge => challenge.categoria))]
      return categories.sort()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Error al obtener las categorías')
    }
  }

  async incrementPopularity(id: string): Promise<Challenge> {
    try {
      // Obtener el documento actual
      const current = await this.getChallengeById(id);
      
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

  async createChallenge(
    challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Challenge> {
    try {
      const response = await apiClient.post(this.baseUrl, challenge)
      return response.data
    } catch (error) {
      console.error('Error creating challenge:', error)
      throw new Error('Error al crear mini reto')
    }
  }

  async updateChallenge(
    id: string,
    updates: Partial<Challenge>
  ): Promise<Challenge> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Error updating challenge:', error)
      throw new Error('Error al actualizar mini reto')
    }
  }

  async deleteChallenge(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting challenge:', error)
      throw new Error('Error al eliminar mini reto')
    }
  }

  getCategoryIcon(categoria: string): string {
    const categoryIcons: Record<string, string> = {
      'Mindfulness & Bienestar Emocional': '🧘',
      'Pausas Activas & Energía Exprés': '⚡',
      'Movimiento Diario & Fitness Suave': '🏃',
      'Nutrición Consciente & Snacks Saludables': '🍎',
      'Sueño Reparador & Rutinas Nocturnas': '🌙',
      'Gestion del Estres & Relajacion': '😌',
      'Productividad & Enfoque': '🎯',
      'Autocuidado & Momentos de Belleza': '💅',
      'Conexión Social & Apoyo': '👥',
      'Creatividad & Juego': '🎨'
    }
    
    return categoryIcons[categoria] || '✨'
  }

  getDifficultyLabel(dificultad: string): string {
    const difficultyLabels: Record<string, string> = {
      'facil': '😊 Fácil',
      'intermedio': '🙂 Intermedio',
      'avanzado': '💪 Avanzado'
    }
    
    return difficultyLabels[dificultad] || dificultad
  }
}

export const challengeService = new ChallengeService() 