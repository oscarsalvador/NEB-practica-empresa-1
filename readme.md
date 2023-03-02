![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![LaTeX](https://img.shields.io/badge/latex-%23008080.svg?style=for-the-badge&logo=latex&logoColor=white)

<br>

# Introduction
This repo contains a fullstack webapp and the Ansible and Terraform code to deploy it in Azure. It has frontend and backend servers, written in TypeScript and JavaScript respectively. I used React and Emotion for the frontend. Both use GraphQL, with Apollo Client and Server. I used MongoDB for persistance, and a Redis cache to store user session tokens. To handle images (with user uploads and deletion) I used Azure Blob Storage.

<br>

<p align="center">
  <img src="./documentacion/drawio/eng/general2.svg"><br>
  <em>General overview</em>
</p>

Users can view all posts, register, log in and out, and make and delete their own posts. These contain their author's name, a comment and an image. Only the author of a post can delete it, this is checked both in the client and API.

<br>

<p align="center">
  <img src="./documentacion/capturas/output.gif"><br>
  <em>Project demo</em>
</p>

<br>

## Table of Contents
- [Introduction](#Introduction)
  - [Requirements](https://github.com/oscarsalvador/NEB-practica-empresa-1#requirements)
  - [How to deploy (quick)](https://github.com/oscarsalvador/NEB-practica-empresa-1#How-to-deploy)
- [Repo structure](https://github.com/oscarsalvador/NEB-practica-empresa-1#Repo-structure)
- [Infrastructure](https://github.com/oscarsalvador/NEB-practica-empresa-1#Infrastructure)

<br>


## Requierements
- Azure subscription
- `az-cli`
- `docker`
- `terraform`
- `ansible`
  - Ansible's azure collection

### Installation of Ansible's collection for Azure
```
ansible-galaxy collection install azure.azcollection
pip3 install -r ~/.ansible/collections/ansible_collections/azure/azcollection/requirements-azure.txt
```

<br>

## How to deploy
The system can be deployed with Ansible, Terraform or both. Before getting to try this project out with either IaC tool, it is necessary fill out the variable files that feed these tools the values they need. I have uploaded examples for both, without the values. 
  - In every Terraform folder (`terraform`, `backend/terraform` and `frontend/terraform`) there's a `examplevariables.tfvars` file that needs to be filled, and renamed to `variables.tfvars`. The bash script `terraform/terraform-deploy.sh` receives the ACR name as a parameter.
  - In every role (`roles/<role-name>/`) of the Ansible playbook that you pick, there's a `vars/examplemain.yml` file to fill and rename as `vars/main.yml` too.

With these values and the requirements satisfied, the system can be deployed. After logging into Azure with `az login`, run either of the following:
  - Ansible:
    ```
      cd ansible/parallel_ansible
      ansible-playbook site.yml
    ```
  - Terraform:
    ```
      terraform/terraform-deploy.sh <YOUR-ACR-NAME-HERE>
    ```




<br><br></br>

# Repo structure

| Directory                         | Description                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Root                              |                                                                                 | 
| `├─` ansible                      | Contains all playbooks                                                          | 
| `│` &emsp; `├─` ansible           | My first playbook, the bare minimum to provision the project's needs in Azure   |
| `│` &emsp; `├─` parallel_ansible  | An improved playbook, using asynchronous tasks and roles to get a big speed up  |
| `│` &emsp; `└─` terraform_ansible | Simple playbook to test the integration of Terraform in Ansible                 |
| `├─` backend                      | Contains all files related to the backend server                                | 
| `│` &emsp; `├─` src               | JavaScript source files for the API server                                      |
| `│` &emsp; `└─` terraform         | Terraform project to deploy the backend's image as an Azure Container Instance  |
| `├─` documentacion                | Files related to the LaTeX lab report I made on this project                    | 
| `├─` frontend                     | Contains all files related to the frontend server                               | 
| `│` &emsp; `├─` src               | TypeScript source files for the webclient, to be served by the frontend         |
| `│` &emsp; `└─` terraform         | Terraform project to deploy the frontend's image as an Azure Container Instance |
| `└─` terraform                    | Terraform project for the base components, used by both backend and frontend    | 

There are three different Ansible playbooks, *ansible* and *parallel_ansible* differ in the use of asynchronous tasks and roles. On the other hand, *terraform_ansible* uses my terraform folders with the community collection's Terraform module. 

I also wrote a 65 page, in-depth [report](https://github.com/oscarsalvador/NEB-practica-empresa-1/blob/master/documentacion/latex/NEB_practica_empresa_1_master.pdf) exploring the inner-workings of Ansible and Terraform, and comparing them for Infrastructure as Code provisioning (it's in Spanish).




<br><br></br>

# Infrastructure
While I originally started the webapp's development locally, with Docker Compose, during the integration with Azure I decided to change MongoDB and Redis to their SaaS solutions in Azure. The frontend and backend servers are each run in their own Azure Container Instance (ACI). To make their images available to them, but keep these private, I provision my own registry (ACR). Due to it's licence (SSPL), MongoDB is only available in Azure as CosmosDB, Microsoft's in-house solution.

<br>

<p align="center">
  <img src="./documentacion/drawio/eng/general-infra.svg"><br>
  <em>Infrastructure requirements</em>
</p>

<br><br></br>


# Despliegue con Terraform
Terraform uses `variables.tfvars` files to load the values for variables used within it's runtime. In this repo I have only uploaded `examplevariables.tfvars` files. These contain the names of the variables, but require the user to populate them. There is one in each terraform folder. The first time around Terraform will also need the user to set up each project, running the following command on all project folders (`backend/terraform`, `frontend/terraform`, and `terraform`).

> terraform init

The last preparatory step is to log into Azure. From there on, the script **terraform-deploy.sh** contains all of the following steps. The scrip itself must also be updated, as I have removed the Azure Container Registry names I used, and replaced them with "ACR_NAME".

> az login

Partiendo en cada caso de la raiz del proyecto:

<br>

<p align="center">
  <img src="./documentacion/drawio/eng/terraform-etapas.svg"><br>
  <em>Terraform deployment process</em>
</p>

<br>

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

Cambiar el nombre del archivo `examplevariables.tfvars` a `variables.tfvars` y rellenarlo. 

<!-- La variable `whitelisted_ip` deberia tener las IPs de todos los que tengan que acceder por el frontend. `curl ifconfig.me` -->

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


<br><br></br>

# Despliegue con Ansible
Cambiar el nombre de los archivos `examplemain.yml` a `main.yml` en la carpeta `/vars` de cada rol en el playbook que se quiera ejecutar y rellenarlo con los valores adecuados. 

> az login

> ansible-playbook site.yml

En el playbook `parallel_ansible` hay dos playbooks, `site.yml` y `parallel-site.yml`, el segundo utiliza la estrategia *free* para los roles de docker. 

Se pueden elegir que roles ejecutar con las opciones `--tags "A,B"` y `--skip-tags "C,D"` detrás del comando de ansible-playbook. En los archivos `site.yml` se pueden ver las etiquetas que he asignado a cada rol.

<br>

<p align="center">
  <img src="./documentacion/drawio/eng/parallel-ansible-etapas.svg"><br>
  <em>Ansible deployment process</em>
</p>

<br>

## Deployment with the `ansible` and `terraform_ansible` playbooks