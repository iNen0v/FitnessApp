export async function fetchApi(endpoint: string, options?: RequestInit) {
    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
        });
    }