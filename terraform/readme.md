az login
az login --use-device-code

terraform plan -out miplan.out

terraform plan -out miplan.out -var-file variables.tfvars


terraform apply miplan.out 



terraform apply -destroy -var-file variables.tfvars
  Es mas facil borrar todo que ir a por un solo elemento
terraform destroy -var-file variables.tfvars


IMPORTANTE CORREGIR `whitelisted_ip`, o no se podran crear recursos en el storage container
curl ifconfig.me


resource group
https://learn.microsoft.com/en-us/azure/developer/terraform/create-resource-group?tabs=azure-cli
https://tg4.solutions/how-to-use-terraform-tfvars/

vnet
https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network

storage account
https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account
  account_kind por ejemplo default a storagev2, el mismo que estaba usando ya
    por el contrario, replicacion default es grs, quiero lrs que es la mas barata

  faltan opciones, no he podido configurar `file service > soft delete`, y no me ha dejado configurar cross-tenant replication

las llaves son a nivel de storage account, no container. Y hay que hacerlo a mano

Crear hasta el acr con un primer terraform, luego uno para front y otro back
az login
az acr login -n acresspruebapoc2
az acr repository list -n acresspruebapoc1 (opcional)
docker build -t fullstackpoc-front:1.0.0 .
docker image list (opcional)
docker tag fullstackpoc-front:1.0.0 acresspruebapoc2.azurecr.io/fullstackpoc-front:latest
docker push acresspruebapoc2.azurecr.io/fullstackpoc-front:latest


IMPORTANTE, ACTUALIZAR LOS CREDENCIALES DEL ACR

<!-- terraform plan -out miplan.out -var-file ../terraform/variables.tfvars -->


docker build -t fullstackpoc-back:1.0.0 .
docker tag fullstackpoc-back:1.0.0 acresspruebapoc2.azurecr.io/fullstackpoc-back:latest
docker push acresspruebapoc2.azurecr.io/fullstackpoc-back:latest











az account set --subscription 

az container create --resource-group rg-gb-prueba-poc-1 --name aciesspruebapoc1 --image acresspruebapoc1.azurecr.io/fullstackpoc-front:latest --registry-login-server acresspruebapoc1.azurecr.io --registry-username acresspruebapoc1 --registry-password YMc/9Eb4vd48H2Yc0Mansk9tJKaBjem9 --ports 3000






mongo necesita el connection string, que no puedo automatizar. backend necesita dos "data" del mongo y redis, que solo se tienen depsues de haber montado el mundo. Es mas facil meter las dos cosas en fase-1