import { useEffect, useState, useCallback } from 'react';
import { Image } from 'react-native';

interface ImageCache {
  [key: string]: boolean;
}

class ImageCacheManager {
  private cache: ImageCache = {};
  private prefetchQueue: string[] = [];
  private isProcessing = false;

  async prefetch(uri: string): Promise<boolean> {
    if (this.cache[uri]) {
      return true;
    }

    try {
      await Image.prefetch(uri);
      this.cache[uri] = true;
      return true;
    } catch (error) {
      console.warn('Failed to prefetch image:', uri, error);
      return false;
    }
  }

  async prefetchBatch(uris: string[]): Promise<void> {
    if (this.isProcessing) {
      this.prefetchQueue.push(...uris);
      return;
    }

    this.isProcessing = true;
    const uniqueUris = [...new Set([...this.prefetchQueue, ...uris])];
    this.prefetchQueue = [];

    const batches = this.chunkArray(uniqueUris, 3);
    
    for (const batch of batches) {
      await Promise.allSettled(
        batch.map(uri => this.prefetch(uri))
      );
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;

    if (this.prefetchQueue.length > 0) {
      const remaining = [...this.prefetchQueue];
      this.prefetchQueue = [];
      this.prefetchBatch(remaining);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  isCached(uri: string): boolean {
    return this.cache[uri] || false;
  }

  clearCache(): void {
    this.cache = {};
  }
}

const imageCacheManager = new ImageCacheManager();

export const useImageOptimization = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const prefetchImages = useCallback(async (imageUris: string[]) => {
    await imageCacheManager.prefetchBatch(imageUris);
    setLoadedImages(prev => new Set([...prev, ...imageUris]));
  }, []);

  const prefetchImage = useCallback(async (imageUri: string) => {
    const success = await imageCacheManager.prefetch(imageUri);
    if (success) {
      setLoadedImages(prev => new Set([...prev, imageUri]));
    }
  }, []);

  const isImageLoaded = useCallback((uri: string) => {
    return loadedImages.has(uri) || imageCacheManager.isCached(uri);
  }, [loadedImages]);

  const clearImageCache = useCallback(() => {
    imageCacheManager.clearCache();
    setLoadedImages(new Set());
  }, []);

  return {
    prefetchImages,
    prefetchImage,
    isImageLoaded,
    clearImageCache,
  };
};

export const useImagePreloader = (imageUris: string[], immediate = true) => {
  const { prefetchImages, isImageLoaded } = useImageOptimization();
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedCount, setPreloadedCount] = useState(0);

  useEffect(() => {
    if (!immediate || imageUris.length === 0) return;

    const preload = async () => {
      setIsPreloading(true);
      await prefetchImages(imageUris);
      setPreloadedCount(imageUris.filter(uri => isImageLoaded(uri)).length);
      setIsPreloading(false);
    };

    preload();
  }, [imageUris, immediate, prefetchImages, isImageLoaded]);

  const preloadProgress = imageUris.length > 0 ? preloadedCount / imageUris.length : 0;

  return {
    isPreloading,
    preloadProgress,
    preloadedCount,
    totalImages: imageUris.length,
  };
}; 