import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import styles from './App.module.css'
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// useParams for slides

function App() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const tokenExist = localStorage.getItem('token');
    if (tokenExist) {
      setToken(tokenExist);
    }
  }, []);

  const loginSuccessCallback = (token: string): void => {
    localStorage.setItem('token', token);
    setToken(token);
    navigate('/dashboard');
  };

  async function logout() {
    const response = await axios.post("http://localhost:5005/admin/auth/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    if (response.status === 200) {
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <>
      <div>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            &nbsp; |&nbsp;
            <span onClick={logout} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              Logout
            </span>
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
        {/* <Link to="/register">Register</Link> | <Link to="/login">Login</Link> */}
      </div>


      <Routes>
        <Route path="/" element={<p>Homepage!</p>} />
        <Route path="/register" element={<Register successCallback={loginSuccessCallback} />} />
        <Route path="/login" element={<Login successCallback={loginSuccessCallback}/>} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </>
  )
}


export default App
