import { toast } from "react-toastify";

export const CopyTerraform = ({ value }: { value: string }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(value);
    toast("terraform code was copied to your clipboard!");
  };
  return (
    <button
      onClick={handleCopyClick}
      title="copy"
      className="disabled:text-gray-450"
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

export const DownloadTerraform = ({ value }: { value: string }) => {
  const handleDownloadClick = () => {
    const element = document.createElement("a");
    const file = new Blob([value], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "main.tf";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    toast("terraform file was downloaded successfully!");
  };
  return (
    <button
      title="download"
      className="disabled:text-gray-450"
      onClick={handleDownloadClick}
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
