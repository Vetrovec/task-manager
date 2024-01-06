export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export const mutationFetcher = (method: string) => async (url: string) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
};
