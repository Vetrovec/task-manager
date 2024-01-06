export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

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
