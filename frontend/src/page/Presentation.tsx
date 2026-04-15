import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Store, PresentationType } from "../types";
import axios from "axios";

function Presentation() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<PresentationType | null>(
    null
  );
  const [currSlideIndex, setCurrSlideIndex] = useState(0);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditThumbnailModal, setShowEditThumbnailModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [error, setError] = useState("");

  // NEED TO FETCH PRESENTATION, LOAD OG SLIDE AND DEAL W PRESENTATION ERR
  const fetchPresentation = async () => {
    try {
      const res = await axios.get("http://localhost:5005/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          if (prev < 0) {
            return 0;
          }
          if (prev > found.slides.length - 1) {
            return found.slides.length - 1;
          }
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

      if (
        e.key === "ArrowRight" &&
        currSlideIndex < presentation.slides.length - 1
      ) {
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

  const updatePresentationInStore = async (
    updatedPresentation: PresentationType
  ) => {
    const res = await axios.get("http://localhost:5005/store", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const store: Store = res.data.store;

    const updatedPresentations = store.presentations.map(
      (p: PresentationType) =>
        p.id == updatedPresentation.id ? updatedPresentation : p
    );

    const updatedStore: Store = {
      ...store,
      presentations: updatedPresentations,
    };

    await axios.put(
      "http://localhost:5005/store",
      { store: updatedStore },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPresentation(updatedPresentation);
  };

  const deletePresentation = async () => {
    const res = await axios.get("http://localhost:5005/store", {
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

    await axios.put(
      "http://localhost:5005/store",
      { store: updatedStore },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>Back</button>
        <button onClick={() => setShowDeletePopup(true)}>
          Delete Presentation
        </button>
      </div>

      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Close</button>
        </div>
      )}

      <div>
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
          />
        </div>
      )}

      {showEditTitleModal && (
        <div>
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
        <div>
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
            <button onClick={() => setShowEditThumbnailModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div>
          <p>Are you sure you want to delete this presentation?</p>
          <button onClick={deletePresentation}>Yes</button>
          <button onClick={() => setShowDeletePopup(false)}>No</button>
        </div>
      )}

      <div>
        {presentation.slides.length >= 2 && (
          <>
            <button
              onClick={() => setCurrSlideIndex((prev) => prev - 1)}
              disabled={isFirstSlide}
            >
              ←
            </button>

            <button
              onClick={() => setCurrSlideIndex((prev) => prev + 1)}
              disabled={isLastSlide}
            >
              →
            </button>
          </>
        )}

        <div>
          <h2>Slide Content</h2>
          <p>{currentSlide.content || "(empty slide)"}</p>
        </div>
      </div>
    </>
  );
}

export default Presentation;
