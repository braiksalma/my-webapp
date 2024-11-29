

```markdown
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

## Étapes de Déploiement

### 1. Conteneurisation de l'Application Web

#### a) Créer un fichier Dockerfile
Voici un exemple de Dockerfile pour une application NodeJS :

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### b) Construire l'image Docker
Dans le répertoire contenant le Dockerfile, exécutez :

```bash
docker build -t my-webapp .
```

#### c) Tester l'image en local
Lancez le conteneur localement pour vérifier son bon fonctionnement :

```bash
docker run -p 3000:3000 my-webapp
```

---

### 2. Déploiement dans Kubernetes

#### a) Déploiement de la base de données
Créez un fichier `deployment-db.yaml` avec le contenu suivant pour déployer PostgreSQL dans un Pod Kubernetes :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        envFrom:
        - configMapRef:
            name: postgres-config
        - secretRef:
            name: postgres-secrets
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: postgres-storage
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

#### b) Créer les Secrets et ConfigMaps
Fichier `configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
data:
  POSTGRES_DB: mydatabase
  POSTGRES_USER: admin
```

Fichier `secrets.yaml` :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secrets
type: Opaque
data:
  POSTGRES_PASSWORD: YWRtaW4xMjM=  # admin123 encodé en base64
```

#### c) Déploiement de l'application web
Créez un fichier `deployment-web.yaml` avec le contenu suivant :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: my-webapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres-service
        - name: DB_PORT
          value: "5432"
        - name: DB_USER
          value: admin
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: POSTGRES_PASSWORD
```

---

### 3. Application des configurations Kubernetes
Exécutez les commandes suivantes pour appliquer les fichiers de configuration dans Kubernetes :

```bash
kubectl apply -f deployment-db.yaml
kubectl apply -f service-db.yaml
kubectl apply -f deployment-web.yaml
kubectl apply -f service-web.yaml
```

---

## Paramètres de Configuration

Pour adapter ce projet à d'autres environnements ou configurations spécifiques, vous pouvez :

- Modifier les fichiers **ConfigMap** et **Secret** pour refléter vos paramètres de base de données.
- Changer les images Docker utilisées dans les fichiers YAML pour pointer vers vos propres registres.
- Ajuster les services Kubernetes pour configurer des ports ou des types d'exposition spécifiques (ClusterIP, NodePort, ou LoadBalancer).
```

### Points importants à noter :
- Ce fichier **README.md** est maintenant en **Markdown** complet, avec des titres et du code formaté pour GitHub.
- Le code est bien encapsulé avec des triples backticks (```) et des blocs de code spécifiques à chaque type (bash, yaml, dockerfile).
- Quand vous copiez et collez ce code dans votre fichier `README.md`, cela s'affichera correctement sur GitHub, avec des sections de code bien distinguées et lisibles.

J'espère que cela correspond exactement à ce que vous attendiez !