import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

/**
 * Interface para los datos de usuario del autor
 */
export interface Author {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

/**
 * Interface para los datos de publicación desde el CMS
 */
export interface PostFromCMS {
  id: string;
  contenido: string;
  autor: Author;
  media?: {
    tipo: "imagen" | "video";
    archivo: {
      url: string;
      filename: string;
      mimeType: string;
    };
    descripcion?: string;
  }[];
  externalMedia?: {
    tipo: "imagen" | "video";
    url: string;
    publicId?: string;
    descripcion?: string;
  }[];
  likes: number;
  usuarios_likes?: { id: string }[];
  tags?: {
    tag: string;
  }[];
  estado: "publicado" | "borrador" | "archivado";
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para los comentarios de una publicación
 */
export interface CommentFromCMS {
  id: string;
  contenido: string;
  autor: Author;
  post: string;
  likes: number;
  usuarios_likes?: { id: string }[];
  estado: "publicado" | "oculto";
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para los datos de publicación usados en la aplicación
 */
export interface Post {
  id: string;
  contenido: string;
  autor: {
    id: string;
    nombre: string;
    avatar?: string;
  };
  media: {
    tipo: "imagen" | "video";
    url: string;
    descripcion?: string;
  }[];
  likes: number;
  hasLiked: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para los comentarios usados en la aplicación
 */
export interface Comment {
  id: string;
  contenido: string;
  autor: {
    id: string;
    nombre: string;
    avatar?: string;
  };
  likes: number;
  hasLiked: boolean;
  createdAt: string;
}

/**
 * Transforma una publicación del CMS al formato de la aplicación
 */
const transformPost = (cmsPost: PostFromCMS, userId?: string): Post => {
  // Obtener el nombre del autor
  const autorNombre = cmsPost.autor.first_name
    ? `${cmsPost.autor.first_name}`
    : cmsPost.autor.email.split("@")[0];

  // Transformar media interna (archivos subidos directamente al CMS)
  const internalMedia = cmsPost.media
    ? cmsPost.media.map((item) => ({
        tipo: item.tipo,
        url: item.archivo.url,
        descripcion: item.descripcion,
      }))
    : [];

  // Transformar media externa (archivos alojados en Cloudinary)
  const externalMedia = cmsPost.externalMedia
    ? cmsPost.externalMedia.map((item) => ({
        tipo: item.tipo,
        url: item.url,
        descripcion: item.descripcion,
      }))
    : [];

  // Unificar ambos arrays de media
  const media = [...internalMedia, ...externalMedia];

  // Verificar si el usuario actual ha dado like
  const hasLiked = userId
    ? cmsPost.usuarios_likes?.some((user) => user.id === userId) || false
    : false;

  // Transformar tags
  const tags = cmsPost.tags ? cmsPost.tags.map((tag) => tag.tag) : [];

  return {
    id: cmsPost.id,
    contenido: cmsPost.contenido,
    autor: {
      id: cmsPost.autor.id,
      nombre: autorNombre,
      avatar: cmsPost.autor.image_url,
    },
    media,
    likes: cmsPost.likes,
    hasLiked,
    tags,
    createdAt: cmsPost.createdAt,
    updatedAt: cmsPost.updatedAt,
  };
};

/**
 * Transforma un comentario del CMS al formato de la aplicación
 */
const transformComment = (
  cmsComment: CommentFromCMS,
  userId?: string
): Comment => {
  // Obtener el nombre del autor
  const autorNombre = cmsComment.autor.first_name
    ? `${cmsComment.autor.first_name}`
    : cmsComment.autor.email.split("@")[0];

  // Verificar si el usuario actual ha dado like
  const hasLiked = userId
    ? cmsComment.usuarios_likes?.some((user) => user.id === userId) || false
    : false;

  return {
    id: cmsComment.id,
    contenido: cmsComment.contenido,
    autor: {
      id: cmsComment.autor.id,
      nombre: autorNombre,
      avatar: cmsComment.autor.image_url,
    },
    likes: cmsComment.likes,
    hasLiked,
    createdAt: cmsComment.createdAt,
  };
};

/**
 * Interface para la respuesta paginada del CMS
 */
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Interface para los parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

/**
 * Servicio para manejar las publicaciones del muro social
 */
export const postService = {
  /**
   * Obtiene las publicaciones del muro social
   */
  async getPosts(
    params: PaginationParams = {},
    userId?: string
  ): Promise<{
    posts: Post[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 10, sort = "-createdAt", where = {} } = params;

      // Asegurarse de que solo se muestren publicaciones publicadas
      const queryWhere = {
        ...where,
        estado: {
          equals: "publicado",
        },
      };

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
        where: queryWhere,
        depth: 2, // Para obtener los datos del autor
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.POSTS}${queryString}`
      );

      const posts = (response.data.docs || []).map((post: PostFromCMS) =>
        transformPost(post, userId)
      );

      const { docs, ...paginationInfo } = response.data;
      return {
        posts,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
      throw error;
    }
  },

  /**
   * Obtiene una publicación por su ID
   */
  async getPostById(id: string, userId?: string): Promise<Post | null> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.POSTS}/${id}?depth=2`
      );

