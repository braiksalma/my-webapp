# Utiliser une image Node.js officielle comme base
FROM node:18

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de l'application dans le conteneur
COPY . .

# Exposer le port que votre application utilise (par défaut 3000 dans cet exemple)
EXPOSE 3000

# Commande pour lancer l'application
CMD ["node", "app.js"]
