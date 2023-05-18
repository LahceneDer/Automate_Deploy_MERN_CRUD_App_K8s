import React, { useState } from 'react';
import axios from 'axios';


function Popup({ response }) {
  const formattedDate = new Date(response.lastDeployed).toLocaleString();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)' }}>
        <h3>Response Data:</h3>
        <p>Last Deployed: {formattedDate}</p>
        <p>Message: {response.message}</p>
        <p>App link: <a href={`http://${response.nodeIP}:${response.nodePort}`}> Click here !!! </a></p>
	<p>Node IP: {response.nodeIP}</p>
        <p>Node Port: {response.nodePort}</p>
      </div>
    </div>
  );
}

function ClientInfoForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resp, setResp] = useState({});
  const [subscription, setSubscription] = useState('free');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://57.128.112.79:3001/', {
        name,
        email,
        subscription,
      });
      setResp(response.data);
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Subscription:', subscription);
      console.log('Response:', response.data);
      setName('');
      setEmail('');
      setSubscription('');
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  };

  const closePopup = () => {
    setResp({});
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <form style={{ width: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Client Information</h2>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ marginBottom: '5px', color: '#555' }}>Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ marginBottom: '5px', color: '#555' }}>Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </
div>
<div style={{ marginBottom: '20px' }}>
<label htmlFor="subscription" style={{ marginBottom: '5px', color: '#555' }}>Subscription:</label>
<select id="subscription" value={subscription} onChange={(e) => setSubscription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
<option value="">Select</option>
<option value="free">Free</option>
<option value="paid">Paid</option>
</select>
</div>
<button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
</form>
{Object.keys(resp).length > 0 && <Popup response={resp} onClose={closePopup} />}
</div>
);
}

export default ClientInfoForm;
