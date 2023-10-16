import { Dictionary } from '../types/declarations'
import { warn } from './warn'

const encodeReserveRE = /[!'()*]/g
const encodeReserveReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
const commaRE = /%2C/g

export type Query = Dictionary<string | null | (string | null)[]>

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = (str: string) =>
  encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ',')

export function decode(str: string) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `Error decoding "${str}". Leaving it intact.`)
    }
  }
  return str
}

export function resolveQuery(
  query?: string | null | undefined,
  extraQuery: Query = {},
  _parseQuery?: Function | null | undefined,
): Query {
  const parse = _parseQuery || parseQuery
  let parsedQuery
  try {
    parsedQuery = parse(query || '')
  } catch (e) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      if (e instanceof Error) {
        warn(false, e.message as string)
      }
    }
    parsedQuery = {}
  }
  for (const key in extraQuery) {
    const value = extraQuery[key]
    parsedQuery[key] = Array.isArray(value)
      ? value.map(castQueryParamValue)
      : castQueryParamValue(value)
  }
  return parsedQuery
}

const castQueryParamValue = (
  value: Dictionary<string> | null | undefined | string,
) => (value == null || typeof value === 'object' ? value : String(value))

function parseQuery(
  query: string,
): Dictionary<string | null | (string | null)[]> {
  const res: Dictionary<string | null | (string | null)[]> = {}

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach((param) => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift()!)
    const val = parts.length > 0 ? decode(parts.join('=')) : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      ;(res[key] as (string | null)[]).push(val)
    } else {
      res[key] = [res[key] as string, val]
    }
  })
  return res
}

export function stringifyQuery(obj: Query): string {
  const res = obj
    ? Object.keys(obj)
        .map((key) => {
          const val = obj[key]

          if (val === undefined) {
            return ''
          }

          if (val === null) {
            return encode(key)
          }

          if (Array.isArray(val)) {
            const result: string[] = []
            val.forEach((val2) => {
              if (val2 === undefined) {
                return
              }
              if (val2 === null) {
                result.push(encode(key))
              } else {
                result.push(encode(key) + '=' + encode(val2))
              }
            })
            return result.join('&')
          }

          return encode(key) + '=' + encode(val)
        })
        .filter((x) => x.length > 0)
        .join('&')
    : null
  return res ? `?${res}` : ''
}
