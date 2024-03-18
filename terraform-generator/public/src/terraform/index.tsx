import { toast } from "react-toastify";

const Copy = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      title="copy"
      className="disabled:text-gray-450"
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 h-6 disabled:stroke-gray-450"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
        />
      </svg>
    </button>
  );
};

const Download = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      title="download"
      className="disabled:text-gray-450"
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </button>
  );
};

const replaceJsx = (text: string, strToReplace: string, className?: string) => {
  strToReplace;
  className;
  return text;
  // const textArray = text.split(strToReplace);
  // return textArray.map((str) => {
  //   console.log(str);
  //   if (str === strToReplace) {
  //     console.log(str);
  //     return <span className={className}>{str}</span>;
  //   }
  //   return str;
  // });
};

function toBinary(str: string): string {
  const codeUnits = new Uint16Array(str.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = str.charCodeAt(i);
  }
  return window.btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

export const TerraformFiles = ({
  terraform,
  wing,
}: {
  terraform: string;
  wing: string;
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(terraform);
    toast("terraform code was copied to your clipboard!");
  };

  const handleDownloadClick = () => {
    const element = document.createElement("a");
    const file = new Blob([terraform], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "main.tf";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    toast("terraform file was downloaded successfully!");
  };

  return (
    <div className="w-1/2 h-full flex flex-col">
      <div className="flex relative flex-col gap-2 rounded bg-black text-xs text-gray-100 h-full p-6 overflow-auto">
        <div className="absolute right-6 flex gap-2">
          <Copy onClick={handleCopyClick} disabled={!terraform} />
          <Download onClick={handleDownloadClick} disabled={!terraform} />
        </div>
        {terraform
          .replace(/= ".*.zip"/g, "= <filename placeholder>")
          .split("\n")
          .map((e, i) => (
            <code key={i} className="block">
              {replaceJsx(e, "= <filename placeholder>", "text-red-200")}
            </code>
          ))}
      </div>
      <div className="rounded h-[50%] border-slate-700 flex items-center justify-center my-2 relative overflow-hidden">
        <iframe
          className=" w-[80vw] h-[80vh] top-[-40%] right-[-2.5%] absolute"
          src={`https://playground-git-tsuf-stealing-machines-monada.vercel.app/?theme=dark&layout=6&code=${toBinary(
            //TODO: replace URL
            wing || "bring cloud;",
          )}`}
        />
      </div>
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
  );
};
