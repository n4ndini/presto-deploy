import axios from "axios";
import type { React } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";
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


  const createPresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !desc) {
      setError('Presentations must have a name and description')
      return;
    }

    // do we wanna force them to have a thumbnail?


    // ds structure --> can have an arr of Presentations w
    // id, name, desc, thumbnail, slides [{}] (arr of objects)

    // have to GET curr store, then return og store + new presentation
    try {
      const res = await axios.get('http//localhost:5005/store', {headers: { Authorization: `Bearer ${token}`, },});
      const store = res.data.store;
      const oldPresentations = store.presentations || [];

      const newPresentation: Presentation = {
        id: oldPresentations.length + 1,
        name,
        desc,
        thumbnail,
        slides: [{}],
      };

      await axios.put('http//localhost:5005/store', {
        ...store, presentations: [...oldPresentations, newPresentation],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setName('');
      setDesc('');
      setThumbnail('');
      setShowCreatePres(false);


    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data.error || 'Failed to create new presentation';
        setError(errorMessage);
      } else {
        setError('Something failed. Please try again.')
      }
    }
  };

  return (
    <>
        <h1>Dashboard</h1>
        <button onClick={() => setShowCreatePres(true)}>New Presentation</button>

        {error && (
          <div>
            {error}
            <button onClick={() => setError('')}>Close</button>
          </div>
        )}

        {showCreatePres && (
          <div>
            <form onSubmit={createPresentation}>
              Name: <input type="text" value={name} onChange={e => setName(e.target.value)} /><br />
              Description: <input type="text" value={desc} onChange={e => setDesc(e.target.value)} /><br />
              Thumbnail URL: <input type="text" value={thumbnail} onChange={e => setThumbnail(e.target.value)} /><br />
              
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowCreatePres(false)}>Cancel</button>
            </form>


          </div>

        )}

        
    </>
  )
}


export default Dashboard
