import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import type { PresentationType, Store } from "../types";


function Dashboard() {
  const [showCreatePres, setShowCreatePres] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const [presentations, setPresentations] = useState<PresentationType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const res = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const store: Store = res.data.store;
        setPresentations(store.presentations || []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data.error || 'Request failed';
          setError(errorMessage);
        } else {
          setError('Login failed. Please try again.')
        }
      }
    };
    fetchPresentation();
  }, []);

  const createPresentation = async (e: React.SyntheticEvent) => {
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
      const res = await axios.get('http://localhost:5005/store', {headers: { Authorization: `Bearer ${token}`, },});
      const store: Store = res.data.store;
      const oldPresentations = store.presentations || [];

      const newPresentation: PresentationType = {
        id: oldPresentations.length + 1,
        name,
        desc,
        thumbnail,
        slides: [{ id: 1 }],  // default single empty slide
      };

      const updatedStore: Store = {
        ...store,
        presentations: [...oldPresentations, newPresentation],
      };

      await axios.put('http://localhost:5005/store', { store: updatedStore },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setPresentations(updatedStore.presentations);
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

      <br />

      <div style={{
        display: 'grid',
        // repeat the column def, auto-fit as many as u can in the container
        // min width 200px, 1 fr = take up free space equally
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '10px',
        marginTop: '20px',
      }}>
        {presentations.map(p => (
          <div key={p.id} onClick={() => navigate(`/presentation/${p.id}`)} style={{
            border: '1px solid black',
            aspectRatio: '2 / 1',
            padding: '6px',
          }}>
            {p.thumbnail && (
              <img src={p.thumbnail} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            )}
            <h2>{p.name}</h2><br />
            <p>{p.desc}</p><br />
            <span>{p.slides.length} slides</span><br />

          </div>
        ))}

      </div>
      
    </>
  )
}


export default Dashboard
