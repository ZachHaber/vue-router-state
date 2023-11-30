> This is vue-router-2-state which works only with Vue 2.0.
>
> - For Vue Router 4 (for Vue 3) see [vuejs/router](https://github.com/vuejs/router).

---

## Getting Started

Install using
```bash
npm install vue-router-2-state
# OR
yarn add vue-router-2-state
```

Get started with the [documentation](http://v3.router.vuejs.org), or play with the [examples](https://github.com/ZachHaber/vue-router-state/tree/dev/examples) (see how to run them below).

## Type Issues

Vue 2 has unfortunate [type issues](https://github.com/vuejs/vue/pull/13107) when using `moduleResolution: bundler` or `moduleResolution: nodenext` which causes a lot of vue-2 libraries to lose type information.

To fix it, as with that PR, change line 33 of vue's `package.json` file using [patch-package](https://github.com/ds300/patch-package) with `--exclude //` option to avoid excluding the package.json which it does by default:

```diff
-     "./types/*": "./types/*",
+     "./types/*": ["./types/*.d.ts", "./types/*"],
```

This library is set up so that it works around this fix at the cost of slightly more complex resolutions once the fix is actually merged in (or you patch the file on your end), but it shouldn't affect much.

### Development Setup

```bash
# install deps
yarn

# build dist files
yarn build

# serve examples at localhost:8080
yarn dev

# lint & run all tests
yarn test

# serve docs at localhost:8080
yarn docs
```

## Releasing

- `yarn run release` which does the following:
  - Ensure tests are passing `yarn run test`
  - Build dist files `VERSION=<the_version> yarn run build`
  - Build changelog `yarn run changelog`
  - Commit dist files `git add dist CHANGELOG.md && git commit -m "[build $VERSION]"`
  - Publish a new version `npm version $VERSION --message "[release] $VERSION"
  - Push tags `git push origin refs/tags/v$VERSION && git push`
  - Publish to npm `npm publish`

## Issues

Please make sure to read the [Issue Reporting Checklist](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Contribution

Please make sure to read the [Contributing Guide](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md) before making a pull request.

## Changelog

Details changes for each release are documented in the [`CHANGELOG.md file`](https://github.com/ZachHaber/vue-router-state/blob/dev/CHANGELOG.md).

## License

[MIT](http://opensource.org/licenses/MIT)
