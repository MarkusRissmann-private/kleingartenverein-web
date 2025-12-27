# Kleingartenverein Website - AWS Deployment Guide

Komplette Anleitung für das Deployment der Kleingartenverein-Website auf AWS mit minimalen Kosten (~1-3€/Monat).

## 🎯 Architektur

```
CloudFront (CDN) → S3 (Static Hosting) → API Gateway → Lambda → DynamoDB
                                                           ↓
                                                      Cognito (Auth)
```

**Kosten**: ~1-3€/Monat (hauptsächlich S3 + CloudFront)

## 🚀 Quick Deployment

### 1. React App bauen
```bash
npm install
npm run build
```

### 2. S3 Bucket erstellen
```bash
aws s3 mb s3://kleingartenverein-website --region eu-central-1
aws s3 website s3://kleingartenverein-website \
  --index-document index.html \
  --error-document index.html
```

### 3. App deployen
```bash
npm run deploy
```

### 4. DynamoDB Tabellen erstellen
```bash
# News Table
aws dynamodb create-table \
  --table-name kleingartenverein-news \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1

# Events Table
aws dynamodb create-table \
  --table-name kleingartenverein-events \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1
```

### 5. Lambda Funktionen deployen
```bash
cd aws/lambda
npm install
npm run build

# News Lambda
zip -r news-lambda.zip dist/news-handler.js node_modules/
aws lambda create-function \
  --function-name kleingartenverein-news-api \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-dynamodb-role \
  --handler dist/news-handler.handler \
  --zip-file fileb://news-lambda.zip \
  --region eu-central-1

# Events Lambda
zip -r events-lambda.zip dist/events-handler.js node_modules/
aws lambda create-function \
  --function-name kleingartenverein-events-api \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-dynamodb-role \
  --handler dist/events-handler.handler \
  --zip-file fileb://events-lambda.zip \
  --region eu-central-1
```

### 6. API Gateway konfigurieren
Über AWS Console:
1. API Gateway → Create REST API
2. Resources: `/news`, `/events`
3. Methods: GET, POST, PUT, DELETE
4. Lambda Integration
5. Deploy to "Prod" stage

### 7. Cognito User Pool
```bash
aws cognito-idp create-user-pool \
  --pool-name kleingartenverein-admins \
  --auto-verified-attributes email \
  --region eu-central-1

aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@kleingartenverein.de \
  --user-attributes Name=email,Value=admin@kleingartenverein.de \
  --temporary-password "TempPass123!" \
  --region eu-central-1
```

## 🔧 Alternative: AWS Amplify

Noch einfacher:
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify add api
amplify add auth
amplify push
```

## 💰 Kostenoptimierung

- CloudFront: Nur "US, Canada, Europe" Region
- DynamoDB: On-Demand statt Provisioned  
- Lambda: 128MB Memory (Minimum)
- CloudWatch: 7 Tage Log Retention

## 🔐 Sicherheit

- HTTPS-Only über CloudFront
- S3 nicht direkt öffentlich
- CORS korrekt konfigurieren
- Cognito MFA optional

## 📊 Monitoring

CloudWatch Alarme für:
- Hohe Kosten
- API Fehler  
- Lambda Timeouts

---

Vollständige Anleitung mit Code-Beispielen: Siehe AWS-DEPLOYMENT-GUIDE-FULL.md