import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ElementType, ImageElementType, PresentationType, TextElementType } from "../types";
import TextModal from "./elems/TextModal";
import TextElement from "./elems/TextElement";
import { deletePresentationById, getPresentationById, updatePresentation } from "./Helpers";
import { addElement, deleteElement, updateElement } from "./elems/elemHelpers";
import ImageModal from "./elems/ImageModal";
import ImageElement from "./elems/ImageElement";


function Presentation() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [presentation, setPresentation] = useState<PresentationType | null>(null);
  const [currSlideIndex, setCurrSlideIndex] = useState(0);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditThumbnailModal, setShowEditThumbnailModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [editScreen, setEditScreen] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingElem, setEditingElem] = useState<TextElementType | ImageElementType | null>(null);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const pres = await getPresentationById(token!, Number(id));
        setPresentation(pres);
        if (pres) {
          setNewTitle(pres.name);
          setNewThumbnail(pres.thumbnail || '');
        }
      } catch {
        setError("Failed to load presentation");
      }
    };
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

  if (!presentation) {
    return <p>Loading...</p>;
  }

  const currentSlide = presentation.slides[currSlideIndex];
  const isFirstSlide = currSlideIndex === 0;
  const isLastSlide = currSlideIndex === presentation.slides.length - 1;

  const savePresentation = async (updated: PresentationType) => {
    setPresentation(updated);
    await updatePresentation(token!, updated);
  };

  const handleDeletePresentation = async () => {
    await deletePresentationById(token!, presentation.id);
    navigate("/dashboard");
  };

  const saveTitle = async () => {
    if (!newTitle.trim()) { setError("Title cannot be empty"); return; }
    try {
      await savePresentation({ ...presentation, name: newTitle.trim() });
      setShowEditTitleModal(false);
    } catch {
      setError("Failed to update title");
    }
  };

  const saveThumbnail = async () => {
    try {
      await savePresentation({ ...presentation, thumbnail: newThumbnail.trim() });
      setShowEditThumbnailModal(false);
    } catch {
      setError("Failed to update thumbnail");
    }
  };

  const createNewSlide = async () => {
    try {
      const nextSlideId = 
      presentation.slides.length > 0
        ? Math.max(...presentation.slides.map((slide) => slide.id)) + 1
        : 1;

      const updatedPresentation = {
        ...presentation,
        slides: [...presentation.slides, { id: nextSlideId, elements: [] }],
      };

      await savePresentation(updatedPresentation);
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
      const updatedSlides = {
        ...presentation,
        slides: presentation.slides.filter((_, i) => i !== currSlideIndex),
      };

      await savePresentation(updatedSlides);
      setCurrSlideIndex((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
      setError("Failed to delete slide");
    }
  };

  const addNewTextElem = async (
    text: string,
    width: number,
    height: number,
    fontSize: number,
    colour: string,
    x: number,
    y: number
  ) => {
    const maxId = currentSlide.elements.length > 0 ? Math.max(...currentSlide.elements.map((el) => el.id)) : 0;

    const newElem: TextElementType  = {
      id: maxId + 1,
      type: 'text',
      content: text,
      x: 0,
      y: 0,
      width,
      height,
      fontSize,
      colour,
    };
    const updated = addElement(presentation!, currSlideIndex, newElem);

    await savePresentation(updated);
    setShowTextModal(false);
    setError('');
  };

  const handleDeleteElement =  async(id: number) => {
    const updated = deleteElement(presentation!, currSlideIndex, id);
    setPresentation(updated);
    await savePresentation(updated);
  };

  const updateExistingElement = async (
    elemId: number,
    updater: (el: ElementType) => ElementType
  ) => {
    const updated = updateElement(presentation!, currSlideIndex, elemId, updater);

    await savePresentation(updated);
    setEditingElem(null);
  };

  const addNewImageElem = async (
    url: string,
    alt: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => {
    const maxId = currentSlide.elements.length > 0 ? Math.max(...currentSlide.elements.map((el) => el.id)) : 0;

    const newElem: ImageElementType  = {
      id: maxId + 1,
      type: 'image',
      url,
      alt,
      x: 0,
      y: 0,
      width,
      height,
    };

    const updated = addElement(presentation!, currSlideIndex, newElem);

    await savePresentation(updated);
    setShowImageModal(false);
    setError('');
  };

  return (
    <>
      <div style={{ marginBottom: "20px", display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={() => navigate("/dashboard")}>Back</button>
        <button onClick={() => setShowDeletePopup(true)}>
          Delete Presentation
        </button>
      </div>
  
      {error && (
        <div style={{ border: "1px solid red", padding: "10px", marginBottom: "16px" }}>
          <p>{error}</p>
          <button onClick={() => setError("")}>Close</button>
        </div>
      )}
  
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>{presentation.name}</h1>
        <button onClick={() => setShowEditTitleModal(true)}>Edit Title</button>
        <button onClick={() => setShowEditThumbnailModal(true)}>
          Update Thumbnail
        </button>
      </div>
  
      {presentation.thumbnail && (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={presentation.thumbnail}
            alt="presentation thumbnail"
            style={{ width: "220px", height: "120px", objectFit: "cover", border: "1px solid black" }}
          />
        </div>
      )}
  
      {showEditTitleModal && (
        <div
          style={{
            border: "1px solid black",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "white",
          }}
        >
          <h2>Edit Title</h2>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={saveTitle}>Save</button>
            <button onClick={() => setShowEditTitleModal(false)}>Cancel</button>
          </div>
        </div>
      )}
  
      {showEditThumbnailModal && (
        <div
          style={{
            border: "1px solid black",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "white",
          }}
        >
          <h2>Update Thumbnail</h2>
          <input
            type="text"
            placeholder="Enter thumbnail URL"
            value={newThumbnail}
            onChange={(e) => setNewThumbnail(e.target.value)}
            style={{ width: "300px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={saveThumbnail}>Save</button>
            <button onClick={() => setShowEditThumbnailModal(false)}>Cancel</button>
          </div>
        </div>
      )}
  
      {showDeletePopup && (
        <div
          style={{
            border: "1px solid black",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "white",
          }}
        >
          <p>Are you sure you want to delete this presentation?</p>
          <button onClick={handleDeletePresentation}>Yes</button>
          <button onClick={() => setShowDeletePopup(false)}>No</button>
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', marginBottom: '6px' }}>
        <button style={{ fontSize: '1em', padding: '4px 12px' }} onClick={createNewSlide}>New Slide</button>
        <button style={{ fontSize: '1em', padding: '4px 12px' }} onClick={deleteCurrentSlide}>Delete Slide</button>
        <button style={{ fontSize: '1em', padding: '4px 12px' }} onClick={() => setEditScreen(p => !p)}>
          {editScreen ? "Close Editor" : "Edit Slide"}
        </button>
        {editScreen && (
          <div>
            <button style={{ fontSize: '1em', padding: '2px 8px' }} onClick={() => setShowTextModal(true)}>+ Add Text</button>
            <button style={{ fontSize: '1em', padding: '2px 8px' }} onClick={() => setShowImageModal(true)}>+ Add Image</button>
          </div>
        )}
      </div>

      {showTextModal && (
        <TextModal onSubmit={addNewTextElem} onClose={() => setShowTextModal(false)} />
      )}

      {showImageModal && (
        <ImageModal onSubmit={addNewImageElem} onClose={() => setShowImageModal(false)} />
      )}

      {editingElem && editingElem.type === 'text' && (
        <TextModal
          initial={editingElem}
          onSubmit={(text, width, height, fontSize, colour, x, y) =>
            updateExistingElement(editingElem.id, (el) => {
              if (el.type !== 'text') return el;
              return {...el, content: text, width, height, fontSize, colour, x, y};
            })
          }
          onClose={() => setEditingElem(null)}
        />
      )}

      {editingElem && editingElem.type === 'image' && (
        <ImageModal
          initial={editingElem}
          onSubmit={(url, alt, width, height, x, y) =>
            updateExistingElement(editingElem.id, (el) => {
              if (el.type !== 'image') return el;
              return {...el, url, alt, width, height, x, y};
            })
          }
          onClose={() => setEditingElem(null)}
        />
      )}

      {/* side canvas */}
      <div
        style={{
          width: "800px",
          height: "450px",
          border: "1px solid black",
          position: "relative",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}>
        {currentSlide.elements.map((el) => {
        switch (el.type) {
          case "text":
            return (
              <TextElement
                key={el.id}
                elem={el}
                onDelete={handleDeleteElement}
                onEdit={setEditingElem}
              />
            );

          case "image":
            return (
              <ImageElement
                key={el.id}
                elem={el}
                onDelete={handleDeleteElement}
                onEdit={setEditingElem}
              />
            );

          default:
            return null;
         }
       })}

        {/* Slide number */}
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '0.75em', color: '#888' }}>
          {currSlideIndex + 1}
        </div>

        {/* nav arrows? */}
        {presentation.slides.length >= 2 && (
          <>
            <button
              onClick={() => setCurrSlideIndex((prev) => prev - 1)}
              disabled={isFirstSlide}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: isFirstSlide ? 0.5 : 1,
                cursor: isFirstSlide ? "not-allowed" : "pointer",
              }}
            >
              ←
            </button>
  
            <button
              onClick={() => setCurrSlideIndex((prev) => prev + 1)}
              disabled={isLastSlide}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: isLastSlide ? 0.5 : 1,
                cursor: isLastSlide ? "not-allowed" : "pointer",
              }}
            >
              →
           </button>
         </>
       )}  
      </div>
    </>
  );
}
export default Presentation;