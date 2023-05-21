#!/bin/bash

# Get the client name from the script argument
CLIENT_NAME=$1
SUBSCRIPTION=$2

# Check if the client name and subscription are provided
if [ -z "$CLIENT_NAME" ]; then
  echo "Error: Client name is required."
  exit 1
fi

if [ -z "$SUBSCRIPTION" ]; then
  echo "Error: Client name is required."
  exit 1
fi


# Hash the client name using a hashing algorithm (e.g., SHA256)
CLIENT_NAME_HASH=$(echo -n "$CLIENT_NAME" | sha256sum | awk '{print $1}')

# Get the IP address of the Kubernetes node
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
echo ''
echo "Node IP: $NODE_IP"

# Set the environment variables
export CLIENT_NAME=$CLIENT_NAME
export BACKEND_API_URL="http://$NODE_IP:$BACKEND_NODE_PORT"

# Install the Helm chart with values
helm install "$CLIENT_NAME-app" ./k8s-app \
  --namespace "$CLIENT_NAME-ns" \
  --create-namespace \
  --set frontend.backendApiUrl="$BACKEND_API_URL" \
  --set frontend.subscription="$SUBSCRIPTION" \
  --set clientName="$CLIENT_NAME" \
  --set mongo.userName="$MONGO_USER_NAME" \
  --set mongo.servicePort="$MONGODB_NODE_PORT" 

# Get the node port of the service
NODE_PORT=$(kubectl get svc -n  "$CLIENT_NAME-ns" frontend-service -o jsonpath='{.spec.ports[0].nodePort}')
echo ''
echo "Node Port: $NODE_PORT"
