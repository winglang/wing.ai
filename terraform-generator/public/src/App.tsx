import { Chat } from "./routes/chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Landing } from "./routes/landing";
import { useDispatch } from "react-redux";
import { Role, addMessage, setId } from "./state/root";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { API_URL } from "./requests";

const socket = io(API_URL);

function App() {
  const dispatch = useDispatch();

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
      <div className=" bg-gray-1 fixed h-full w-full -z-10"></div>
      <div className="p-6 h-[90vh] text-[#dadada] font-light ">
        <div className="flex justify-start items-center">
          <img src="/terry.svg" />
          <p>the AI terraform generator</p>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Landing} />
            <Route path="/chat" Component={Chat} />
          </Routes>
        </BrowserRouter>
        <span className="flex justify-center items-center mt-6 gap-2 italic font-thin">
          powered by <img src="/wing.svg" />
        </span>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
