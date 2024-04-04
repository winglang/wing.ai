import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { Origin, ask } from "../requests";

export enum Role {
  User = "user",
  AI = "ai",
}

export interface Message {
  role: Role;
  message: string;
  isTerraform?: boolean;
}

export interface RootState {
  messages: Message[];
  wing: string;
  loading: boolean;
  id?: string;
}

const initialState: RootState = {
  messages: [
    // { role: Role.User, message: "generate a bucket" },
    // { role: Role.AI, message: "ok!" },
    // {
    //   role: Role.AI,
    //   message: `resource "aws_s3_bucket" "cloudBucket" {
    //   bucket_prefix = "cloud-bucket-c87175e7-"
    //   force_destroy = false
    // }`,
    //   isTerraform: true,
    // },
  ],
  wing: "",
  loading: false,
};

const root = createSlice({
  name: "root",
  initialState: { ...initialState },
  reducers: {
    setId(state, action: { payload: string }) {
      state.id = action.payload;
    },
    addMessage(state, action: { payload: Message }) {
      if (
        state.messages[state.messages.length - 1]?.message ===
        action.payload.message
      ) {
        return state;
      }
      state.messages.push(action.payload);
    },

    setWing(state, action: { payload: string }) {
      state.wing = action.payload;
    },
    reset(state) {
      state.wing = "";
      state.messages = [];
    },
  },
});

export const { addMessage, setId, reset } = root.actions;
const { setWing } = root.actions;

export const askAi =
  (prompt: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(addMessage({ role: Role.User, message: prompt }));
    const { id, wing } = getState();
    const res = await ask(
      prompt,
      id!,
      wing,
      wing ? Origin.Chat : Origin.Landing, //TODO: to see if it can be omitted
    );

    if (res) {
      const { terraform, wing, error } = res;
      if (error) {
        dispatch(addMessage({ role: Role.AI, message: error }));
      }
      if (wing) {
        dispatch(setWing(wing));
      }
      if (terraform) {
        dispatch(
          addMessage({ role: Role.AI, message: terraform, isTerraform: true }),
        );
      }
    }
  };

export default root.reducer;
