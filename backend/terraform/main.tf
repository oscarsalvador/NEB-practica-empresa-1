data "azurerm_redis_cache" "redis" {
  name = var.redis_db_name
  resource_group_name = var.resource_group_name
}

data "azurerm_storage_account" "sa" {
  name = var.storage_account_name
  resource_group_name = var.resource_group_name
}

data "azurerm_cosmosdb_account" "db_account" {
  name = var.cosmos_db_account_name
  resource_group_name = var.resource_group_name
}

data "azurerm_container_registry" "acr" {
  name = var.acr_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_container_group" "aci" {
  name = var.backend_container_group_name
  resource_group_name = var.resource_group_name
  location = var.location
  ip_address_type = "Public" #private y accesible por gateway?
  os_type = "Linux"

  exposed_port = [
    {
      port = 4000
      protocol = "TCP"
    }
  ]


  # container {
  #   name = "netdebug"
  #   image = "travelping/nettools"
  #   cpu = 0.5
  #   memory = 1

  #   commands = [ "sleep", "10000" ]
  # }
  
  container {
    name = var.backend_container_name
    image = var.backend_image
    cpu = "0.5"
    memory = "4"
    
    environment_variables = {
      MONGO_URL = "mongodb://${data.azurerm_cosmosdb_account.db_account.name}:${data.azurerm_cosmosdb_account.db_account.primary_key}@${data.azurerm_cosmosdb_account.db_account.name}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cdaesspruebapoc2@"
      REDIS_HOST = data.azurerm_redis_cache.redis.hostname
      REDIS_PORT = 6380
      REDIS_PASS = data.azurerm_redis_cache.redis.primary_access_key
      STORAGE_ACCOUNT_NAME = data.azurerm_storage_account.sa.name
      STORAGE_CONTAINER_NAME = var.storage_container_name
      STORAGE_ACCOUNT_KEY = data.azurerm_storage_account.sa.primary_access_key
    }


    ports {
      port = 4000
      protocol = "TCP"
    }

    liveness_probe {
      http_get {
        path = "/"
        port = 4000
        scheme = "Http"
      }
      period_seconds = 60
      failure_threshold = 20
      timeout_seconds = 50
      initial_delay_seconds = 240
    }

    # readiness_probe {
    #   http_get {
    #     path = "/"
    #     port = 3000
    #     scheme = "Http"
    #   }
    #   period_seconds = 60
    #   failure_threshold = 20
    #   timeout_seconds = 50
    #   initial_delay_seconds = 240 
    # }
  }

  image_registry_credential {
    username = data.azurerm_container_registry.acr.admin_username
    password = data.azurerm_container_registry.acr.admin_password
    server = data.azurerm_container_registry.acr.login_server
  }
}

