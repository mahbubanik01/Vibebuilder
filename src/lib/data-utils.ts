/**
 * Data transformation utilities for handling GraphQL responses.
 * Specifically designed to handle the array-wrapped scalar values common in Selise Blocks APIs.
 */

/**
 * Extracts a single scalar value from a potential array of values.
 * Useful for fields like siteName, slug, etc., which might be returned as [value].
 * 
 * @param value The value to normalize
 * @returns The first element if it's an array, otherwise the value itself
 */
export function normalizeScalar<T>(value: T | T[]): T {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Normalizes an entire object by flattening any array-wrapped scalar fields.
 * 
 * @param obj The object to normalize
 * @returns A new object with normalized fields
 */
export function normalizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const normalized: any = {};
  for (const key in obj) {
    normalized[key] = normalizeScalar(obj[key]);
  }
  return normalized;
}

/**
 * Robustly parses a JSON string, returning a default value if parsing fails.
 * 
 * @param str The string to parse
 * @param defaultValue The value to return on failure
 */
export function safeJsonParse<T>(str: any, defaultValue: T): T {
  if (str === null || str === undefined) return defaultValue;
  if (typeof str !== 'string') return str as unknown as T;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('[safeJsonParse] Failed to parse:', str, e);
    return defaultValue;
  }
}

/**
 * Normalizes a list of items from a GraphQL response.
 */
export function normalizeItems<T extends Record<string, any>>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeObject);
}
