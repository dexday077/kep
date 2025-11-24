'use client';

/**
 * Fetch a random Unsplash image for a given query. Falls back to the provided URL if
 * no access key is configured or the request fails.
 */
export async function fetchUnsplashImage(
  query: string,
  fallbackUrl: string,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape',
): Promise<string> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return fallbackUrl;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}&client_id=${accessKey}`,
      {
        headers: {
          'Accept-Version': 'v1',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return fallbackUrl;
    }

    const data = await response.json();
    return data?.urls?.regular ?? fallbackUrl;
  } catch (error) {
    console.warn('Unsplash image fetch failed:', error);
    return fallbackUrl;
  }
}
