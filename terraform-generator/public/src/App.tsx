import { Chat } from "./routes/chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Landing } from "./routes/landing";
import { useDispatch } from "react-redux";
import { Role, addMessage, setId } from "./state/root";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { API_URL } from "./requests";

const socket = io(API_URL);

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      dispatch(setId(socket.id!));
    });

    socket.on("message", (message: string) => {
      console.log(message);
      dispatch(addMessage({ role: Role.AI, message }));
    });
  }, [dispatch]);

  return (
    <>
      <div
        className={`fixed h-full w-full -z-10 ${
          location.pathname === "/" ? "bg-gradient" : "bg-gray-1"
        }`}
      ></div>
      <div className="p-6 h-[90vh] text-[#dadada] font-light ">
        <Link to="/">
          <div className="flex justify-start items-center">
            <img src="/terry.svg" />
            <p>the AI terraform generator</p>
          </div>
        </Link>

        <Routes>
          <Route path="/" Component={Landing} />
          <Route path="/chat" Component={Chat} />
        </Routes>
        <span className="flex justify-center items-center mt-6 gap-2 italic font-thin">
          powered by{" "}
          <a href="https://www.winglang.io/" target="_blank">
            <img src="/wing.svg" />
          </a>
        </span>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
