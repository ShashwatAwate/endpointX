import type { Question } from "@/data/questions";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const res = await fetch(`${BASE_URL}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err || "Failed to fetch questions");
    }

    const data = await res.json();
    return data.questions;

  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
