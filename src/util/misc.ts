export function extend<A, B>(a: A, b: B): A & B {
  let aVal = a as A & B
  for (const key in b) {
    aVal[key] = b[key] as any
  }
  return aVal
}

export function isPromiseLike(
  promiseLike: unknown,
): promiseLike is PromiseLike<any> {
  if (
    promiseLike &&
    typeof promiseLike === 'object' &&
    'then' in promiseLike &&
    typeof promiseLike.then === 'function'
  ) {
    return true
  }
  return false
}
