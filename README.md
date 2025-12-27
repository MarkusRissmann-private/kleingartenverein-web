# Kleingartenverein Website

Moderne, responsive Website für Kleingartenverein mit Admin-Bereich, gebaut mit React TypeScript und AWS Serverless.

## 🌟 Features

- ✅ Modernes, ansprechendes Design mit organischem Look
- ✅ Voll funktionsfähiger Admin-Bereich
- ✅ Termine und Neuigkeiten verwalten
- ✅ Responsive Design für alle Geräte
- ✅ TypeScript für Type-Safety
- ✅ AWS Serverless Backend (kostengünstig)

## 🚀 Quick Start

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm start
```

Die App läuft auf [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

Erstellt optimierte Dateien im `build/` Ordner.

## 📦 AWS Deployment

Siehe detaillierte Anleitung in `AWS-DEPLOYMENT-GUIDE.md`

**Schnell-Deployment:**

```bash
# 1. S3 Bucket erstellen
aws s3 mb s3://kleingartenverein-website --region eu-central-1

# 2. Static Hosting aktivieren
aws s3 website s3://kleingartenverein-website \
  --index-document index.html \
  --error-document index.html

# 3. Build & Deploy
npm run deploy
```

## 🏗️ Architektur

```
Frontend (React TS)
    ↓
CloudFront (CDN)
    ↓
S3 (Static Hosting)
    ↓
API Gateway → Lambda → DynamoDB
                ↓
            Cognito (Auth)
```

## 💰 Kosten

- **Geschätzt:** 1-3€/Monat
- **Free Tier:** Lambda, API Gateway, DynamoDB, Cognito
- **Hauptkosten:** S3 Storage + CloudFront

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript
- **UI:** Lucide React Icons
- **Styling:** Inline Styles (keine Abhängigkeiten)
- **Backend:** AWS Lambda (Node.js)
- **Database:** DynamoDB
- **Auth:** AWS Cognito
- **Hosting:** S3 + CloudFront

## 📝 Admin-Zugang

Der Admin-Bereich ist über den "Admin-Login" Button zugänglich.

**Development:** Beliebige Credentials verwenden (Mock-Auth)  
**Production:** AWS Cognito Authentication

## 🛠️ Entwicklung

### Verzeichnisstruktur

```
kleingartenverein-web/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx           # Haupt-Komponente
│   ├── index.tsx         # Entry Point
│   └── react-app-env.d.ts
├── aws/
│   ├── lambda/           # Lambda Functions
│   └── cloudformation/   # IaC Templates
├── package.json
├── tsconfig.json
└── README.md
```

### Backend API

Die App kommuniziert mit AWS Lambda über API Gateway:

- `GET /news` - Alle Neuigkeiten abrufen
- `POST /news` - Neue Nachricht erstellen
- `PUT /news/:id` - Nachricht aktualisieren
- `DELETE /news/:id` - Nachricht löschen
- `GET /events` - Alle Termine abrufen
- `POST /events` - Neuen Termin erstellen
- `PUT /events/:id` - Termin aktualisieren
- `DELETE /events/:id` - Termin löschen

## 🔐 Sicherheit

- HTTPS-Only über CloudFront
- AWS Cognito für Admin-Auth
- CORS konfiguriert
- S3 Bucket nicht öffentlich (nur über CloudFront)

## 📊 Monitoring

Optional CloudWatch Alarme für:
- Hohe Kosten
- API Fehler
- Lambda Timeouts

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei

## 👥 Kontakt

Bei Fragen oder Problemen, öffne ein Issue auf GitHub.