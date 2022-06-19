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

// eslint-disable-next-line @typescript-eslint/require-await
function handler(event: CloudFrontFunctionsEvent): Response {
  var request = event.request

  // eslint-disable-next-line @typescript-eslint/no-shadow
  var redirect = redirects.find((redirect) => redirect.from.test(request.uri))
  if (redirect) {
    return {
      statusCode: 302,
      statusDescription: "Found",
      cookies: {},
      headers: {
        location: { value: request.uri.replace(redirect.from, redirect.to) },
      },
    }
  }

  return request
}
