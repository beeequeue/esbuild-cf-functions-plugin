import type { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda"

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
export var handler = (event: CloudFrontRequestEvent): CloudFrontRequestResult => {
  var request = event.Records[0].cf.request

  // eslint-disable-next-line @typescript-eslint/no-shadow
  var redirect = redirects.find((redirect) => redirect.from.test(request.uri))
  if (redirect) {
    return {
      status: "302",
      headers: {
        location: [{ value: request.uri.replace(redirect.from, redirect.to) }],
      },
    }
  }

  return request
}
