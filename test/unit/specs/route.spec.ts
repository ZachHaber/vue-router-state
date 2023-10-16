import { isSameRoute, isIncludedRoute } from '../../../src/util/route'
import { minRoute } from './utils/util'
import 'jasmine'

describe('Route utils', () => {
  describe('isSameRoute', () => {
    it('path', () => {
      const a = minRoute({
        path: '/a',
        hash: '#hi',
        query: { foo: 'bar', arr: [1, 2] as any },
      })
      const b = minRoute({
        path: '/a/', // Allow trailing slash
        hash: '#hi',
        query: { arr: ['1', '2'], foo: 'bar' },
      })
      expect(isSameRoute(a, b)).toBe(true)
    })

    it('name', () => {
      const a = minRoute({
        path: '/abc',
        name: 'a',
        hash: '#hi',
        query: { foo: 'bar', arr: [1, 2] as any },
      })
      const b = minRoute({
        name: 'a',
        hash: '#hi',
        query: { arr: ['1', '2'], foo: 'bar' },
      })
      expect(isSameRoute(a, b)).toBe(true)
    })

    it('nested query', () => {
      const a = minRoute({
        path: '/abc',
        query: { foo: { bar: 'bar' }, arr: [1, 2] } as any,
      })
      const b = minRoute({
        path: '/abc',
        query: { arr: [1, 2], foo: { bar: 'bar' } } as any,
      })
      const c = minRoute({
        path: '/abc',
        query: { arr: [1, 2], foo: { bar: 'not bar' } } as any,
      })
      expect(isSameRoute(a, b)).toBe(true)
      expect(isSameRoute(a, c)).toBe(false)
    })

    it('queries with null values', () => {
      const a = minRoute({
        path: '/abc',
        query: { foo: null },
      })
      const b = minRoute({
        path: '/abc',
        query: { foo: null },
      })
      const c = minRoute({
        path: '/abc',
        query: { foo: 5 } as any,
      })
      expect(() => isSameRoute(a, b)).not.toThrow()
      expect(() => isSameRoute(a, c)).not.toThrow()
      expect(isSameRoute(a, b)).toBe(true)
      expect(isSameRoute(a, c)).toBe(false)
    })

    it('queries with undefined values', () => {
      const a = minRoute({
        path: '/abc',
        query: { a: 'x' },
      })
      const b = minRoute({
        path: '/abc',
        query: { id: undefined } as any,
      })
      const c = minRoute({
        path: '/abc',
        query: {},
      })
      expect(() => isSameRoute(a, b)).not.toThrow()
      expect(() => isSameRoute(a, c)).not.toThrow()
      expect(() => isSameRoute(b, c)).not.toThrow()
      expect(isSameRoute(a, b)).toBe(false)
      expect(isSameRoute(a, c)).toBe(false)
      // NOTE: in reality this should be true but because we check queries as
      // objects, they are different objects. We should check queries as their
      // string representation instead
      expect(isSameRoute(b, c)).toBe(false)
      expect(isSameRoute(c, b)).toBe(false)
    })
  })

  describe('isIncludedRoute', () => {
    it('path', () => {
      const a = minRoute({ path: '/a/b' })
      const b = minRoute({ path: '/a' })
      const c = minRoute({ path: '/a/b/c' })
      const d = minRoute({ path: '/a/b/' })
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(false)
      expect(isIncludedRoute(a, d)).toBe(true)
    })

    it('with hash', () => {
      const a = minRoute({ path: '/a/b', hash: '#a' })
      const b = minRoute({ path: '/a' })
      const c = minRoute({ path: '/a', hash: '#a' })
      const d = minRoute({ path: '/a', hash: '#b' })
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
    })

    it('with query', () => {
      const a = minRoute({ path: '/a/b', query: { foo: 'bar', baz: 'qux' } })
      const b = minRoute({ path: '/a', query: {} })
      const c = minRoute({ path: '/a', query: { foo: 'bar' } })
      const d = minRoute({ path: '/a', query: { foo: 'bar', a: 'b' } })
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
    })

    it('with both', () => {
      const a = minRoute({
        path: '/a/b',
        query: { foo: 'bar', baz: 'qux' },
        hash: '#a',
      })
      const b = minRoute({ path: '/a', query: {} })
      const c = minRoute({ path: '/a', query: { foo: 'bar' } })
      const d = minRoute({ path: '/a', query: { foo: 'bar' }, hash: '#b' })
      const e = minRoute({ path: '/a', query: { a: 'b' }, hash: '#a' })
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
      expect(isIncludedRoute(a, e)).toBe(false)
    })

    it('trailing slash', () => {
      const a = minRoute({ path: '/users' })
      const b = minRoute({ path: '/user' })
      const c = minRoute({ path: '/users/' })
      expect(isIncludedRoute(a, b)).toBe(false)
      expect(isIncludedRoute(a, c)).toBe(true)

      const d = minRoute({ path: '/users/hello/world' })
      const e = minRoute({ path: '/users/hello' })
      const f = minRoute({ path: '/users/hello-world' })
      expect(isIncludedRoute(d, e)).toBe(true)
      expect(isIncludedRoute(d, f)).toBe(false)
    })
  })
})
