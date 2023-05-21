from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api")
def welcome():
    return {"message": "Welcome to API"}

@app.post("/api")
def create_app(name: str, email: str, subscription: str):
    script_path = "./scripts/create-app.sh"
    command = f"{script_path} '{name}' '{subscription}'"
    
    try:
        output = subprocess.check_output(command, shell=True, text=True)
        lines = output.split("\n")
        status = lines[0].replace("STATUS:", "").strip()
        last_deployed = lines[1].replace("LAST DEPLOYED:", "").strip()
        node_ip = lines[2].replace("Node IP:", "").strip()
        node_port = lines[3].replace("Node Port:", "").strip()
        
        return {
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

