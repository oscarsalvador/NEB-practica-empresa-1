#!/bin/bash
# hacer login a mano
# az login --use-device-code
# systemctl start docker

cd terraform
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 

az acr login -n ACR_NAME

cd ../backend
docker build -t fullstackpoc-back:1.0.0 .
docker tag fullstackpoc-back:1.0.0 ACR_NAME.azurecr.io/fullstackpoc-back:latest
docker push ACR_NAME.azurecr.io/fullstackpoc-back:latest

cd terraform
# pwd
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 

cd ../../frontend
docker build -t fullstackpoc-front:1.0.0 .
docker tag fullstackpoc-front:1.0.0 ACR_NAME.azurecr.io/fullstackpoc-front:latest
docker push ACR_NAME.azurecr.io/fullstackpoc-front:latest

cd terraform
# pwd
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 