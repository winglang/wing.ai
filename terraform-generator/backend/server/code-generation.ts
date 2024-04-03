import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { Server } from "socket.io";
import { compile } from "@winglang/compiler";
import { YES, generateContent, validateInstructions } from "./gemini";
import { tmpdir } from "os";
import { Request, Response } from "express";
const { jsonToTf } = require("json-to-tf");

interface GenerateOptions {
  tempDir: string;
  prompt: string;
  id: string;
  maxAttempts: number;
  times?: number;
  wing?: string;
}

interface TrackingEvent {
  id: string;
  prompt: string;
  origin: string;
  generatedCode?: string;
  existingCode?: string;
  timing: number;
  hasError: boolean;
}

const MAX_ATTEMPTS = 3;

const generateTempDirname = (id: string) =>
  mkdtempSync(join(tmpdir(), `wing-${id}`));

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

const sendTrackingEvent = async (e: TrackingEvent) => {
  if (!process.env.TRACKER_URL) {
    console.error(`no tracker url.\n${JSON.stringify(e, null, 2)}`);
    return;
  }
  try {
    await fetch(process.env.TRACKER_URL, {
      body: JSON.stringify(e),
      method: "POST",
    });
  } catch (error) {
    console.log(error);
  }
};

const emitMessage = (id: string | undefined, message: string, io: Server) => {
  if (id) {
    io.sockets.sockets.get(id)?.emit("message", message);
  }
};

const generateWingCode = async (
  options: GenerateOptions,
  io: Server,
): Promise<string> => {
  const { id, tempDir, times = 1, prompt, wing: existingWingCode } = options;

  emitMessage(id, `Generating wing code ${times > 1 ? "(again)" : ""}...`, io);

  const wing = formatCode(await generateContent(prompt, existingWingCode));

  writeFileSync(join(tempDir, "main.w"), wing, { encoding: "utf-8" });
  console.log({ tempDir });

  try {
    emitMessage(id, `Compiling ${times > 1 ? "(again)" : ""}...`, io);
    await compile(join(tempDir, "main.w"), {
      platform: ["tf-aws"],
    });
    return wing;
  } catch (error) {
    if (times < MAX_ATTEMPTS) {
      emitMessage(id, `The code isn't compiling. Trying to generate again`, io);
      return await generateWingCode(
        {
          ...options,
          prompt: `Please resolve the errors in this wing code: ${wing}, using the following error messages: ${
            (error as Error).message
          }`,
          times: times + 1,
        },
        io,
      );
    }
    console.log("time passed");
    throw error;
  }
};

export const processAiRequest = async (
  req: Request,
  res: Response,
  io: Server,
) => {
  try {
    const timing = Date.now();
    const id = req.headers?.sid as string;
    const { prompt, wing: existingCode, origin } = req.body ?? {};

    if (!prompt) {
      return res.status(500).json({ error: "Empty prompt" });
    }

    emitMessage(id, "Validating prompt...", io);
    const isValidPrompt = (await validateInstructions(prompt)).includes(YES);

    if (isValidPrompt) {
      emitMessage(id, "Prompt is valid!", io);

      try {
        let terraform;
        const tempDir = generateTempDirname(id);

        const wing = await generateWingCode(
          {
            tempDir,
            prompt,
            id,
            wing: existingCode,
            maxAttempts: MAX_ATTEMPTS,
          },
          io,
        );

        const terraformPath = join(tempDir, "target/main.tfaws/main.tf.json");

        if (existsSync(terraformPath)) {
          emitMessage(id, "Extracting terraform...", io);
          const tfOutput = readFileSync(terraformPath, {
            encoding: "utf-8",
          });
          const tfJson = JSON.parse(tfOutput);
          tfJson.terraform = undefined;
          tfJson.required_providers = undefined;
          terraform = jsonToTf(JSON.stringify(tfJson));

          rmSync(tempDir, { recursive: true });
          emitMessage(id, "Done!", io);
          sendTrackingEvent({
            id,
            prompt,
            existingCode,
            origin,
            generatedCode: wing,
            hasError: false,
            timing: Date.now() - timing,
          });
          return res.status(200).json({ wing, terraform });
        }
        rmSync(tempDir, { recursive: true });
        console.log(wing);
        sendTrackingEvent({
          id,
          prompt,
          existingCode,
          generatedCode: wing,
          origin,
          hasError: true,
          timing: Date.now() - timing,
        });
        return res
          .status(500)
          .json({ error: "Could not compile wing code, we're sorry :(" });
      } catch (error) {
        console.log((error as Error).message);
        sendTrackingEvent({
          id,
          prompt,
          existingCode,
          origin,
          hasError: true,
          timing: Date.now() - timing,
        });
        return res
          .status(500)
          .json({ error: "Error while generating terraform files" });
      }
    }

    sendTrackingEvent({
      id,
      prompt,
      existingCode,
      origin,
      hasError: true,
      timing: Date.now() - timing,
    });

    return res.status(500).json({ error: "invalid prompt" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "unexpected error." });
  }
};
