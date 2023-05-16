import React from 'react';

const SuccessPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your request has been submitted!</h2>
      <p style={{ fontSize: '1.2rem' }}>An email with the information about your website will be sent to you shortly.</p>
    </div>
  );
};

export default SuccessPage;
