---
title: "Kubernetes for Developers: From Zero to CKA"
date: "2025-10-15"
tags: ["Kubernetes", "DevOps", "Docker", "Cloud"]
excerpt: "My journey studying for the CKA certification – key concepts, practical tips, and resources that helped me understand Kubernetes architecture."
readingTime: 8
---

# Kubernetes for Developers: From Zero to CKA

After earning my **Certified Kubernetes Administrator (CKA)** certification, I want to share the concepts that clicked for me and how I approach Kubernetes in real projects.

## Why Kubernetes?

When I started building microservices for the **AI-Enabled Smart Healthcare Platform**, I quickly realized that managing containers with plain Docker Compose wouldn't scale. Kubernetes solves:

- **Container orchestration** – automatic placement and rescheduling
- **Self-healing** – restarts failed containers automatically
- **Horizontal scaling** – scales pods up/down based on load
- **Service discovery** – built-in DNS for service-to-service communication

## Core Concepts

### Pods

A Pod is the smallest deployable unit in Kubernetes.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: healthcare-api
  labels:
    app: healthcare
spec:
  containers:
    - name: api
      image: dilshan/healthcare-api:latest
      ports:
        - containerPort: 3000
      env:
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: uri
```

### Deployments

Deployments manage ReplicaSets and provide declarative updates.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: healthcare-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: healthcare
  template:
    metadata:
      labels:
        app: healthcare
    spec:
      containers:
        - name: api
          image: dilshan/healthcare-api:latest
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"
```

### Services

Services expose Pods via a stable network endpoint.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: healthcare-api-service
spec:
  selector:
    app: healthcare
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

## Key CKA Topics

1. **etcd backup and restore** – critical for disaster recovery
2. **Network policies** – controlling Pod-to-Pod communication
3. **RBAC** – role-based access control for security
4. **Persistent Volumes** – stateful workloads
5. **Ingress controllers** – routing external traffic

## Practical Tips for the CKA Exam

```bash
# Generate YAML quickly instead of writing from scratch
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deploy.yaml

# Use imperative commands when faster
kubectl expose deployment nginx --port=80 --type=NodePort

# Check events when pods are stuck
kubectl describe pod <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp
```

## My Study Resources

- **Mumshad Mannambeth's CKA course** on Udemy (highly recommended)
- **Killer.sh** – exam simulator (included with CNCF exam purchase)
- Official Kubernetes docs – the exam is open book!

## Conclusion

Kubernetes has completely changed how I think about deploying applications. The investment in learning it pays dividends in every production deployment. If you're building microservices, Kubernetes is not optional — it's essential.

*Good luck with your CKA journey! Feel free to reach out on LinkedIn.*
