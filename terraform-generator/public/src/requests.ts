import { toast } from "react-toastify";
import "../.winglibs/wing-env.d.ts";

const CONVERSATION_ID = "conversationId";

export const API_URL =
  window.wing?.env?.API_URL || import.meta.env.VITE_API_URL;

export const ask = async (
  prompt: string,
  id: string,
): Promise<
  { terraform?: string; wing?: string; error?: string } | undefined
> => {
  let conversationId = localStorage.getItem(CONVERSATION_ID);
  if (!conversationId) {
    conversationId = "a"; //uuid();
    localStorage.setItem(CONVERSATION_ID, conversationId); // TODO: add expiration
  }
  try {
    const res = await fetch(API_URL + "ask", {
      headers: {
        sId: id,
        "conversation-id": conversationId,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      method: "POST",
    });
    if (res.ok) {
      const { terraform, wing } = await res.json();
      return { terraform, wing };
    } else {
      const { error } = await res.json();
      toast.error(error);
      return { error };
    }
  } catch (error) {
    const msg = "An error occurred. Please try again.";
    toast.error(msg);
    return { error: msg };
  }
};
