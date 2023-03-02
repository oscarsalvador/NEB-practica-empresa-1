variable "location" {
  description = "General location for all resources"
}
variable "subscription_id" {
  description = "Subscription under which resources will be billed"
  sensitive = true

}
variable "tenant_id" {
  description = "Account tenant"
  sensitive = true
}


variable "resource_group_name" {
  description = "Under which all elements will be created"
}


# storage account
variable "storage_account_name" {
  description = "Storage account for the container with the blobs"
}
variable "storage_container_name" {
  description = "Container where the images will be saved as blobs"
}


# acr 
variable "acr_name" {
  description = "Name of the container image registry"
}


# backend
variable "backend_container_group_name" {
  description = "Where the backend container will be placed"
}
variable "backend_container_name" {
  description = "Running backend image"
}
variable "backend_image" {
  description = "Registry and name of image with backend files"
}


# mongo
# variable "cosmosdb_connection_string" {
#   description = "Connection string to access the mongo instance"
# }
variable "cosmos_db_account_name" {
  description = "Name for the account within which the instance of azure's mongo compatible db will be created"
}
# variable "mongo_db_name" {
#   description = "Name for the mongo database"
# }

# redis
variable "redis_db_name" {
  description = "Name for the instance of redis, used for session tokens"
}