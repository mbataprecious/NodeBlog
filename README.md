# NodeBlog

A minimal blog built with Node.js and the Pug template engine.

## 🚀 Run Locally

```bash
npm install
npm run start
```

Visit [http://localhost:3005](http://localhost:3005)

## 🐳 Run with Docker

1. Create a `.env` file with:

```
MONGODB_URI=your_mongo_uri
```

2. Build and run:

```bash
docker build -t mynodeblog:v1.0.0 .
docker run --env-file .env -d -p 3005:3005 mynodeblog:v1.0.0
```

## ⚙️ Jenkins

Includes a Jenkinsfile using a Node.js agent on **Amazon Linux (AWS EC2)**.