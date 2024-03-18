import { useCallback, useEffect, useState } from "react";
import { Instructions } from "./instructions";
import { ask } from "../requests";
import { io } from "socket.io-client";

interface Message {
  sender: "user" | "ai";
  content: string;
}

const socket = io(import.meta.env.VITE_WS_URL);

const INITIAL_MESSAGES: Message[] = [];

export const Chat = ({
  setTerraform,
  setWing,
}: {
  setTerraform: (t: string) => void;
  setWing: (t: string) => void;
}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [prompt, setPrompt] = useState("");
  const [id, setId] = useState<string>();

  const addMessage = useCallback(
    (sender: "user" | "ai", content: string) => {
      setMessages([...messages, { sender, content }]);
    },
    [messages],
  );

  useEffect(() => {
    socket.on("connect", () => {
      setId(socket.id);
    });

    socket.on("message", (msg) => {
      addMessage("ai", msg);
    });
  }, [addMessage]);

  const generateTF = async () => {
    addMessage("user", prompt);
    setPrompt("");
    const res = await ask(prompt, id!);

    if (res) {
      const { terraform, wing, error } = res;
      if (error) {
        addMessage("ai", error);
      } else if (terraform) {
        setTerraform(terraform);
        wing && setWing(wing);
      }
    }
  };

  return (
    <div className="flex flex-col rounded px-6 w-1/2 h-full">
      <Instructions />
      <div className="rounded  p-6 my-4 bg-neutral-900 h-full flex flex-col gap-2 overflow-auto">
        {messages.map(({ sender, content }, i) => (
          <div
            key={i}
            className={`p-4 text-gray-200 min-w-[150px] ${
              sender === "ai"
                ? "rounded-e-xl rounded-es-xl bg-gray-600 self-start"
                : "rounded-s-xl rounded-ee-xl bg-gray-700 self-end mb-1"
            }`}
          >
            {content}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a terraform backend"
          className="border-2 rounded p-3 w-full bg-neutral-900 border-neutral-800 text-gray-400 outline-0"
        />
        <button
          className="border-0 rounded p-3 text-gray-100 bg-gray-500 hover:bg-gray-400 w-40 flex items-center justify-center gap-1"
          onClick={generateTF}
        >
          Generate <img src="/tf-white.svg" className="h-6" />
        </button>
      </div>
    </div>
  );
};
