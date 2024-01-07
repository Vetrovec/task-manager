import { useSearchParams } from "next/navigation";

export function useSearchParamsSafe<T extends string>(
  params: T[],
): Record<T, string> {
  const searchParams = useSearchParams();

  const result = {} as Record<T, string>;
  params.forEach((param) => {
    const value = searchParams.get(param);
    if (!value) {
      throw new Error(`Missing search param '${param}'`);
    }
    result[param] = value;
  });

  return result;
}
