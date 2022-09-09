terraform {
  required_version = "1.2.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.30.0"
    }
  }

  backend "s3" {
    bucket         = "bq-terraform-state"
    key            = "cf-function-example.tfstate"
    region         = "eu-west-1"
  }
}
