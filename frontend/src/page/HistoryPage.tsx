import { useParams } from "next/navigation";
import { useNavigate } from "react-router-dom";
import type { HistoryEntry } from "../types";
import { useEffect, useState } from "react";
import { getPresentationById, updatePresentation } from "./Helpers";

function HistoryPage() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  useEffect(() => {
    const load = async () => {
      const presentation = await getPresentationById(token!, Number(id));
      if (!presentation) return;
      setHistory(presentation.history || []); 
    };
    load();
  }, []);

  // used to restore curr history to curr presentation
  const restore = async (entry: HistoryEntry) => {
    const presentation = await getPresentationById(token!, Number(id));
    const restored = {
      ...entry.snapshot,
      history: presentation?.history,
    };

    await updatePresentation(token!, restored);
    navigate(`/presentation/${id}?slide=0`);
  };

  

}
export default HistoryPage;
