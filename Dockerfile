FROM node:18-alpine AS base

WORKDIR /app

# Kopiere das gesamte Repository
COPY . .

# Wechsle in das next-wp-Verzeichnis für alle weiteren Operationen
WORKDIR /app/next-wp

# Installiere Abhängigkeiten
RUN npm ci

# Baue die Next.js-Anwendung
RUN npm run build

# Setze Umgebungsvariablen für die Produktion
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Exponiere Port 3000
EXPOSE 3000

# Starte die Anwendung
CMD ["npm", "start"]
