import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css'  // i dont think we can have this
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import { useNavigate } from 'react-router';


function App() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const tokenExist = localStorage.getItem('token');
    if (tokenExist) {
      setToken(tokenExist);
    }
  }, []);

  const fn = (token: string): void => {
    localStorage.setItem('token', token);
    setToken(token);
    navigate('/dashboard');
  };

  return (
    <>
    <div>
      {token ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          &nbsp; |&nbsp;
          Logout
        </>
      ) : (
        <>
         <Link to="/register">Register</Link>
         &nbsp; |&nbsp;
         <Link to="/login">Login</Link>
        </>
      )}
    </div>
    <div>
      NavBar
      <br></br>
      <Link to="/">Home</Link>
      <br></br>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </div>


      <Routes>
        <Route path="/" element={<p>Homepage!</p>} />
        <Route path="/register" element={<Register successCallback={fn} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </>
  )
}


export default App
