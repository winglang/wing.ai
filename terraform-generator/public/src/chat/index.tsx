import { Instructions } from "../instructions";
import { useSelector } from "react-redux";
import { Role, RootState } from "../state/root";
import { AiInput } from "../landing/input";
import { CopyTerraform, DownloadTerraform } from "./terraform";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function toBinary(str: string): string {
  const codeUnits = new Uint16Array(str.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = str.charCodeAt(i);
  }
  return window.btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

export const Chat = () => {
  const messages = useSelector((state: RootState) => state.messages);
  const wing = useSelector((state: RootState) => state.wing);
  const navigate = useNavigate();

  useEffect(() => {
    if (!messages.length) {
      navigate("/");
    }
  }, [messages, navigate]);

  return (
    <div className="grid grid-cols-2 grid-rows-1 h-full">
      <div className="flex flex-col rounded px-6 w-full h-full">
        <div className="rounded-lg  p-6 my-4 bg-gray-3 flex-grow flex flex-col gap-2 overflow-auto">
          {messages.map(({ role, message, isTerraform }, i) => (
            <div
              key={i}
              className={`p-4 text-gray-200 relative min-w-[150px] rounded-lg ${
                role === Role.User
                  ? "bg-gray-4 self-start"
                  : " bg-gray-2 self-end"
                // ? "rounded-e-xl rounded-es-xl bg-gray-600 self-start"
                // : "rounded-s-xl rounded-ee-xl bg-gray-700 self-end mb-1"
              } ${isTerraform ? "w-full" : ""}`}
            >
              {isTerraform ? (
                <div className=" text-xs">
                  <div className="absolute right-6 flex gap-2">
                    <CopyTerraform value={message} />
                    <DownloadTerraform value={message} />
                  </div>
                  {message.split("\n").map((e, i) => (
                    <code className="block" key={i}>
                      {e}
                    </code>
                  ))}
                </div>
              ) : (
                message
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <AiInput />
          <Instructions />
        </div>
      </div>
      <div className=" border-slate-700 flex flex-col items-center justify-center my-2 overflow-hidden">
        <iframe
          className="w-full h-full rounded-lg mt-2"
          src={`https://playground-git-tsuf-stealing-machines-monada.vercel.app/?theme=dark&layout=6&full=1&code=${toBinary(
            //TODO: replace URL
            wing || "bring cloud;",
          )}`}
        />
        <a
          className="text-blue-400"
          target="_blank"
          href={`https://www.winglang.io/play/?theme=dark&code=${toBinary(
            wing || "bring cloud;",
          )}`}
        >
          link to the playground
        </a>
      </div>
    </div>
  );
};
