terraform {
  required_version = "1.11.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.89.0"
    }
  }

  backend "s3" {
    bucket = "bq-terraform-state"
    key    = "cf-function-example.tfstate"
    region = "eu-west-1"
  }
}
