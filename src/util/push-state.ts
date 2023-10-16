import { inBrowser } from './dom'
import { saveScrollPosition } from './scroll'
import { genStateKey, setStateKey, getStateKey, stateKeyKey } from './state-key'
import { extend } from './misc'
import { Dictionary } from '../types/declarations'
import { RawLocation } from './location'

export const supportsPushState =
  inBrowser &&
  (function () {
    const ua = window.navigator.userAgent

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    ) {
      return false
    }

    return window.history && typeof window.history.pushState === 'function'
  })()

export function pushState(
  url?: string,
  replace?: boolean,
  state?: Dictionary<any>,
) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    const stateCopy = extend({}, state || (replace ? history.state : {}))
    if (replace) {
      // preserve existing history state as it could be overriden by the user
      // If passed in, use the new state entirely rather than the old.
      stateCopy[stateKeyKey] = getStateKey()
      history.replaceState(stateCopy, '', url)
    } else {
      stateCopy[stateKeyKey] = setStateKey(genStateKey())
      history.pushState(stateCopy, '', url)
    }
  } catch (e) {
    if (url) {
      window.location[replace ? 'replace' : 'assign'](url)
    }
  }
}

export function replaceState(url?: string, state?: Dictionary<any>) {
  pushState(url, true, state)
}

export function getLocationState(location: RawLocation) {
  if (typeof location === 'string') {
    return undefined
  }
  return location.state
}
export function stripStateKey(state?: Dictionary<any>) {
  if (!state || !state[stateKeyKey]) {
    return
  }
  const copy = extend({}, state)
  delete copy[stateKeyKey]
  return copy
}
