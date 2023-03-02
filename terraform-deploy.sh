#!/bin/bash
# hacer login a mano
# az login --use-device-code
# systemctl start docker

if [ $# -ne 1 ]; then
  echo "Use: $ terraform-deploy.sh <ACR_NAME>"
  exit
else 
  ACR_NAME=$1
fi;

# cd terraform
# terraform plan -out miplan.out -var-file variables.tfvars
# terraform apply miplan.out 

# az acr login -n ACR_NAME

# cd ../backend
# docker build -t fullstackpoc-back:1.0.0 .
# docker tag fullstackpoc-back:1.0.0 ACR_NAME.azurecr.io/fullstackpoc-back:latest
# docker push ACR_NAME.azurecr.io/fullstackpoc-back:latest

# cd terraform
# # pwd
# terraform plan -out miplan.out -var-file variables.tfvars
# terraform apply miplan.out 

# cd ../../frontend
# docker build -t fullstackpoc-front:1.0.0 .
# docker tag fullstackpoc-front:1.0.0 ACR_NAME.azurecr.io/fullstackpoc-front:latest
# docker push ACR_NAME.azurecr.io/fullstackpoc-front:latest

# cd terraform
# # pwd
# terraform plan -out miplan.out -var-file variables.tfvars
# terraform apply miplan.out 

# There are naming conventions for variables in shell scripts. By convention, Unix shell variables will have their names in uppercase
# pasar los valores por args al lanzar el script, ponerlo en el readme con <param> 

function tf_deploy () {
  cd $1; pwd
  terraform init
  terraform plan -out myplan.out -var-file variables.tfvars
  terraform apply myplan.out
  cd -
}

function docker_push (){
  cd $1; pwd
  docker build -t "fullstackpoc-$2:1.0.0" .
  docker tag "fullstackpoc-$2:1.0.0" "$ACR_NAME.azurecr.io/fullstackpoc-$2:latest"
  docker push "$ACR_NAME.azurecr.io/fullstackpoc-$2:latest"
  cd -
}

# base
tf_deploy "terraform"
az acr login -n $ACR_NAME
# backend
docker_push "backend" "back"
tf_deploy "backend/terraform"
# frontend
docker_push "frontend" "front"
tf_deploy "frontend/terraform"
