export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function keysToCamel<T = any>(obj: any): T {
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key)
      result[camelKey] = keysToCamel(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

export function keysToSnake<T = any>(obj: any): T {
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = toSnakeCase(key)
      result[snakeKey] = keysToSnake(obj[key])
      return result
    }, {} as any)
  }
  return obj
}
