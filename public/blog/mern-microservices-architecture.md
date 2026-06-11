---
title: "Building Scalable MERN Apps with Microservices"
date: "2026-01-20"
tags: ["MERN", "Microservices", "Node.js", "MongoDB", "Architecture"]
excerpt: "Lessons learned from architecting the AI Healthcare Platform – breaking a monolith into microservices, API gateways, and inter-service communication patterns."
readingTime: 10
---

# Building Scalable MERN Apps with Microservices

In building the **AI-Enabled Smart Healthcare Platform**, I transitioned from a monolithic MERN architecture to a full microservices design. Here's what I learned.

## The Problem with Monoliths

When a single Node.js application handles authentication, appointments, medical records, payments, and video consultations, you get:

- **Deployment coupling** – a bug in payments takes down video consultations
- **Scaling inefficiency** – you can't scale the appointment service independently
- **Technology lock-in** – can't use Python for AI modules alongside Node.js

## The Microservices Architecture

```
┌─────────────────────────────────────────────┐
│              React + Vite Frontend          │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │    API Gateway      │  ← Nginx / Express Gateway
         └──┬──┬──┬──┬──┬────┘
            │  │  │  │  │
    ┌───────┘  │  │  │  └────────────┐
    ▼          ▼  ▼  ▼               ▼
  Auth     Appoint  Medical  Payment  Video
 Service   Service  Records  Service  Service
    │          │      │        │         │
 MongoDB    MongoDB MongoDB  Stripe   Agora
```

## Setting Up the API Gateway

```javascript
// gateway/index.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

const services = {
  '/api/auth': 'http://auth-service:3001',
  '/api/appointments': 'http://appointment-service:3002',
  '/api/records': 'http://medical-service:3003',
  '/api/payments': 'http://payment-service:3004',
};

Object.entries(services).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
});

app.listen(3000);
```

## Docker Compose for Local Development

```yaml
version: '3.8'
services:
  gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - appointment-service

  auth-service:
    build: ./services/auth
    environment:
      - MONGO_URI=mongodb://mongo:27017/auth
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  appointment-service:
    build: ./services/appointments
    environment:
      - MONGO_URI=mongodb://mongo:27017/appointments

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## Inter-Service Communication

For synchronous calls I used REST. For async events (like "appointment booked" → send notification) I used a simple event emitter pattern:

```typescript
// Event publisher
class EventBus {
  private subscribers: Map<string, Function[]> = new Map();

  publish(event: string, data: unknown) {
    const handlers = this.subscribers.get(event) ?? [];
    handlers.forEach(handler => handler(data));
  }

  subscribe(event: string, handler: Function) {
    const handlers = this.subscribers.get(event) ?? [];
    this.subscribers.set(event, [...handlers, handler]);
  }
}

export const eventBus = new EventBus();

// In appointment service
eventBus.publish('appointment:booked', {
  patientId, doctorId, appointmentTime
});

// In notification service
eventBus.subscribe('appointment:booked', async ({ patientId, doctorId, appointmentTime }) => {
  await sendEmailNotification(patientId, appointmentTime);
  await sendSMSViaTwilio(doctorId, appointmentTime);
});
```

## Key Lessons

1. **Start with a modular monolith** – extract services only when you hit real scaling pain
2. **Each service owns its data** – no shared databases between services
3. **Fail fast with health checks** – every service needs `/health` endpoint
4. **Centralize logging** – use correlation IDs across service boundaries
5. **Docker Compose in dev, Kubernetes in prod** – don't fight your tooling

## Conclusion

Microservices are powerful but come with real complexity. For the Healthcare Platform, the benefits were worth it — we could deploy the AI module independently and scale the video service separately during peak hours.

Would I recommend microservices for every project? Absolutely not. But when you have distinct domains with different scaling needs, they're the right tool.
