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
    const updatedStore: Store = {
      ...store,
      presentations: store.presentations.filter(
        (p: PresentationType) => p.id !== presentation.id
      ),
    };

    await axios.put('http://localhost:5005/store', { store: updatedStore },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    navigate("/dashboard");
  };

  const saveTitle = async () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return; 
    }

    try {
      const updatedPresentation: PresentationType = {
        ...presentation,
        name: trimmedTitle,
      };

      await updatePresentationInStore(updatedPresentation);
      setShowEditTitleModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update title");
    }
  };

  const saveThumbnail = async () => {
    try {
      const updatedPresentation: PresentationType = {
        ...presentation,
        thumbnail: newThumbnail.trim(),
      };

      await updatePresentationInStore(updatedPresentation);
      setShowEditThumbnailModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update thumbnail");
    }
  };

  const createNewSlide = async () => {
    try {
      const nextSlideId = 
      presentation.slides.length > 0
        ? Math.max(...presentation.slides.map((slide) => slide.id)) + 1
        : 1;

      const updatedPresentation: PresentationType = {
        ...presentation, 
        slides: [
          ...presentation.slides,
          {
            id: nextSlideId,
            content: "",
          },
        ],
      };

      await updatePresentationInStore(updatedPresentation);
      setCurrSlideIndex(updatedPresentation.slides.length - 1);
    } catch (err) {
      console.error(err);
      setError("Failed to create slide");
    }
  };

  const deleteCurrentSlide = async () => {
    if (presentation.slides.length === 1) {
      setError("Cannot delete the only slide");
      return;
    }

    try {
      const updatedSlides = presentation.slides.filter(
        (_, index) => index !== currSlideIndex
      );

      const updatedPresentation: PresentationType = {
        ...presentation,
        slides: updatedSlides,
      };

      await updatePresentationInStore(updatedPresentation);
      setCurrSlideIndex((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
      setError("Failed to delete slide");
    }
  };

}

export default Presentation