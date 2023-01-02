terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.0.0"
    }
  }
}

provider "azurerm" {
  features {}

  # project         = var.project
  # location        = var.location
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}

