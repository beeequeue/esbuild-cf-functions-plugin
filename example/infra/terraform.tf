terraform {
  required_version = "1.3.8"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.54.0"
    }
  }

  backend "s3" {
    bucket         = "bq-terraform-state"
    key            = "cf-function-example.tfstate"
    region         = "eu-west-1"
  }
}
