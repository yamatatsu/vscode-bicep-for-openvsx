/**
 * Retry a function while a predicate returns true
 * @param func Function to execute
 * @param predicate Predicate to check if retry is needed (true = retry, false = done)
 * @param options Retry options
 * @returns Result of the function
 */
export async function retryWhile<T>(
  func: () => Promise<T>,
  predicate: (result: T) => boolean,
  options?: {
    interval?: number;
    timeout?: number;
  },
): Promise<T> {
  let result = await func();

  const interval = options?.interval ?? 2000;
  const timeout = options?.timeout ?? 10000;
  let count = timeout / interval;

  while (predicate(result)) {
    if (count-- <= 0) {
      throw new Error(`Timeout after ${timeout}ms while retrying operation`);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    result = await func();
  }

  return result;
}

/**
 * Wait until a predicate returns true
 * @param predicate Predicate to check
 * @param options Retry options
 */
export async function until(
  predicate: () => boolean,
  options?: {
    interval?: number;
    timeout?: number;
  },
): Promise<void> {
  await retryWhile(
    async () => void 0,
    () => !predicate(),
    options,
  );
}
