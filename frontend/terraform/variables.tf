variable "location" {
  description = "General location for all resources"
}

variable "subscription_id" {
  description = "Subscription under which resources will be billed"
}

variable "tenant_id" {
  description = "Account tenant"
}

# Names
variable "resource_group_name" {
  description = "Under which all elements will be created"
}


# acr 
variable "acr_user" {
  description = "Username to access registry"
}

# frontend
variable "frontend_container_group_name" {
  description = "Where the frontend container will be placed"
}
variable "frontend_container_name" {
  description = "Running frontend image"
}
variable "frontend_image" {
  description = "Registry and name of image with frontend files"
}

# backend
variable "backend_address" {
  description = "Where to connect to access the api"
}
variable "backend_container_group_name" {
  description = "Name to search for to find the backend container group"
}

variable "cors_origin_to_allow"{
  description = "IP from which cors is allowed"
}