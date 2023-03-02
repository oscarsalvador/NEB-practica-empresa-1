#!/bin/bash
# systemctl start docker
# az login --use-device-code

if [ $# -ne 1 ]; then
  echo "Use: $ terraform-deploy.sh <ACR_NAME>"
  exit
else 
  ACR_NAME=$1
fi;

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
