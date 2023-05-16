import logo from './logo.svg';
import './App.css';
import ClientInfoForm from './ClientInfoForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuccessPage from './SuccessPage';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<ClientInfoForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  </div>
  );
}

export default App;
