#!/bin/bash

# Get the client name from the user
echo -n "Enter the client name: "
read CLIENT_NAME

# Get the nodePort for the backend service from the user
echo -n "Enter the nodePort for the backend service: "
read BACKEND_NODE_PORT

kubectl apply -f k8s-app/templates/mongodb-sts.yaml

# Get the MongoDB service ClusterIP
MONGODB_CLUSTER_IP=$(kubectl get service mongodb-service -o jsonpath='{.spec.clusterIP}')

# Set the MongoDB URI
MONGODB_URI="mongodb://${MONGODB_CLUSTER_IP}:27017/${CLIENT_NAME}-db"

# Get the IP address of the Kubernetes node
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

# Set the environment variables
export CLIENT_NAME=$CLIENT_NAME
export BACKEND_API_URL="http://$NODE_IP:$BACKEND_NODE_PORT"

# Install the Helm chart with values
helm install "$CLIENT_NAME-app" ./k8s-app \
  --namespace "$CLIENT_NAME-ns" \
  --create-namespace \
  --set frontend.backendApiUrl="$BACKEND_API_URL" \
  --set backend.clientName="$CLIENT_NAME" \
  --set backend.nodePort="$BACKEND_NODE_PORT" \
  --set mongodb.mongoDBURI="$MONGODB_URI"

