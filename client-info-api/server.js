const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'scripts', 'create-app.sh');
const nodemailer = require('nodemailer');


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Function to send email using Nodemailer
async function sendEmail(clientName, nodeIP, nodePort, clientEmail) {
  let transporter = nodemailer.createTransport({
    host: '57.128.87.190',
    port: 587,
    secure: false,
    auth: {
      user: 'l.dergham@esi-sba.dz',
      pass: '1161996Lahcene@',
    },
  });

  let message = {
    from: 'your_email',
    to: clientEmail,
    subject: 'Your Website Creation',
    text: `Dear ${clientName},\n\nYour website has been created successfully.\n\nNode IP: ${nodeIP}\nNode Port: ${nodePort}\n\nThank you for choosing our services!\n\nBest regards,\nThe Website Creation Team`,
  };

  try {
    let info = await transporter.sendMail(message);
    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Route to receive client information and execute the script
app.post('/', (req, res) => {
  const { name, email, subscription } = req.body;
    console.log(name);
    console.log(email);
    console.log(subscription);
  // Execute the bash script with the provided information
  const command = `bash ../scripts/create-app.sh "${name}" "${subscription}" `;
   exec(
    command,
    (error, stdout) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return res.status(500).json({ error: 'An error occurred while creating the app.' });
      }
     // if (stderr) {
     //   console.error(`Script execution error: ${stderr}`);
     //   return res.status(500).json({ error: 'An error occurred while creating the app.' });
    //  }
      console.log(`Script output: ${stdout}`);
      // Split the stdout into lines
      const lines = stdout.split('\n');
      // Extract the STATUS and LAST DEPLOYED values
      const statusLine = lines.find(line => line.startsWith('STATUS:'));
      const lastDeployedLine = lines.find(line => line.startsWith('LAST DEPLOYED:'));
      const nodeIPLine = lines.find(line => line.startsWith('Node IP:'));
      const nodePortLine = lines.find(line => line.startsWith('Node Port:'));

     // Extract the values by removing the leading label and trimming the whitespace
      const status = statusLine.replace('STATUS:', '').trim();
      const lastDeployed = lastDeployedLine.replace('LAST DEPLOYED:', '').trim();
      const nodeIP = nodeIPLine.replace('Node IP:', '').trim();
      const nodePort = nodePortLine.replace('Node Port:', '').trim();
      console.log('Deployment Status:', status);
      console.log('Last Deployed:', lastDeployed);
      console.log('node IP:', nodeIP);
      console.log('node Port:', nodePort);
      return res.status(200).json({ message: 'App created successfully.', lastDeployed, nodeIP, nodePort });
    }
  );
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
