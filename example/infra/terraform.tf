terraform {
  required_version = "1.8.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.49.0"
    }
  }

  backend "s3" {
    bucket = "bq-terraform-state"
    key    = "cf-function-example.tfstate"
    region = "eu-west-1"
  }
}
