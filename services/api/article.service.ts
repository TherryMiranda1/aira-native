import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from 'qs-esm';

export interface ArticleFromCMS {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX content as string
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: {
    tag: string;
  }[];
  featured_image?: {
    url: string;
    alt?: string;
  };
  author: {
    name: string;
    bio?: string;
    avatar?: {
      url: string;
    };
  };
  publishedAt?: string;
  reading_time?: number;
  featured: boolean;
  mood_tone: string;
  target_audience: {
    audience: string;
  }[];
  related_articles?: ArticleFromCMS[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX content as string
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featured_image?: {
    url: string;
    alt?: string;
  };
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  publishedAt?: string;
  reading_time?: number;
  featured: boolean;
  mood_tone: string;
  target_audience: string[];
  related_articles?: Article[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const transformArticle = (cmsArticle: ArticleFromCMS): Article => {
  const tags = cmsArticle.tags?.map((tag) => tag.tag) || [];
  const target_audience = cmsArticle.target_audience?.map((audience) => audience.audience) || [];
  const related_articles = cmsArticle.related_articles?.map(transformArticle);

  return {
    id: cmsArticle.id,
    title: cmsArticle.title,
    slug: cmsArticle.slug,
    excerpt: cmsArticle.excerpt,
    content: cmsArticle.content,
    status: cmsArticle.status,
    category: cmsArticle.category,
    tags,
    featured_image: cmsArticle.featured_image,
    author: {
      name: cmsArticle.author.name,
      bio: cmsArticle.author.bio,
      avatar: cmsArticle.author.avatar?.url,
    },
    publishedAt: cmsArticle.publishedAt,
    reading_time: cmsArticle.reading_time,
    featured: cmsArticle.featured,
    mood_tone: cmsArticle.mood_tone,
    target_audience,
    related_articles,
    meta: cmsArticle.meta,
    createdAt: cmsArticle.createdAt,
    updatedAt: cmsArticle.updatedAt,
  };
};

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

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

export const articleService = {
  async getArticles(params: PaginationParams = {}): Promise<{
    articles: Article[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 12, sort = "-publishedAt", where = {} } = params;

      const defaultWhere = {
        status: { equals: 'published' },
        ...where
      };

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
        where: defaultWhere
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ARTICLES}${queryString}`);

      const articles = (response.data.docs || []).map(transformArticle);

      const { docs, ...paginationInfo } = response.data;
      return {
        articles,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      throw error;
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const queryObj = {
        where: {
          slug: { equals: slug },
          status: { equals: 'published' }
        },
        limit: "1"
      };
      
      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ARTICLES}${queryString}`);
      
      if (response.data.docs.length === 0) {
        return null;
      }

      return transformArticle(response.data.docs[0]);
    } catch (error) {
      console.error(`Failed to fetch article with slug ${slug}:`, error);
      return null;
    }
  },

  async getFeaturedArticles(limit: number = 6): Promise<Article[]> {
    try {
      const { articles } = await this.getArticles({
        limit,
        where: {
          featured: { equals: true }
        },
        sort: "-publishedAt"
      });

      return articles;
    } catch (error) {
      console.error("Failed to fetch featured articles:", error);
      return [];
    }
  },

  async getArticlesByCategory(category: string, limit: number = 10): Promise<Article[]> {
    try {
      const { articles } = await this.getArticles({
        limit,
        where: {
          category: { equals: category }
        },
        sort: "-publishedAt"
      });

      return articles;
    } catch (error) {
      console.error(`Failed to fetch articles for category ${category}:`, error);
      return [];
    }
  },
}; 