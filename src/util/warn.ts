export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[vue-router] ${message}`)
  }
}

export function warn(
  condition: any,
  message: string,
): condition is NonNullable<typeof condition> {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(`[vue-router] ${message}`)
    return false
  }
  return true
}
