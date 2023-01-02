# aproximacion m$
https://learn.microsoft.com/en-us/azure/developer/ansible/install-on-linux-vm?tabs=azure-cli
https://learn.microsoft.com/et-EE/azure/developer/ansible/getting-started-cloud-shell?view=azure-cli-latest&tabs=ansible


> az group create --name rg-gb-prueba-poc-3 --location westeurope

> az vm create \
--resource-group rg-gb-prueba-poc-3 \
--name avmesspruebapoc \
--image OpenLogic:CentOS:7.7:latest \
--admin-username azureuser \
--admin-password q03DU3Iczk78

> az vm show -d -g rg-gb-prueba-poc-3 -n avmesspruebapoc --query publicIps -o tsv
- para mostrar la ip

> ssh azureuser@13.94.156.64
- cambiar la ip por la que salga

## con contenedor
https://learn.microsoft.com/en-us/azure/developer/ansible/configure-in-docker-container?tabs=azure-cli

> docker build . -t ansible

> docker run --rm -it ansible

> export AZURE_TENANT=""

> export AZURE_SUBSCRIPTION_ID=""

ansible-galaxy collection install azure.azcollection
pip3 install -r ~/.ansible/collections/ansible_collections/azure/azcollection/requirements-azure.txt
ansible-playbook resource-group.yml


mkdir -p {inventory,roles/role1/{files,handlers,meta,tasks,templates,vars}}


