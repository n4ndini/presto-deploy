import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PresentationType } from "../types";
import axios from "axios";


function Presentation() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [presentation, setPresentation] = useState<PresentationType | null>(null);
  // const [currSlide, setCurrSlide] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  // NEED TO FETCH PRESENTATION, LOAD OG SLIDE AND DEAL W PRESENTATION ERR
  useEffect(() => {
    const fetchPresentation = async () => {
      const res = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const store = res.data.store;
      const found = store.presentations.find((p: PresentationType) => p.id === Number(id));

      setPresentation (found || null);
    };
    fetchPresentation();
  }, [id]);

  if (!presentation) {
    return <p>Loading...</p>;
  }

  const deletePresentation = async () => {
    const res = await axios.get('http://localhost:5005/store', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const store = res.data.store;
    const updatedStore = {
      ...store, presentations: store.presentations.filter((p: PresentationType) => p.id !== presentation.id),
    };

    await axios.put('http://localhost:5005/store', { store: updatedStore },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    navigate("/dashboard");
  };

  const firstSlide = presentation.slides[0];

  return (
    <>
      {/* <h1>Presentation {presentation.name}</h1> */}
      <h1>Presentation {id}: {presentation.name}</h1>

      <button onClick={() => navigate('/dashboard')}>Back</button>
      <button onClick={() => setShowDeletePopup(true)}>Delete Presentation</button>
      <br />
      <br />
      <br />

      {showDeletePopup && (
        <div>
          Are you sure?<br />
          <button onClick={deletePresentation}>Yes</button>
          <button onClick={() => setShowDeletePopup(false)}>No</button>
        </div>
      )}

      <h2>Slide: {firstSlide.id}</h2>
      <p>{firstSlide.content || "(empty slide)"}</p>
    </>
  )
}

export default Presentation