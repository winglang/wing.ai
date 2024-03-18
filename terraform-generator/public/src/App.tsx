import { WingLogo } from "./WingLogo";
import classNames from "classnames";
import { Chat } from "./chat";
import { TerraformFiles } from "./terraform";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function App() {
  const [terraform, setTerraform] = useState("");
  const [wing, setWing] = useState("");

  return (
    <>
      <div className=" bg-neutral-800 fixed h-full w-full -z-10"></div>
      <div className="p-6 h-full">
        <div
          className={classNames(
            "flex items-center font-sans font-normal text-white",
            "h-[80px] w-full",
          )}
        >
          <a
            href="https://winglang.io/"
            rel="noreferrer"
            className={classNames(
              "hover:text-slate-600 dark:hover:text-white mr-[16px] decoration-0",
            )}
          >
            <WingLogo className="h-[24px] w-[88px]" />
          </a>
        </div>
        <div className="flex gap-4 h-[85vh]">
          <Chat setTerraform={setTerraform} setWing={setWing} />
          <TerraformFiles terraform={terraform} wing={wing} />
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default App;
