const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// Route to receive client information and execute the script
app.post('/client-info', (req, res) => {
  const { name, email, subscription } = req.body;
    console.log(name);
    console.log(email);
    console.log(subscription);
  // Execute the bash script with the provided information
  exec(
    `bash ../scripts/create-app.sh "${name}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return res.status(500).json({ error: 'An error occurred while creating the app.' });
      }
      if (stderr) {
        console.error(`Script execution error: ${stderr}`);
        return res.status(500).json({ error: 'An error occurred while creating the app.' });
      }
      console.log(`Script output: ${stdout}`);
      return res.status(200).json({ message: 'App created successfully.' });
    }
  );
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
