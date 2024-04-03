import { useEffect, useState } from "react";
import { Instructions } from "../componenets/instructions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, askAi } from "../state/root";
import { Action, Dispatch } from "@reduxjs/toolkit";
import { AiInput } from "../componenets/input";
import { useNavigate } from "react-router-dom";

const examples = [
  "Create an api",
  "Connect a lambda to a queue",
  "Create a public bucket",
  "Create a counter",
];

export const Landing = () => {
  const dispatch = useDispatch();
  const messagesLength = useSelector(
    (state: RootState) => state.messages.length,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesLength) {
      navigate("/chat");
    }
  }, [messagesLength, navigate]);

  const ask = (prompt: string) => {
    //@ts-expect-error some weird type stuff
    dispatch(askAi(prompt));
  };

  return (
    <div className="flex flex-col items-center pt-[8%] h-full gap-6 w-1/3 m-auto">
      <h4 className="display font-semibold text-4xl text-white">
        What shall we build?
      </h4>
      <p className="text-md">
        Write a prompt describing the connections between the <br />
        building blocks listed below to create Terraform backend.
      </p>
      <Instructions />
      <AiInput />

      <div className="grid grid-cols-2 w-full gap-4 mt-2 px-4">
        {examples.map((e, i) => (
          <button
            onClick={() => ask(e)}
            className="rounded-lg border w-full p-4 border-[#797979] text-sm font-normal hover:bg-neutral-800 text-start"
            key={i}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
};
