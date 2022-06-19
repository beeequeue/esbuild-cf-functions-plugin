resource "aws_s3_bucket" "example" {
  bucket = "bq-cf-functions-example"

}

data "aws_iam_policy_document" "only_cloudfront" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.example.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.example.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.example.id
  policy = data.aws_iam_policy_document.only_cloudfront.json
}

locals {
  s3_origin_id = "bq-cf-functions-example"
}

resource "aws_cloudfront_origin_access_identity" "example" {
  comment = "bq-cf-functions-example"
}

resource "aws_cloudfront_distribution" "example" {
  comment = "Example dist for esbuild-cf-functions-plugin"
  enabled = true

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "allow-all"
    default_ttl            = 0

    forwarded_values {
      query_string = false
      headers      = []

      cookies {
        forward = "none"
      }
    }
  }

  origin {
    origin_id   = local.s3_origin_id
    domain_name = aws_s3_bucket.example.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.example.cloudfront_access_identity_path
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "dist_url" {
  value = aws_cloudfront_distribution.example.domain_name
}
