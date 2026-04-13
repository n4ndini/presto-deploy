import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PresentationType } from "../types";
import axios from "axios";


function Presentation() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [presentation, setPresentation] = useState<PresentationType | null>(null);
  const [currSlide, setCurrSlide] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  // NEED TO FETCH PRESENTATION, LOAD OG SLIDE AND DEAL W PRESENTATION ERR

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

  return (
    <>
      {/* <h1>Presentation {presentation.name}</h1> */}
      <h1>Presentation {id}</h1>

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
    </>
    
  )
}

export default Presentation