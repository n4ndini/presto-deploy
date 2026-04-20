import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Presentation from './page/Presentation';
import PresentationPreview from './page/PresentationPreview';
import HistoryPage from './page/HistoryPage'

const API_BASE_URL = "http://localhost:5005";

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
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/auth/logout`, {}, {
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
    catch (err) {
      console.error(err);
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
            <Link to="/dashboard" data-cy="nav-dashboard">Dashboard</Link>
            &nbsp; |&nbsp;
            <span onClick={logout} data-cy="logout-button" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/register" data-cy="nav-register">Register</Link>
            &nbsp; |&nbsp;
            <Link to="/login" data-cy="nav-login">Login</Link>
          </>
        )}
      </div>
      <div>
        NavBar
        <br></br>
        <Link to="/" data-cy="nav-home">Home</Link>
        <br></br>
        {/* <Link to="/register">Register</Link> | <Link to="/login">Login</Link> */}
      </div>


      <Routes>
        <Route path="/" element={<p>Homepage!</p>} />
        <Route path="/register" element={<Register successCallback={loginSuccessCallback} />} />
        <Route path="/login" element={<Login successCallback={loginSuccessCallback}/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presentation/:id" element={<Presentation />} />
        <Route path="/presentation/:id/preview" element={<PresentationPreview />} />
        <Route path="/presentation/:id/history" element={<HistoryPage />} />

      </Routes>
    </>
  )
}


export default App
