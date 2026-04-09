import { Routes, Route, Link } from 'react-router-dom';

import './App.css'
import Register from './page/Register';

function App() {
  
  return (
    <>
    <div>
      NavBar
      <br></br>
      <Link to="/">Home</Link>
      <br></br>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </div>


      <Routes>
        <Route path="/" element={<p>Homepage!</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<p>Login!</p>} />
      </Routes>
    </>
  )
}


export default App
