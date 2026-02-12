import type { Question } from "@/types/question";
import type { SubmitResult } from "@/types/submit";
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

export const getQuestionById = async (id: string | undefined): Promise<Question> => {
  try {
    const res = await fetch(`${BASE_URL}/questions/${id}`, {
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
    return data.question;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export const pushToSubmiussionPipeline = async (id: string | undefined, language: string | undefined, userCode: string | undefined) => {
  try {
    const res = await fetch(`${BASE_URL}/questions/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        language,
        userCode,
      }),
    })
    if (res.status == 202) {
      return res;
    } else {
      throw new Error("Publishing to queue failed");
    }
  } catch (err) {
    console.error("Error: publishing to queue", err);
    throw err;
  }
}

export const startPolling = async (id: string | undefined): Promise<SubmitResult | null> => {
  try {
    console.log("sending req to polling thingy")
    const res = await fetch(`${BASE_URL}/submission/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    console.log("res recieved from polling thingy")
    if (res.status == 200) {
      const data = await res.json()
      return data.row;
    } else {
      throw new Error("hmmmmm");
    }
  }
  catch (err) {
    console.error("Error in polling ", err)
  }

  return null
}
