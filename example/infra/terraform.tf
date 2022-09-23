terraform {
  required_version = "1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.32.0"
    }
  }

  backend "s3" {
    bucket         = "bq-terraform-state"
    key            = "cf-function-example.tfstate"
    region         = "eu-west-1"
  }
}
