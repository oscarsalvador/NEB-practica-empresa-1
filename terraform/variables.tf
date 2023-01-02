variable "location" {
  description = "General location for all resources"
}
variable "subscription_id" {
  description = "Subscription under which resources will be billed"
}
variable "tenant_id" {
  description = "Account tenant"
}
variable "whitelisted_ip" {
  description = "IP(s) allowed to access services"
}


variable "resource_group_name" {
  description = "Under which all elements will be created"
}
variable "virtual_network_name" {
  description = "Within which elements will be accessible"
}
variable "container_registry_name" {
  description = "Registry to which images will be uploaded"
}

# storage
variable "storage_account_name" {
  description = "Storage account for the container with the blobs"
}
variable "storage_container_name" {
  description = "Container where the images will be saved as blobs"
}
variable "frontend_container_group_name" {
  description = "Frontend container group name, part of its fqdn, needed to allow in CORS config"
  
}

# mongo
variable "cosmos_db_account_name" {
  description = "Name for the account within which the instance of azure's mongo compatible db will be created"
}
variable "mongo_db_name" {
  description = "Name for the mongo database"
}

# redis
variable "redis_db_name" {
  description = "Name for the instance of redis, used for session tokens"
}

