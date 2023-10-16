/* @flow */

import type VueRouter from '../router'
import { assert } from './warn'
import { getStateKey, setStateKey, stateKeyKey } from './state-key'
import { extend, isPromiseLike } from './misc'
import type { Route } from './route'

export type Position = { x: number; y: number }
export type PositionResult =
  | Position
  | { selector: string; offset?: Position; behavior?: ScrollBehavior }
  | void

const positionStore: Record<string, Position> = Object.create(null)

export function setupScroll() {
  // Prevent browser scroll behavior on History popstate
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
  // window.location.protocol + '//' + window.location.host
  // location.host contains the port and location.hostname doesn't
  const protocolAndPath = window.location.protocol + '//' + window.location.host
  const absolutePath = window.location.href.replace(protocolAndPath, '')
  // preserve existing history state as it could be overriden by the user
  const stateCopy = extend({}, window.history.state)
  stateCopy[stateKeyKey] = getStateKey()
  window.history.replaceState(stateCopy, '', absolutePath)
  window.addEventListener('popstate', handlePopState)
  return () => {
    window.removeEventListener('popstate', handlePopState)
  }
}

export function handleScroll(
  router: VueRouter,
  to: Route,
  from: Route,
  isPop: boolean,
) {
  if (!router.app) {
    return
  }

  const behavior = router.options.scrollBehavior
  if (!behavior) {
    return
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', `scrollBehavior must be a function`)
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(() => {
    const position = getScrollPosition()
    const shouldScroll = behavior.call(
      router,
      to,
      from,
      isPop ? position : undefined,
    )

    if (!shouldScroll) {
      return
    }

    if (isPromiseLike(shouldScroll)) {
      shouldScroll
        .then((shouldScroll) => {
          scrollToPosition(shouldScroll, position)
        })
        .catch((err) => {
          // @ts-ignore
          if (process.env.NODE_ENV !== 'production') {
            assert(false, err.toString())
          }
        })
    } else {
      scrollToPosition(shouldScroll, position)
    }
  })
}

export function saveScrollPosition() {
  const key = getStateKey()
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset,
    }
  }
}

function handlePopState(e: PopStateEvent) {
  saveScrollPosition()
  if (e.state && e.state[stateKeyKey]) {
    setStateKey(e.state[stateKeyKey])
  }
}

function getScrollPosition(): Position | undefined {
  const key = getStateKey()
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition(el: Element, offset: Position): Position {
  const docEl: any = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y,
  }
}

function isValidPosition(obj: Object): obj is Position {
  return isNumber((obj as any).x) || isNumber((obj as any).y)
}

function normalizePosition(obj: Position): Position {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset,
  }
}

function normalizeOffset(obj: Partial<Position>): Position {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0,
  }
}

function isNumber(v: any): v is number {
  return typeof v === 'number'
}

const hashStartsWithNumberRE = /^#\d/

function scrollToPosition(
  shouldScroll: PositionResult,
  position: Position | undefined,
) {
  const isObject = typeof shouldScroll === 'object'
  let behavior: ScrollBehavior | undefined
  if (
    isObject &&
    'selector' in shouldScroll &&
    typeof shouldScroll.selector === 'string'
  ) {
    behavior = shouldScroll.behavior
    // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
    // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
    const el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
      ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
      : document.querySelector(shouldScroll.selector)

    if (el) {
      const offset = normalizeOffset(
        shouldScroll.offset && typeof shouldScroll.offset === 'object'
          ? shouldScroll.offset
          : {},
      )
      position = getElementPosition(el, offset)
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll)
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll)
  }

  if (position) {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior,
      })
    } else {
      window.scrollTo(position.x, position.y)
    }
  }
}
