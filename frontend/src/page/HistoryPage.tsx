import { useParams } from "next/navigation";
import { useNavigate } from "react-router-dom";
import type { HistoryEntry } from "../types";
import { useEffect, useState } from "react";

function HistoryPage() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [history, setHistory] = useState<HistoryEntry[]>([]);
    
    useEffect(() => {
        const load = async () => {
            const presentation = await.getPresentationById(token!, Number(id));
            setHistory(presentation.history || []); 
        };
        load();
    }, []);

}
export default HistoryPage;
