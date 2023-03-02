# output "resource_group_name" {
#   value = azurerm_resource_group.rg.name
# }

output "frontend_container_group_name" {
  value = "http://${azurerm_container_group.aci.name}.${var.location}.azurecontainer.io:3000"
}

# output "frontend_container_name" {
#   value = azurerm_container_group.aci.container
# }