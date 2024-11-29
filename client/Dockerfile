# Étape 1 : Choisir une image de base
FROM node:16

# Étape 2 : Définir le répertoire de travail
WORKDIR /app/frontend

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le code source
COPY . .

# Étape 6 : Construire l'application pour la production
RUN npm run build

# Étape 7 : Servir l'application React via un serveur HTTP
RUN npm install -g serve

# Étape 8 : Exposer le port
EXPOSE 3000

# Étape 9 : Lancer l'application
CMD ["serve", "-s", "build", "-l", "3000"]
