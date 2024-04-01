import { useState } from "react";
import { useDispatch } from "react-redux";
import { askAi } from "../state/root";

const Up = () => (
  <svg
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="35"
      height="35"
      rx="8"
      className="fill-[#797979] hover:fill-neutral-400"
    />
    <path
      d="M9 16.7232L18.0064 7L27 16.7232L25.137 18.7483L21.9379 15.2946C21.5011 14.823 21.06 14.3329 20.6146 13.8243C20.1692 13.3065 19.7281 12.7886 19.2912 12.2708C19.3084 12.6869 19.3212 13.1123 19.3298 13.5469C19.3469 13.9723 19.3555 14.3884 19.3555 14.7952V28H16.6445V14.7952C16.6445 14.3791 16.6488 13.9584 16.6574 13.533C16.6745 13.0984 16.6916 12.6731 16.7088 12.2569C16.2805 12.7748 15.8394 13.2926 15.3854 13.8104C14.94 14.3283 14.4989 14.823 14.0621 15.2946L10.8758 18.7483L9 16.7232Z"
      className="fill-[#1D1D1D]"
    />
  </svg>
);

export const AiInput = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  const ask = (prompt: string) => {
    //@ts-expect-error some weird type stuff
    dispatch(askAi(prompt));
    setValue("");
  };
  return (
    <div className="w-full h-[54px] flex border my-4 rounded-lg  p-2 pl-4 border-[#797979]">
      <input
        className="bg-transparent outline-0 flex-grow"
        placeholder="Let's build a..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            ask(value);
          }
        }}
      />
      {value && (
        <button onClick={() => ask(value)}>
          <Up />
        </button>
      )}
    </div>
  );
};
