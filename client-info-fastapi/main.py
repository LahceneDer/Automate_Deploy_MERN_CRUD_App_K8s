from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Client(BaseModel):
    email: str
    name: str
    subscription: str

@app.get("/api")
def welcome():
    return {"message": "Welcome to API"}

@app.post("/api")
def create_app(client: Client):
    script_path = "./create-app.sh"
    command = f"{script_path} '{client.name}' '{client.subscription}'"
    
    try:
        output = subprocess.check_output(command, shell=True, text=True)
        lines = output.split("\n")
        #status = lines[0].replace("STATUS:", "").strip()
        #last_deployed = lines[1].replace("LAST DEPLOYED:", "").strip()
        #node_ip = lines[2].replace("Node IP:", "").strip()
        #node_port = lines[3].replace("Node Port:", "").strip()
        for line in lines:
            if line.startswith("Node IP:"):
                node_ip = line.replace("Node IP:", "").strip()
            elif line.startswith("NAME:"):
                name = line.replace("NAME:", "").strip()
            elif line.startswith("LAST DEPLOYED:"):
                last_deployed = line.replace("LAST DEPLOYED:", "").strip()
            elif line.startswith("NAMESPACE:"):
                namespace = line.replace("NAMESPACE:", "").strip()
            elif line.startswith("STATUS:"):
                status = line.replace("STATUS:", "").strip()
            elif line.startswith("Node Port:"):
                node_port = line.replace("Node Port:", "").strip()
        return {
            #'output': output,
            #"lines": lines,
            'status':status ,
            "message": "App created successfully.",
            "lastDeployed": last_deployed,
            "nodeIP": node_ip,
            "nodePort": node_port
        }
    except subprocess.CalledProcessError as e:
        error_message = f"Error executing script: {e.output}"
        return {"error": error_message}
    except Exception as e:
        return {"error": str(e)}

# Start the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)

