import { useCallback, useState } from "react";
import {
  postService,
  Post,
  Comment,
  PaginationParams,
} from "@/services/api/post.service";
import { useToastHelpers } from "@/components/ui/ToastSystem";
import { useCustomerContext } from "@/context/CustomerContext";
import { mediaService } from "@/services/api/media.service";
import { ExternalMediaItem } from "./useMedia";

/**
 * Hook para manejar las operaciones del muro social
 */
export function usePosts() {
  const { customer } = useCustomerContext();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
  });
  const [commentsPagination, setCommentsPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
  });

  /**
   * Obtiene las publicaciones del muro social
   */
  const fetchPosts = useCallback(
    async (params: PaginationParams = {}) => {
      try {
        setLoading(true);
        const result = await postService.getPosts(params, customer?.id);
        setPosts(result.posts);
        setPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.hasNextPage,
        });
        return result;
      } catch {
        showErrorToast("No se pudieron cargar las publicaciones");
        return {
          posts: [],
          pagination: { page: 1, limit: 10, totalPages: 0, hasNextPage: false },
        };
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showErrorToast, customer?.id]
  );

  /**
   * Carga más publicaciones (paginación)
   */
  const loadMorePosts = useCallback(async () => {
    if (!pagination.hasNextPage || loading) return;

    try {
      setLoading(true);
      const nextPage = pagination.page + 1;
      const result = await postService.getPosts(
        {
          page: nextPage,
          limit: pagination.limit,
        },
        customer?.id
      );

      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setPagination({
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.hasNextPage,
      });
    } catch {
      showErrorToast("No se pudieron cargar más publicaciones");
    } finally {
      setLoading(false);
    }
  }, [pagination, loading, showErrorToast, customer?.id]);

  /**
   * Refresca las publicaciones
   */
  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts({ page: 1, limit: pagination.limit });
    setRefreshing(false);
  }, [fetchPosts, pagination.limit]);

  /**
   * Obtiene una publicación por su ID
   */
  const fetchPostById = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const result = await postService.getPostById(id, customer?.id);
        setPost(result);
        return result;
      } catch {
        showErrorToast("No se pudo cargar la publicación");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, customer?.id]
  );

  /**
   * Obtiene los comentarios de una publicación
   */
  const fetchCommentsByPostId = useCallback(
    async (postId: string, params: PaginationParams = {}) => {
      try {
        setLoading(true);
        const result = await postService.getCommentsByPostId(
          postId,
          params,
          customer?.id
        );
        setComments(result.comments);
        setCommentsPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.hasNextPage,
        });
        return result;
      } catch {
        showErrorToast("No se pudieron cargar los comentarios");
        return {
          comments: [],
          pagination: { page: 1, limit: 10, totalPages: 0, hasNextPage: false },
        };
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, customer?.id]
  );

  /**
   * Carga más comentarios (paginación)
   */
  const loadMoreComments = useCallback(
    async (postId: string) => {
      if (!commentsPagination.hasNextPage || loading) return;

      try {
        setLoading(true);
        const nextPage = commentsPagination.page + 1;
        const result = await postService.getCommentsByPostId(
          postId,
          {
            page: nextPage,
            limit: commentsPagination.limit,
          },
          customer?.id
        );

        setComments((prevComments) => [...prevComments, ...result.comments]);
        setCommentsPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalPages: result.pagination.totalPages,
          hasNextPage: result.pagination.hasNextPage,
        });
      } catch {
        showErrorToast("No se pudieron cargar más comentarios");
      } finally {
        setLoading(false);
      }
    },
    [commentsPagination, loading, showErrorToast, customer?.id]
  );

  /**
   * Crea una nueva publicación
   */
  const createPost = useCallback(
    async (data: {
      contenido: string;
      media?: {
        archivo: string;
        tipo: "imagen" | "video";
        descripcion?: string;
      }[];
      externalMedia?: ExternalMediaItem[];
      tags?: string[];
    }) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para crear una publicación");
        return null;
      }

      try {
        setLoading(true);
        
        // Enviamos los datos directamente al servicio
        // El servicio ya se encarga de transformar los tags al formato correcto
        const result = await postService.createPost(data, customer.id);
        setPosts((prevPosts) => [result, ...prevPosts]);
        showSuccessToast("Publicación creada correctamente");
        return result;
      } catch (error) {
        console.error("Error al crear la publicación:", error);
        showErrorToast("No se pudo crear la publicación");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, showSuccessToast, customer?.id]
  );

  /**
   * Crea un nuevo comentario
   */
  const createComment = useCallback(
    async (data: { postId: string; contenido: string }) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para comentar");
        return null;
      }

      try {
        setLoading(true);
        const result = await postService.createComment(data, customer.id);
        setComments((prevComments) => [result, ...prevComments]);

        // Si estamos viendo un post específico, actualizamos su contador de comentarios
        if (post && post.id === data.postId) {
          setPost({
            ...post,
            // No tenemos un contador de comentarios en el modelo, pero podríamos añadirlo
          });
        }

        showSuccessToast("Comentario añadido correctamente");
        return result;
      } catch {
        showErrorToast("No se pudo crear el comentario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [post, showErrorToast, showSuccessToast, customer?.id]
  );

  /**
   * Da like a una publicación
   */
  const likePost = useCallback(
    async (postId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para dar like");
        return false;
      }

      try {
        await postService.likePost(postId, customer.id);

        // Actualizar el estado local
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1, hasLiked: true } : p
          )
        );

        // Si estamos viendo un post específico, actualizamos su contador de likes
        if (post && post.id === postId) {
          setPost({
            ...post,
            likes: post.likes + 1,
            hasLiked: true,
          });
        }

        return true;
      } catch {
        showErrorToast("No se pudo dar like a la publicación");
        return false;
      }
    },
    [post, showErrorToast, customer?.id]
  );

  /**
   * Quita el like de una publicación
   */
  const unlikePost = useCallback(
    async (postId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para quitar el like");
        return false;
      }

      try {
        await postService.unlikePost(postId, customer.id);

        // Actualizar el estado local
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? { ...p, likes: Math.max(0, p.likes - 1), hasLiked: false }
              : p
          )
        );

        // Si estamos viendo un post específico, actualizamos su contador de likes
        if (post && post.id === postId) {
          setPost({
            ...post,
            likes: Math.max(0, post.likes - 1),
            hasLiked: false,
          });
        }

        return true;
      } catch {
        showErrorToast("No se pudo quitar el like de la publicación");
        return false;
      }
    },
    [post, showErrorToast, customer?.id]
  );

  /**
   * Da like a un comentario
   */
  const likeComment = useCallback(
    async (commentId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para dar like");
        return false;
      }

      try {
        await postService.likeComment(commentId, customer.id);

        // Actualizar el estado local
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === commentId
              ? { ...c, likes: c.likes + 1, hasLiked: true }
              : c
          )
        );

        return true;
      } catch {
        showErrorToast("No se pudo dar like al comentario");
        return false;
      }
    },
    [showErrorToast, customer?.id]
  );

  /**
   * Quita el like de un comentario
   */
  const unlikeComment = useCallback(
    async (commentId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para quitar el like");
        return false;
      }

      try {
        await postService.unlikeComment(commentId, customer.id);

        // Actualizar el estado local
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === commentId
              ? { ...c, likes: Math.max(0, c.likes - 1), hasLiked: false }
              : c
          )
        );

        return true;
      } catch {
        showErrorToast("No se pudo quitar el like del comentario");
        return false;
      }
    },
    [showErrorToast, customer?.id]
  );

  /**
   * Elimina una publicación
   */
  const deletePost = useCallback(
    async (postId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para eliminar una publicación");
        return false;
      }

      try {
        setLoading(true);
        
        // Primero obtenemos el post para extraer los IDs de Cloudinary
        const postToDelete = posts.find(p => p.id === postId) || 
                            (post && post.id === postId ? post : null);
        
        if (postToDelete && postToDelete.media && postToDelete.media.length > 0) {
          try {
            // Extraer los publicIds de Cloudinary
            const publicIds = postToDelete.media
              .filter(item => item.descripcion)
              .map(item => item.descripcion as string);
            
            if (publicIds.length > 0) {
              // Eliminar los archivos de Cloudinary en segundo plano
              mediaService.deleteMultipleFromCloudinary(publicIds)
                .then(result => {
                  if (result.failed.length > 0) {
                    console.warn('No se pudieron eliminar algunos archivos de Cloudinary:', result.failed);
                  }
                })
                .catch(error => {
                  console.error('Error al eliminar archivos de Cloudinary:', error);
                });
            }
          } catch (cloudinaryError) {
            // Si falla la eliminación de Cloudinary, solo lo registramos pero continuamos con la eliminación del post
            console.error('Error al procesar archivos de Cloudinary:', cloudinaryError);
          }
        }
        
        // Eliminar el post del CMS
        await postService.deletePost(postId);

        // Actualizar el estado local
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));

        showSuccessToast("Publicación eliminada correctamente");
        return true;
      } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        showErrorToast("No se pudo eliminar la publicación");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, showSuccessToast, customer?.id, posts, post]
  );

  /**
   * Elimina un comentario
   */
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!customer?.id) {
        showErrorToast("Debes iniciar sesión para eliminar un comentario");
        return false;
      }

      try {
        setLoading(true);
        await postService.deleteComment(commentId);

        // Actualizar el estado local
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId)
        );

        showSuccessToast("Comentario eliminado correctamente");
        return true;
      } catch {
        showErrorToast("No se pudo eliminar el comentario");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, showSuccessToast, customer?.id]
  );

  return {
    loading,
    refreshing,
    posts,
    post,
    comments,
    pagination,
    commentsPagination,
    fetchPosts,
    loadMorePosts,
    refreshPosts,
    fetchPostById,
    fetchCommentsByPostId,
    loadMoreComments,
    createPost,
    createComment,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    deletePost,
    deleteComment,
  };
}
