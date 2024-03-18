import { execSync, spawn } from "child_process";
import {
  mkdtempSync,
  existsSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";
import express from "express";
import {
  INSTRUCTIONS,
  YES,
  generateContent,
  validateInstructions,
} from "./gemini";
const { jsonToTf } = require("json-to-tf");
import { Server } from "socket.io";

import cors from "cors";

const MAX_ATTEMPTS = 3;

const formatCode = (code: string) => {
  let isCode = false;
  return code.split("\n").reduce((acc, line) => {
    if (line.includes("```")) {
      isCode = !isCode;

      const newLine = line.replace(/```wing/g, "").replace(/```/g, "");
      return acc ? [acc, newLine].join("\n") : newLine;
    }
    const nextLine = isCode ? line : `// ${line}`;
    return acc ? [acc, nextLine].join("\n") : nextLine;
  }, "");
};

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const generateTempDirname = (id: string) =>
  mkdtempSync(join(tmpdir(), `wing-${id}`));

io.on("connection", (socket) => {
  console.log("connected! " + socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected! " + socket.id);
  });
});

io.listen(3001);

app.get("/instructions", async (req, res) => {
  res.send({ instructions: INSTRUCTIONS });
});

const emitMessage = (id: string | undefined, message: string) => {
  if (id) {
    io.sockets.sockets.get(id)?.emit("message", message);
  }
};

interface GenerateOptions {
  tempDir: string;
  prompt: string;
  id: string;
  maxAttempts: number;
  times?: number;
}

const generateWingCode = async (options: GenerateOptions): Promise<string> => {
  const { id, tempDir, times = 1, prompt } = options;

  emitMessage(id, `Generating wing code ${times > 1 ? "(again)" : ""}...`);

  const wing = formatCode(await generateContent(prompt));

  writeFileSync(join(tempDir, "main.w"), wing, { encoding: "utf-8" });
  console.log({ tempDir });

  try {
    emitMessage(id, `Compiling ${times > 1 ? "(again)" : ""}...`);
    execSync("wing compile -t tf-aws", { cwd: tempDir });
    return wing;
  } catch (error) {
    if (times < MAX_ATTEMPTS) {
      emitMessage(id, `The code isn't compiling. Trying to generate again`);
      return await generateWingCode({
        ...options,
        prompt: `Please resolve the errors in this wing code: ${wing}, using the following error messages: ${
          (error as Error).message
        }`,
        times: times + 1,
      });
    }
    console.log("time passed");
    throw error;
  }
};

app.post("/ask", async (req, res) => {
  const id = req.headers.sid as string;
  console.log({ namespace: id });
  const prompt = req.body?.prompt;
  if (!prompt) {
    res.status(500).json({ error: "Empty prompt" });
    return;
  }

  emitMessage(id, "Validating prompt...");
  const isValidPrompt = (await validateInstructions(prompt)) === YES;
  emitMessage(id, "Prompt is valid!");

  if (isValidPrompt) {
    try {
      let terraform;
      const tempDir = generateTempDirname(id);

      const wing = await generateWingCode({
        tempDir,
        prompt,
        id,
        maxAttempts: MAX_ATTEMPTS,
      });

      const terraformPath = join(tempDir, "target/main.tfaws/main.tf.json");

      if (existsSync(terraformPath)) {
        emitMessage(id, "Extracting terraform...");
        const tfOutput = readFileSync(terraformPath, {
          encoding: "utf-8",
        });
        const tfJson = JSON.parse(tfOutput);
        tfJson.terraform = undefined;
        tfJson.required_providers = undefined;
        terraform = jsonToTf(JSON.stringify(tfJson));

        rmSync(tempDir, { recursive: true });
        emitMessage(id, "Done!");
        return res.status(200).json({ wing, terraform, port: 3001 });
      }
      rmSync(tempDir, { recursive: true });
      console.log(wing);
      return res
        .status(500)
        .json({ error: "Could not compile wing code, we're sorry :(" });
    } catch (error) {
      console.log((error as Error).message);
      return res
        .status(500)
        .json({ error: "Error while generating terraform files" });
    }
  }

  return res.status(500).json({ error: "invalid prompt" });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log("server is up and running");
});
