apiVersion: apps/v1
kind: Deployment
metadata:
  name: products
spec:
  replicas: 1
  selector:
    matchLabels:
      app: products
  template:
    metadata:
      labels:
        app: products
    spec:
      containers:
        - name: products
          image: product-service
          imagePullPolicy: Never
          resources:
            limits:
              memory: 512Mi
              cpu: "1"
          env:
            - name: PORT
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: PRODUCT_SERVICE_PORT
            - name: MONGO_URI
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: PRODUCT_SERVICE_MONGO_URI
            - name: DB_NAME
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: PRODUCT_SERVICE_DB_NAME
            - name: DB_COLLECTION
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: PRODUCT_SERVICE_DB_COLLECTION
            - name: DB_LOGGER_COLLECTION
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: PRODUCT_SERVICE_DB_LOGGER_COLLECTION
            - name: REDIS_URI
              valueFrom:
                secretKeyRef:
                  name: secrets
                  key: REDIS_PRODUCT_SERVICE_URI
---
apiVersion: v1
kind: Service
metadata:
  name: products-srv
spec:
  type: ClusterIP
  selector:
    app: products
  ports:
    - name: http
      port: 3000
      targetPort: 3000