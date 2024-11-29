# Projet : Déploiement d'une Application
 Web avec Base de Données sur un
 Cluster Kubernetes

 ## Objectifs

 -Déployer une base de données (PostgreSQL) sur Kubernetes.
 -Conteneuriser et déployer une application Web
 -Configurer les services nécessaires pour assurer la communication entre l'app et la base de données, ainsi qu'une exposition sécurisée de l'application web à l'extérieur du Cluster

 ## Prérequis

 Avant de commencer, vous devez vous assurer que les outils ci-dessous sont bien installés sur votre machine :

 -Docker : Pour créer les images des contenuers. (https://docs.docker.com/get-docker/)
 -Kubernetes : Pour gérer et orchestrer les conteneurs. (https://kubernetes.io/docs/setup/)

 ## Etapes de Déploiement

 ### 1. Conteneuriser l'application web

 #### a) Créer un Dockerfile

 cf Dockerfile

 #### b) Construire l'image docker

 En utilisant la commande suivante dans le dossier ou se trouve le Dockerfile :
 docker build -t my-webapp .
 Puis, tester en local avant de le déployer sur Kubernetes :
 docker run -p 3000:3000 my-webapp

### 2. Déploiement dans Kubernetes

#### a) Déploiement de la BDD

Créer un fichier deployment-db.yaml pour déployer la bdd dans un pod Kubernetes
cf deployment-db.yaml

#### b) Déploiement de l'application

Créer un fichier deployment-web.yaml pour déployer l'app dans un pod Kubernetes

#### c) Configurer les services 

### 3. Appliquer les configurations Kubernetes

Exécuter les commandes ci-dessous pour pouvoir appliquer les fichiers de configurations dans Kubernetes

kubectl apply -f deployment-db.yaml
kubectl apply -f service-db.yaml
kubectl apply -f deployment-web.yaml
kubectl apply -f service-web.yaml


```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]