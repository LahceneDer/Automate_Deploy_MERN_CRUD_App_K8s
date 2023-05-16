#!/bin/bash

# Get the client name from the user
echo -n "Enter the client name: "
read CLIENT_NAME
echo ""

# Hash the client name using a hashing algorithm (e.g., SHA256)
CLIENT_NAME_HASH=$(echo -n "$CLIENT_NAME" | sha256sum | awk '{print $1}')

# Function to check if a port is available
function is_port_available() {
  local port=$1
  local result=$(./check_port.sh $port)
  if [[ $result == *"is open"* ]]; then
    return 0
  else
    return 1
  fi
}

# Find the first available port within the range, excluding the excluded port
function find_available_port() {
  local start_port=$1
  local end_port=$2
  local excluded_port=$3
  local port

  for port in $(seq $start_port $end_port); do
    if [[ $port -ne $excluded_port ]] && ! is_port_available $port; then
      echo $port
      return
    fi
  done
}

# Set the backend node port
echo "Choosing a port for backend service..."
BACKEND_NODE_PORT=$(find_available_port 30000 32767 0)
echo "Port number: $BACKEND_NODE_PORT"
echo "Completed successfully !!!"
echo ''

# Check if backend node port is found
if [ -z "$BACKEND_NODE_PORT" ]; then
  echo "Error: Unable to find an available port within the range for the backend."
  exit 1
fi

# Set the frontend node port
echo "Choosing a port for frontend service..."
FRONTEND_NODE_PORT=$(find_available_port 30000 32767 $BACKEND_NODE_PORT)
echo "Port number: $FRONTEND_NODE_PORT"
echo "Completed successfully !!!"
echo ''


# Set the mongoDB node port
echo "Choosing a port for MongoDB service..."
MONGODB_NODE_PORT=$(find_available_port 27016 28017 0)
echo "Port number: $MONGODB_NODE_PORT"
echo "Completed successfully !!!"
echo ''



# Check if frontend node port is found
if [ -z "$FRONTEND_NODE_PORT" ]; then
  echo "Error: Unable to find an available port within the range for the frontend."
  exit 1
fi

# Set the environment variables
export BACKEND_NODE_PORT
export FRONTEND_NODE_PORT
export MONGODB_NODE_PORT
export MONGO_USER_NAME=$CLIENT_NAME_HASH

# Get the nodePort for the backend service from the user
#echo -n "Enter the nodePort for the backend service: "
#read BACKEND_NODE_PORT

#echo -n "Enter the nodePort for the frontend service: "
#read FRONTEND_NODE_PORT


# Get the MongoDB service ClusterIP
#MONGODB_CLUSTER_IP=$(kubectl get service mongodb-service -o jsonpath='{.spec.clusterIP}')

# Set the MongoDB URI
#MONGODB_URI="mongodb://${MONGODB_CLUSTER_IP}:27017/${CLIENT_NAME}-db"

# Get the IP address of the Kubernetes node
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

# Set the environment variables
export CLIENT_NAME=$CLIENT_NAME
export BACKEND_API_URL="http://$NODE_IP:$BACKEND_NODE_PORT"

# Install the Helm chart with values
helm install "$CLIENT_NAME-app" ../k8s-app \
  --namespace "$CLIENT_NAME-ns" \
  --create-namespace \
  --set frontend.backendApiUrl="$BACKEND_API_URL" \
  --set clientName="$CLIENT_NAME" \
  --set backend.nodePort="$BACKEND_NODE_PORT" \
  --set frontend.nodePort="$FRONTEND_NODE_PORT" \
  --set mongo.userName="$MONGO_USER_NAME" \
  --set mongo.servicePort="$MONGODB_NODE_PORT" 

