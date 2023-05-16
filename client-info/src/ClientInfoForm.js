import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';


function ClientInfoForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState('free');

  const handleSubmit = async (e) => {
    navigate('/success');
    e.preventDefault();
    try {
      // Do something with the captured client information, e.g., send it to a server
      await axios.post('http://localhost:3000/client-info', {
        name,
        email,
        subscription,
      });

      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Subscription:', subscription);

      // Reset the form fields
      setName('');
      setEmail('');
      setSubscription('');

      // Redirect to the success page
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
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
        </div>
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
    </div>
  );
};

export default ClientInfoForm;
