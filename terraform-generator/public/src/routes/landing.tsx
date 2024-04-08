import { useEffect } from "react";
import { Instructions } from "../componenets/instructions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, askAi, reset } from "../state/root";
import { AiInput } from "../componenets/input";
import { useNavigate } from "react-router-dom";

const examples = [
  "DynamoDB table with an atomic counter",
  "An S3 bucket and a Lambda with permissions to write to it",
  "A public S3 bucket",
  "Lambda that gets triggered by an SQS queue",
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

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const ask = (prompt: string) => {
    //@ts-expect-error some weird type stuff
    dispatch(askAi(prompt));
  };

  return (
    <div className="flex flex-col items-center pt-[8%] h-full gap-6 max-w-[600px] m-auto">
      <h4 className="font-medium text-4xl text-white">
        Create ready-to-use Terraform code using the following building blocks:
      </h4>

      <Instructions />
      <p className="text-md">
        Write your own prompt or try one of our examples:
      </p>

      <div className="grid grid-cols-2 w-full gap-4 mt-2">
        {examples.map((e, i) => (
          <button
            onClick={() => ask(e)}
            className="rounded-lg border bg-gray-1 w-full p-4 border-[#797979] text-sm font-normal hover:bg-neutral-800 text-start"
            key={i}
          >
            {e}
          </button>
        ))}
      </div>
      <AiInput placeholder="Let's build a..." />
    </div>
  );
};
