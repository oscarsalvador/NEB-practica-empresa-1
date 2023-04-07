data "azurerm_container_group" "aci_back" {
  name = var.backend_container_group_name
  resource_group_name = var.resource_group_name
}

data "azurerm_container_registry" "acr" {
  name = var.acr_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_container_group" "aci" {
  name = var.frontend_container_group_name
  resource_group_name = var.resource_group_name
  location = var.location
  ip_address_type = "Public" #private y accesible por gateway?
  os_type = "Linux"
  dns_name_label = var.frontend_container_group_name

  
  exposed_port = [
    {
      port=3000
      protocol="TCP"
    }
  ]
  
  container {
    name = var.frontend_container_name
    image = var.frontend_image
    cpu = "0.5"
    memory = "4"

    environment_variables = {
      REACT_APP_API_URL = "http://${data.azurerm_container_group.aci_back.ip_address}:4000"
      REACT_APP_CORS_ORIGIN_TO_ALLOW = "http://${var.frontend_container_group_name}.${var.location}.azurecontainer.io:3000"
    }

    ports {
      port = 3000
      protocol = "TCP"
    }

    liveness_probe {
      http_get {
        path = "/"
        port = 3000
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