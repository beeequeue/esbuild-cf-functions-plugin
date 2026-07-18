# esbuild-cf-functions-plugin

## 2.0.0

### Major Changes

- [`16b588f`](https://github.com/beeequeue/esbuild-cf-functions-plugin/commit/16b588f485efa03b9d4462e4d2ae4cca8b63ce02) Thanks [@beeequeue](https://github.com/beeequeue)! - Package is now ESM-only and requires Node 20.19+ to import with `require`

## 1.1.2

### Patch Changes

- [`0a9cc02`](https://github.com/beeequeue/esbuild-cf-functions-plugin/commit/0a9cc02ee68ea96dcf827df86e457fb8a3bfa9c8) Thanks [@beeequeue](https://github.com/beeequeue)! - Removed `src` from published package, added CHANGELOG.md

## 1.1.1

### Patch Changes

- [#205](https://github.com/beeequeue/esbuild-cf-functions-plugin/pull/205) [`3a8b5aa`](https://github.com/beeequeue/esbuild-cf-functions-plugin/commit/3a8b5aa6fb0bfbecec2e44602eb607a0cf663a20) Thanks [@beeequeue](https://github.com/beeequeue)! - Improved pkg.json `exports`

## 1.1.0

### Minor Changes

- [#154](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/pull/154) [`a334de0`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/a334de0f207f6bfc6df3b7d1f52cfb67d629f71a) Thanks [@erikfried](https://github.com/erikfried)! - Added support for the Cloudfront Function 2.0 runtime

## 1.0.0

### Major Changes

- [#130](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/pull/130) [`ff66646`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/ff666461fa95f2554fd2d0d5a7c922e8cdcead2a) - Dropped node versions <17, now requires 18+.

## 0.2.2

### Patch Changes

- [`fb624de`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/fb624de5ca30bafcbf8056435169a8ec9690fdd9) - Relaxed esbuild version restriction to >=0.14.46

## 0.2.1

### Patch Changes

- [#65](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/pull/65) [`7c672fe`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/7c672fefd3e70f05b2a58dea1736f52364b7dab3) Thanks [@renovate](https://github.com/apps/renovate)! - Added esbuild@^0.15 to allowed peer dependencies.

## 0.2.0

### Minor Changes

- [`f8aa40b`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/f8aa40b9318e070ed497c1d2cb0e3e10af647357) - Added warning about various configuration options

## 0.1.2

### Patch Changes

- [`a727853`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/a72785397f7b113794c7d5bdfeb183026cf16f41) - Removed unused files from published .zip

## 0.1.1

### Patch Changes

- [`98f4bde`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/98f4bde5e097a6e83cf39a7e90b265bd045367d0) - Changed the output format to ES modules.

  This should always result in smaller output file sizes!

  For example, the example function went from `1.3kb` to `0.45kb`!

## 0.1.0

### Minor Changes

- [`f8ba17f`](https://github.com/BeeeQueue/esbuild-cf-functions-plugin/commit/f8ba17f8d9ea7fb31e8e9306fbbcdb54c13a3117) - Initial release
