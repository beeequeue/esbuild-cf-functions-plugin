import crypto from "crypto"

import type { CloudFrontFunctionsEvent } from "aws-lambda"

type Response = CloudFrontFunctionsEvent["request"] | CloudFrontFunctionsEvent["response"]

type Redirect = {
  from: RegExp
  to: string
}

var redirects: Redirect[] = [
  {
    from: /\/foo(\/.*)?$/,
    to: "/bar$1",
  },
]

function handler(event: CloudFrontFunctionsEvent): Response {
  var request = event.request

  var hasher = crypto.createHash("sha1")
  hasher.update(request.uri)

  var match = redirects.find((redirect) => redirect.from.test(request.uri))
  if (match) {
    return {
      statusCode: 302,
      statusDescription: "Found",
      cookies: {},
      headers: {
        location: {
          value: `${request.uri.replace(match.from, match.to)}?hash=${hasher.digest(
            "hex",
          )}`,
        },
      },
    }
  }

  return request
}
