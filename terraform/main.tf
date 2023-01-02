resource "azurerm_resource_group" "rg" {
  name = var.resource_group_name
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name = var.virtual_network_name
  resource_group_name = azurerm_resource_group.rg.name
  location = var.location
  address_space = ["10.0.0.0/27"]

}

resource "azurerm_storage_account" "sa" {
  name = var.storage_account_name
  resource_group_name = azurerm_resource_group.rg.name
  location = var.location
  account_tier = "Standard"
  account_replication_type = "LRS"

  # network_rules {
  #   default_action = "Deny"
  #   ip_rules = var.whitelisted_ip
  # }

  blob_properties {
    # cors_rule {
    #   allowed_origins = ["*"]
    #   allowed_methods = ["DELETE", "GET", "HEAD", "MERGE", "POST", "OPTIONS", "PUT", "PATCH"]
    #   allowed_headers = ["*"]
    #   exposed_headers = ["*"]
    #   max_age_in_seconds = 86400
    # }
    cors_rule {
      allowed_origins = ["http://${var.frontend_container_group_name}.${var.location}.azurecontainer.io:3000"]
      allowed_methods = ["GET", "HEAD", "POST", "OPTIONS", "PUT"]
      allowed_headers = ["x-ms-blob-type", "access-control-allow-origin", "vary"]
      exposed_headers = ["x-ms-blob-type", "access-control-allow-origin", "vary"]
      max_age_in_seconds = 86400
    }
  }
}

resource "azurerm_storage_container" "sc" {
  name = var.storage_container_name
  storage_account_name = azurerm_storage_account.sa.name
  container_access_type = "blob"
  depends_on = [azurerm_storage_account.sa]
}

resource "azurerm_container_registry" "acr" {
  name = var.container_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  location = var.location
  sku = "Basic"
  admin_enabled = true
}


resource "azurerm_cosmosdb_account" "db_account" {
  name = var.cosmos_db_account_name
  resource_group_name = azurerm_resource_group.rg.name
  location = var.location
  offer_type = "Standard"
  kind = "MongoDB"
  enable_automatic_failover = false

  geo_location {
    location = var.location
    failover_priority = 0
  }

  consistency_policy {
    consistency_level = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix = 100000
  }
}

resource "azurerm_redis_cache" "redis" {
  name = var.redis_db_name
  resource_group_name = azurerm_resource_group.rg.name
  location = var.location
  capacity = 1
  family = "C"
  sku_name = "Basic"
  # enable_non_ssl_port = false

  redis_configuration {
    # enable_authentication = false
  }
}