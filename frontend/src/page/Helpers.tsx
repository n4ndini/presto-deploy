// Helpers.ts
import axios from "axios";
import type { PresentationType, Store } from "../types";
// import { API_BASE_URL } from "../backend";

const API_BASE_URL = "http://localhost:5005";

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getStore = async (token: string): Promise<Store> => {
  const res = await axios.get(`${API_BASE_URL}/store`, { headers: getHeaders(token) });
  return res.data.store;
};

export const putStore = async (token: string, store: Store): Promise<void> => {
  await axios.put(`${API_BASE_URL}/store`, { store }, { headers: getHeaders(token) });
};

export const getPresentationById = async (token: string, id: number): Promise<PresentationType | null> => {
  const store = await getStore(token);
  return store.presentations.find((p) => p.id === id) || null;
};

export const updatePresentation = async (token: string, updated: PresentationType): Promise<void> => {
  const store = await getStore(token);
  const updatedStore: Store = {
    ...store,
    presentations: store.presentations.map((p) => p.id === updated.id ? updated : p),
  };
  await putStore(token, updatedStore);
};

export const deletePresentationById = async (token: string, id: number): Promise<void> => {
  const store = await getStore(token);
  const updatedStore: Store = {
    ...store,
    presentations: store.presentations.filter((p) => p.id !== id),
  };
  await putStore(token, updatedStore);
};
