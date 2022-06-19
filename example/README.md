# Redirect example

This example shows a set up where a TypeScript function is build and deployed to CloudFront Functions via Terraform!

The function does one thing: if the path starts with `/foo*` it will redirect it to `/bar*`.

This can be tested by visiting the URL below and seeing the path change from `/foo/nebula.webp` to `/bar/nebula.webp`!

https://d31lz94z7iimag.cloudfront.net/foo/nebula.webp
