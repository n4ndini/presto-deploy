import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Store, PresentationType } from "../types";
import axios from "axios";


function Presentation() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<PresentationType | null>(null);
  const [currSlideIndex, setCurrSlideIndex] = useState(0);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditThumbnailModal, setShowEditThumbnailModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [error, setError] = useState('');

  // NEED TO FETCH PRESENTATION, LOAD OG SLIDE AND DEAL W PRESENTATION ERR
  const fetchPresentation = async () => {
    try {
      const res = await axios.get("http://localhost:5005/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const store: Store = res.data.store;
      const found = store.presentations.find(
        (p: PresentationType) => p.id === Number(id)
      );
      
      setPresentation(found || null);

      if (found) {
        setNewTitle(found.name);
        setNewThumbnail(found.thumbnail || "");

        setCurrSlideIndex((prev) => {
          if (prev < 0) { return 0; }
          if (prev > found.slides.length - 1) { return found.slides.length - 1; }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load presentation");
    }
  };

  useEffect(() => {
    fetchPresentation();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentation || presentation.slides.length < 2) return;

      if (e.key === "ArrowLeft" && currSlideIndex > 0) {
        setCurrSlideIndex((prev) => prev - 1);
      }

      if (e.key === "ArrowRight" && currSlideIndex < presentation.slides.length - 1) {
        setCurrSlideIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentation, currSlideIndex]);
  
  // useEffect(() => {
  //   const fetchPresentation = async () => {
  //     const res = await axios.get('http://localhost:5005/store', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const store = res.data.store;
  //     const found = store.presentations.find((p: PresentationType) => p.id === Number(id));

  //     setPresentation (found || null);
  //   };
  //   fetchPresentation();
  // }, [id]);

  if (!presentation) {
    return <p>Loading...</p>;
  }

  const currentSlide = presentation.slides[currSlideIndex];
  const isFirstSlide = currSlideIndex === 0;
  const isLastSlide = currSlideIndex === presentation.slides.length - 1;

  const updatePresentationInStore = async (updatedPresentation: PresentationType) => {
    const res = await axios.get("http://localhost:5005/store", {
      headers: { Authorization: `Bearer ${token}`},
    });

    const store: Store = res.data.store;

    const updatedPresentations = store.presentations.map((p: PresentationType) => 
      p.id == updatedPresentation.id ? updatedPresentation : p
    );

    const updatedStore: Store = {
      ...store,
      presentations: updatedPresentations,
    };

    await axios.put("http://localhost:5005/store", 
      { store: updatedStore },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setPresentation(updatedPresentation);
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

  // Edit presentation title
  const editTitle = async () => {
    const res = await axios.get('http://localhost:5005/store', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const store = res.data.store; 
    console.log(store.presentations);

    const pToEdit = store.presentations.find((p: PresentationType) => p.id === presentation.id);
    pToEdit.name = "new name Name";
    const presentations = store.presentations.filter((p: PresentationType) => p.id !== presentation.id);
    presentations.push(pToEdit);

    const updatedStore = {
      ...store, presentations: presentations,
    };

    await axios.put('http://localhost:5005/store', { store: updatedStore },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    console.log(store.presentations);
    return;
  }

  const firstSlide = presentation.slides[0];

  return (
    <>
      {/* <h1>Presentation {presentation.name}</h1> */}
      <h1>Presentation {id}: {presentation.name}</h1>
      <button onClick={() => editTitle()}>Edit Title</button>

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