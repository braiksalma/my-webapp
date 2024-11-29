
# Projet : Déploiement d'une Application Web avec Base de Données sur un Cluster Kubernetes

## Objectifs

- Déployer une base de données (PostgreSQL) sur Kubernetes.
- Conteneuriser et déployer une application web (NodeJS ou Django).
- Configurer les services nécessaires pour :
  - Assurer la communication interne entre l'application et la base de données.
  - Exposer l'application web de manière sécurisée à l'extérieur du cluster.

---

## Prérequis

Avant de commencer, vous devez vous assurer que les outils suivants sont bien installés :

- **Docker** : pour construire les images de conteneurs. [Guide d'installation](https://docs.docker.com/get-docker/)
- **Kubernetes** : pour orchestrer les conteneurs. [Guide d'installation](https://kubernetes.io/docs/setup/)
- **kubectl** : pour interagir avec votre cluster Kubernetes. [Documentation officielle](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- **Accès à un registre Docker** : pour pousser vos images Docker (Docker Hub, ECR, etc.).

---

## *Structure du Projet*

plaintext
├── client/                    # Code source du frontend (React)
│   ├── public/                # Contient le fichier index.html
│   ├── src/                   # Code source React
│   ├── Dockerfile             # Dockerfile pour conteneuriser le frontend
│   └── package.json           # Dépendances frontend
├── server/                    # Code source du backend (Node.js)
│   ├── routes/                # Routes API pour les étudiants
│   ├── models/                # Modèle de connexion PostgreSQL
│   ├── Dockerfile             # Dockerfile pour conteneuriser le backend
│   └── package.json           # Dépendances backend
├── kubernetes/                # Configurations Kubernetes
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── webapp-db-pvc.yaml
│   ├── webapp-backend-deployment.yaml
│   ├── webapp-backend-service.yaml
│   ├── webapp-frontend-deployment.yaml
│   ├── webapp-frontend-service.yaml
└── README.md                  # Ce fichier


---

## Étapes de Déploiement

### 1. Conteneurisation de l'Application Web

#### a) Cloner le dépôt

```bash
git clone https://github.com/<votre-nom-utilisateur>/<nom-du-repo>.git
cd <nom-du-repo>
```

#### b) Construire l'image Docker
Dans tous les dossiers du projet exécutez ces commandes ci-dessous pour pouvoir construire les images pour le backend et le frontend :

# Construction de l'image du frontend
```bash
cd client
docker build -t my-frontend .
```

# Construction de l'image du backend
```bash
cd ../server
docker build -t my-backend .
```

#### c) Démarrage du cluster Kubernetes

Executer cette commande ci-dessous pour démarrer le cluster Kubernetes  local (ici par exemple avec minikube) :

```bash
minikube start
```

#### d) Appliquer les fichiers YAML dans Kubernetes

Les appliquer dans l'ordre qui suit : 

```bash
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/webapp-db-pvc.yaml
kubectl apply -f kubernetes/webapp-backend-deployment.yaml
kubectl apply -f kubernetes/webapp-backend-service.yaml
kubectl apply -f kubernetes/webapp-frontend-deployment.yaml
kubectl apply -f kubernetes/webapp-frontend-service.yaml
```

#### e) Vérification des services Kubernetes
Vérifier que tous les services et pods sont bien actifs:

```bash
kubectl get pods
kubectl get services
```



### 2) Test de l'application

#### a) Recuperer l'IP du cluster :

```bash
minikube ip
```
#### b) Accédez à l'application dans le navigateur :

```
http://<minikube-ip>:<frontend-nodeport>
```

---


# Paramètres de Configuration

## Backend

### Variables de Connexion à PostgreSQL
Les variables d'environnement nécessaires à la connexion entre le backend et la base de données PostgreSQL sont définies dans le fichier `kubernetes/webapp-backend-deployment.yaml`. Modifiez ces paramètres si les configurations doivent être adaptées à votre environnement :

```yaml
env:
  - name: DB_HOST
    value: postgres-service
  - name: DB_USER
    valueFrom:
      secretKeyRef:
        name: postgres-secrets
        key: postgres-user
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: postgres-secrets
        key: postgres-password
  - name: DB_NAME
    valueFrom:
      secretKeyRef:
        name: postgres-secrets
        key: postgres-database
```

Ces valeurs utilisent un secret Kubernetes (`postgres-secrets`) pour sécuriser les informations sensibles telles que le nom d'utilisateur, le mot de passe et le nom de la base.

### Frontend

#### URL de l'API Backend
Si l'adresse IP ou le port du backend est modifié, mettez à jour les appels API dans le code source du frontend. Exemple de modification dans un composant React :

```javascript
const response = await fetch(`http://<backend-node-ip>:<backend-nodeport>/api/students`);
```

Une fois les changements effectués, reconstruisez l'image Docker et redéployez le frontend :

```bash
docker build -t my-frontend ./client
kubectl rollout restart deployment webapp-frontend
```

## Base de Données

### Initialisation et Scripts SQL
Si des scripts SQL supplémentaires sont nécessaires pour initialiser des tables ou insérer des données, appliquez-les directement dans le pod PostgreSQL :

```bash
kubectl exec -it <postgres-pod-name> -- psql -U <db-user> -d <db-name>
```

Ensuite, exécutez vos scripts SQL.

## Vérifications et Tests

1. **Logs des Pods :**
   Vérifiez les journaux pour détecter d'éventuelles erreurs :
   ```bash
   kubectl logs <frontend-pod-name>    # Frontend
   kubectl logs <backend-pod-name>     # Backend
   ```

2. **Connectivité entre les Services :**
   Depuis le pod backend, testez l'accès au service PostgreSQL :
   ```bash
   kubectl exec -it <backend-pod-name> -- ping postgres-service
   ```

3. **Persistance des Données :**
   Ajoutez des données via l'application, redémarrez les pods PostgreSQL et vérifiez que les données sont toujours disponibles :
   ```bash
   kubectl rollout restart deployment postgres
   ```

## Recommandations

- **Évitez l’utilisation des NodePorts en production** : Pour un déploiement en environnement de production, privilégiez un Ingress Controller pour une exposition sécurisée des services.
- **Optimisez les ressources des Pods** : Configurez des *requests* et *limits* dans les fichiers de déploiement pour gérer efficacement l'utilisation des ressources.

## Technologies Utilisées

- **Frontend** : React.js
- **Backend** : Node.js (Express.js)
- **Base de Données** : PostgreSQL
- **Orchestration** : Kubernetes
- **Conteneurisation** : Docker
