FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Install the required Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install kubectl
RUN apt-get update && apt-get install -y curl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Install helm
RUN curl https://baltocdn.com/helm/signing.asc | apt-key add - \
    && apt-get install apt-transport-https --yes \
    && echo "deb https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list \
    && apt-get update \
    && apt-get install helm --yes

# Set the kubeconfig file path
ENV KUBECONFIG=/app/kubeconfig.yaml

# Copy the kubeconfig.yaml file to the working directory
COPY kubeconfig.yaml /app/kubeconfig.yaml

# Copy the application files to the working directory
COPY . .

# Set the command to run the FastAPI application when the container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8888", "--reload"]

