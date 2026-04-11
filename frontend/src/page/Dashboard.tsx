import { useState } from "react";

function Dashboard() {
  const [showCreatePres, setShowCreatePres] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const token = localStorage.getItem('token');

  const createPresentation = async () => {
    
  }

  return (
    <>
        <h1>Dashboard</h1>
        <button onClick={() => setShowCreatePres(true)}>New Presentation</button>
    </>
  )
}


export default Dashboard
