import axios from 'axios';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
// import { API_BASE_URL } from '../backend';

const API_BASE_URL = "http://localhost:5005";

type RegisterProps = {
  successCallback : (token: string) => void;
}

function Register({ successCallback }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(''); // implement error messages

  //   npm install axios 
  // check local port is right
  const register = async (e: SyntheticEvent) => {
    e.preventDefault(); // enables enter key to be clicked
    setError('');


    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email, must contain an @');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
   
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/auth/register`, {
        name,
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
        setError('Registration failed. Please try again.')
      }
    }
  };

  return (
    <form onSubmit={register}>
      {/* use component libraries?? */}
      Register<br />

      {error && (
        <div>
          {error}
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      Name: <input data-cy="rego-name" type="text" value={name} onChange={e => setName(e.target.value)} /><br />
      Email: <input data-cy="rego-email" type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password: <input data-cy="rego-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      Confirm Password: <input data-cy="rego-pass-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /><br />

      <button type="submit" data-cy="rego-submit">Register</button>

    </form>
  )
}

export default Register