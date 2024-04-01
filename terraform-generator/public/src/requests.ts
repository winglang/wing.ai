import { toast } from "react-toastify";
import "../.winglibs/wing-env.d.ts";

export const API_URL =
  window.wing?.env?.API_URL || import.meta.env.VITE_API_URL;

export enum Origin {
  Chat = "chat",
  Landing = "landing",
}

export const ask = async (
  prompt: string,
  id: string,
  wing?: string,
  origin?: Origin,
): Promise<
  { terraform?: string; wing?: string; error?: string } | undefined
> => {
  try {
    const res = await fetch(API_URL + "ask", {
      headers: {
        sId: id,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt, wing, origin }),
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
