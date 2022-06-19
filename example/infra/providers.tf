provider "aws" {
  profile = "default"
  region  = "eu-west-1"

  default_tags {
    tags = {
      source = "esbuild-cf-functions-plugin"
    }
  }
}
