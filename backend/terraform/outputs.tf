# output "resource_group_name" {
#   value = azurerm_resource_group.rg.name
# }


# output "frontend_container_name" {
#   value = azurerm_container_group.aci.container
# }

# output "cosmodb_account_name" {
#   value = azurerm_cosmosdb_account.db_account.name
# }


# output "mongodb_name" {
#   value = azurerm_cosmosdb_mongo_database.mongo.name
# }

# output "redis_name" {
#   value = azurerm_redis_cache.redis.name
# }

output "backend_container_group_name" {
  value = azurerm_container_group.aci.name
}


