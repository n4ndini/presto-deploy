import axios from 'axios';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
// import { API_BASE_URL } from '../backend';

const API_BASE_URL = "http://localhost:5005";

type LoginProps = {
  successCallback : (_token: string) => void;
}

function Login({ successCallback }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(''); // implement error messages

  //   npm install axios 
  // check local port is right
  const login = async (e: SyntheticEvent) => {
    e.preventDefault(); // enables enter key to be clicked
    setError('');


    if ( !email || !password ) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email, must contain an @');
      return;
    }
   
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      successCallback(token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data.error || 'Request failed';
        setError(errorMessage);
      } else {
        setError('Login failed. Please try again.')
      }
    }
  };

  return (
    <form onSubmit={login}>
      {/* use component libraries?? */}
      Login<br />

      {error && (
        <div>
          {error}
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      Email: <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />

      <button type="submit">Login</button>

    </form>
  )
}

export default Login