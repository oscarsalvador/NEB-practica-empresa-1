#!/bin/bash
# hacer login a mano
# az login --use-device-code
# systemctl start docker

cd terraform
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 

az acr login -n acresspruebapoc2

cd ../backend
docker build -t fullstackpoc-back:1.0.0 .
docker tag fullstackpoc-back:1.0.0 acresspruebapoc2.azurecr.io/fullstackpoc-back:latest
docker push acresspruebapoc2.azurecr.io/fullstackpoc-back:latest

cd terraform
# pwd
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 

cd ../../frontend
docker build -t fullstackpoc-front:1.0.0 .
docker tag fullstackpoc-front:1.0.0 acresspruebapoc2.azurecr.io/fullstackpoc-front:latest
docker push acresspruebapoc2.azurecr.io/fullstackpoc-front:latest

cd terraform
# pwd
terraform plan -out miplan.out -var-file variables.tfvars
terraform apply miplan.out 