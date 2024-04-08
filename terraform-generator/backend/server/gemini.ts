import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const MODEL_NAME = "gemini-1.0-pro-latest";
const API_KEY = process.env.GEMINI_API!;

export const YES = "yes";
export const NO = "no";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.5,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const INSTRUCTIONS = `
### Welcome to Wing's terraform generator!

This app helps you to create a terraform backends, 
by describing the connections between the following predefined building blocks:


**Bucket**- based on aws s3 or equivalent, a file storage. 
Buckets are a common way to store arbitrary files (images, videos, etc.), but can also be used to store structured data like JSON or CSV files.
Buckets in the cloud use object storage, which is optimized for storing large amounts of data with high availability. Unlike other kinds of storage like file storage, data is not stored in a hierarchical structure, but rather as a flat list of objects, each associated with a key.

**Function**- based on aws lambda or equivalent, a serverless function for performing short, stateless tasks. Functions are typically used to run business logic in response to events, such as a file being uploaded to a bucket, a message being pushed to a queue, or a timer expiring.
When a function is invoked on a cloud provider, it is typically executed in a container/host which is provisioned on demand.
Functions may be invoked more than once, and some cloud providers may automatically retry failed invocations. For performance reasons, most cloud providers impose a timeout on functions, after which the function is automatically terminated.

**Api**- based on aws api gateway or equivalent, represents a collection of HTTP endpoints that can be invoked by clients over the internet. APIs often serve as the front door for applications to access data, business logic, or functionality from your backend services.
The Api resource models an endpoint as a collection of routes, each mapped to an event handler function. A route is a combination of a path, like "/users/:userid" and a set of HTTP methods, like GET, POST, or DELETE. When a client invokes a route, the corresponding event handler function executes.

**Queue**- based on aws SQS or equivalent, represents a data structure for holding a list of messages. 
Queues are typically used to decouple producers of data and the consumers of said data in distributed systems. 
Queues by default are not FIFO (first in, first out) - so the order of messages is not guaranteed.

**Topic**- based on aws SNS or equivalent, represents a subject of data that is open for subscription.
Topics are a staple of event-driven architectures, especially those that rely on pub-sub messaging to decouple producers of data and the consumers of said data.

**Schedule**- used to trigger events at a regular interval. 
Schedules are useful for periodic tasks, such as running backups or sending daily reports. The timezone used in cron expressions is always UTC.

**Website**- represents a static website that can be hosted in the cloud. 
Websites are typically used to serve static content, such as HTML, CSS, and JavaScript files, which are updated whenever the application is redeployed.

**Counter**- a stateful container for storing, retrieving and  one or more numbers in the cloud. In aws represents a DynamoDB table with an atomic counter.
`;

export const validateInstructions = async (prompt: string) => {
  const context = `Given the following instructions:
  ${INSTRUCTIONS}
  The user ask for this prompt: "${prompt}".
  Does the prompt fit the instructions? Answer in one word- "yes" or "no".
  `;
  const chat = model.startChat({
    generationConfig,
    safetySettings,
  });

  const result = await chat.sendMessage(context);
  const response = result.response;
  return response.text();
};

const context = `
${readFileSync("./files/examples.txt", {
  encoding: "utf-8",
})}
${readFileSync("./files/std.txt", {
  encoding: "utf-8",
})}
${readFileSync("./files/wing-sdk.txt", { encoding: "utf-8" })}
  
You are a wing expert, you write only wing code in response.`;

export const generateContent = async (prompt: string, wing?: string) => {
  const chat = model.startChat({
    generationConfig,
    safetySettings,
  });

  const message = wing
    ? `${context}\n You generated the following wing code: \`\`\`wing ${wing}\n\`\`\`.\n ${prompt}`
    : `${context}\n${prompt}`;

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();

  // const result = await chat.sendMessageStream(prompt);
  // let response = "";
  // for await (const item of result.stream) {
  //   const block = item.candidates[0].content.parts[0].text;
  //   response += block;
  //   typeof cb === "function" && cb(block);
  // }
  // return response;
};
