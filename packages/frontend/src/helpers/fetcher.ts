import { toast } from "react-toastify";

export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export const mutationFetcher =
  <TArgs>(method: string, operationName: string | null = null) =>
  async (url: string, options?: { arg: TArgs } | null) => {
    let success: boolean;
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: options?.arg && JSON.stringify(options.arg),
      });
      success = response.ok;
    } catch {
      success = false;
    }

    if (success) {
      toast.success(`${operationName ?? "Operation"} successful!`);
    } else {
      toast.error(`${operationName ?? "Operation"} failed!`);
    }

    return { success };
  };
