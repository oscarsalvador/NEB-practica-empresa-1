# Requisitos
- Cuenta de azure
- `az-cli`
- `docker`
- `terraform`


# Terraform
> az login

Partiendo en cada caso de la raiz del proyecto:


## Despliegue de la infraestructura principal
> cd terraform 

Cambiar el nombre del archivo `examplevariables.tfvars` a `variables.tfvars` y rellenarlo

> terraform -out miplan.out -var-file variables.tfvars

> terraform apply miplan.out


## Comun para los dos contenedores
> az acr login -n `<acr-name>`

### Desplegar el backend
> cd backend

> docker build -t fullstackpoc-back:1.0.0 .

> docker tag fullstackpoc-back:1.0.0 `<acr-name>`.azurecr.io/fullstackpoc-back:latest

> docker push `<acr-name>`.azurecr.io/fullstackpoc-back:latest

> cd terraform

Cambiar el nombre del archivo `examplevariables.tfvars` a `variables.tfvars` y rellenarlo. La variable `whitelisted_ip` deberia tener las IPs de todos los que tengan que acceder por el frontend. `curl ifconfig.me`

> terraform -out miplan.out -var-file variables.tfvars

> terraform apply miplan.out

### Desplegar el frontend
> cd frontend

> docker build -t fullstackpoc-front:1.0.0 .

> docker tag fullstackpoc-front:1.0.0 `<acr-name>`.azurecr.io/fullstackpoc-front:latest

> docker push `<acr-name>`.azurecr.io/fullstackpoc-front:latest

> cd terraform

Cambiar el nombre del archivo `examplevariables.tfvars` a `variables.tfvars` y rellenarlo

> terraform -out miplan.out -var-file variables.tfvars

> terraform apply miplan.out
