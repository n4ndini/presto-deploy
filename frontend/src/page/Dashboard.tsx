import axios from "axios";
import { useState } from "react";

type Slide = Record<string, string>; // before and after? or content and next? tbd!

type Presentation = {
  id: number,
  name: string,
  desc: string,
  thumbnail: string,
  slides: Slide[];
}

type Store = {
  presentations?: Presentation[];
}

function Dashboard() {
  const [showCreatePres, setShowCreatePres] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');


  const createPresentation = async () => {
    // error checking here



    // ds structure --> can have an arr of Presentations w
    // id, name, desc, thumbnail, slides [{}] (arr of objects)

    // have to GET curr store, then return og store + new presentation
    try {
      await axios.post('http//localhost:5005/')
    } catch {

    }
  }

  return (
    <>
        <h1>Dashboard</h1>
        <button onClick={() => setShowCreatePres(true)}>New Presentation</button>
    </>
  )
}


export default Dashboard
