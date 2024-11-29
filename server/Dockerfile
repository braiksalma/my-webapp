# Étape 1 : Choisir une image de base
FROM node:16

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le code source
COPY . .

# Étape 6 : Exposer le port sur lequel l'app va tourner
EXPOSE ${PORT:-8000}

# Étape 7 : Lancer l'application
CMD ["npm", "start"]