      return transformPost(response.data, userId);
    } catch (error) {
      console.error(`Error al obtener la publicación con ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Obtiene los comentarios de una publicación
   */
  async getCommentsByPostId(
    postId: string,
    params: PaginationParams = {},
    userId?: string
  ): Promise<{
    comments: Comment[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 10, sort = "-createdAt" } = params;

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
        where: {
          post: {
            equals: postId,
          },
          estado: {
            equals: "publicado",
          },
        },
        depth: 2, // Para obtener los datos del autor
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.COMMENTS}${queryString}`
      );

      const comments = (response.data.docs || []).map(
        (comment: CommentFromCMS) => transformComment(comment, userId)
      );

      const { docs, ...paginationInfo } = response.data;
      return {
        comments,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error(
        `Error al obtener los comentarios del post ${postId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Crea una nueva publicación
   */
  async createPost(
    data: {
      contenido: string;
      media?: {
        archivo: string;
        tipo: "imagen" | "video";
        descripcion?: string;
      }[];
      externalMedia?: {
        url: string;
        tipo: "imagen" | "video";
        publicId?: string;
        descripcion?: string;
      }[];
      tags?: string[];
    },
    userId: string
  ): Promise<Post> {
    try {
      // Transformar los tags al formato esperado por el CMS
      const tags = data.tags ? data.tags.map((tag) => ({ tag })) : undefined;

      const postData = {
        contenido: data.contenido,
        autor: userId,
        media: data.media,
        externalMedia: data.externalMedia,
        tags,
        estado: "publicado",
      };
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.POSTS,
        postData
      );
      return transformPost(response.data.doc, userId);
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      throw error;
    }
  },

  /**
   * Crea un nuevo comentario
   */
  async createComment(
    data: {
      postId: string;
      contenido: string;
    },
    userId: string
  ): Promise<Comment> {
    try {
      const commentData = {
        contenido: data.contenido,
        autor: userId,
        post: data.postId,
        estado: "publicado",
      };

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.COMMENTS,
        commentData
      );
      return transformComment(response.data.doc, userId);
    } catch (error) {
      console.error("Error al crear el comentario:", error);
      throw error;
    }
  },

  /**
   * Da like a una publicación
   */
  async likePost(postId: string, userId: string): Promise<void> {
    try {
      // Obtener la publicación actual
      const postResponse = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.POSTS}/${postId}?depth=0`
      );

      const post = postResponse.data;
      const currentLikes = post.likes || 0;
      const currentUsers = post.usuarios_likes || [];

      // Verificar si el usuario ya dio like
      const userIndex = currentUsers.findIndex(
        (user: any) => user.id === userId
      );

      if (userIndex === -1) {
        // Añadir el usuario a la lista y aumentar el contador
        await apiClient.patch(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`, {
          likes: currentLikes + 1,
          usuarios_likes: [...currentUsers, userId],
        });
      }
    } catch (error) {
      console.error(`Error al dar like a la publicación ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Quita el like de una publicación
   */
  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      // Obtener la publicación actual
      const postResponse = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.POSTS}/${postId}?depth=0`
      );

      const post = postResponse.data;
      const currentLikes = post.likes || 0;
      const currentUsers = post.usuarios_likes || [];

      // Verificar si el usuario ya dio like
      const userIndex = currentUsers.findIndex(
        (user: any) => user.id === userId
      );

      if (userIndex !== -1) {
        // Eliminar el usuario de la lista y disminuir el contador
        const newUsers = [...currentUsers];
        newUsers.splice(userIndex, 1);

        await apiClient.patch(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`, {
          likes: Math.max(0, currentLikes - 1),
          usuarios_likes: newUsers,
        });
      }
    } catch (error) {
      console.error(`Error al quitar like de la publicación ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Da like a un comentario
   */
  async likeComment(commentId: string, userId: string): Promise<void> {
    try {
      // Obtener el comentario actual
      const commentResponse = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}?depth=0`
      );

      const comment = commentResponse.data;
      const currentLikes = comment.likes || 0;
      const currentUsers = comment.usuarios_likes || [];

      // Verificar si el usuario ya dio like
      const userIndex = currentUsers.findIndex(
        (user: any) => user.id === userId
      );

      if (userIndex === -1) {
        // Añadir el usuario a la lista y aumentar el contador
        await apiClient.patch(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`, {
          likes: currentLikes + 1,
          usuarios_likes: [...currentUsers, userId],
        });
      }
    } catch (error) {
      console.error(`Error al dar like al comentario ${commentId}:`, error);
      throw error;
    }
  },

  /**
   * Quita el like de un comentario
   */
  async unlikeComment(commentId: string, userId: string): Promise<void> {
    try {
      // Obtener el comentario actual
      const commentResponse = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}?depth=0`
      );

      const comment = commentResponse.data;
      const currentLikes = comment.likes || 0;
      const currentUsers = comment.usuarios_likes || [];

      // Verificar si el usuario ya dio like
      const userIndex = currentUsers.findIndex(
        (user: any) => user.id === userId
      );

      if (userIndex !== -1) {
        // Eliminar el usuario de la lista y disminuir el contador
        const newUsers = [...currentUsers];
        newUsers.splice(userIndex, 1);

        await apiClient.patch(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`, {
          likes: Math.max(0, currentLikes - 1),
          usuarios_likes: newUsers,
        });
      }
    } catch (error) {
      console.error(`Error al quitar like del comentario ${commentId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una publicación
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`);
    } catch (error) {
      console.error(`Error al eliminar la publicación ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un comentario
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.COMMENTS}/${commentId}`);
    } catch (error) {
      console.error(`Error al eliminar el comentario ${commentId}:`, error);
      throw error;
    }
  },
};
