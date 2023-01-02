output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "virtual_network_name" {
  value = azurerm_virtual_network.vnet.name
}

output "storage_account_name" {
  value = azurerm_storage_account.sa.name
}

output "storage_container_name" {
  value = azurerm_storage_container.sc.name
}

output "container_registry_name" {
  value = azurerm_container_registry.acr.name
}



output "cosmodb_account_name" {
  value = azurerm_cosmosdb_account.db_account.name
}

output "redis_name" {
  value = azurerm_redis_cache.redis.name
}
