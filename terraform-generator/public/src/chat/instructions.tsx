import { useState } from "react";
import Markdown from "react-markdown";

const Instruction = ({
  imgSrc,
  name,
  description,
}: {
  imgSrc: string;
  name: string;
  description: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  return (
    <>
      {isOpen && (
        <div
          className="absolute top-0 right-0 h-full w-full bg-[rgba(0,0,0,0.8)] flex justify-center items-start z-10"
          onClick={toggle}
        >
          <div className="bg-neutral-700 z-20 p-10 m-[20%] text-gray-100 rounded relative">
            <button className="absolute right-2 top-2 hover:text-gray-400 z-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="font-semibold text-lg text-gray-400">{name}</h3>
            {description.split("\n").map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        </div>
      )}
      <div
        className="cursor-pointer flex flex-col items-center"
        onClick={toggle}
      >
        <img className="h-[72px]" src={imgSrc} />
        <p className="text-gray-500 text-sm hover:text-gray-400">{name}</p>
      </div>
    </>
  );
};

const resources = [
  {
    imgSrc: "/s3.svg",
    name: "Bucket",
    description: `based on aws s3 or equivalent, a file storage.   
  Buckets are a common way to store arbitrary files (images, videos, etc.), but can also be used to store structured data like JSON or CSV files.
  Buckets in the cloud use object storage, which is optimized for storing large amounts of data with high availability. Unlike other kinds of storage like file storage, data is not stored in a hierarchical structure, but rather as a flat list of objects, each associated with a key.`,
  },
  {
    imgSrc: "/counter.jpeg",
    name: "Counter",
    description: `a stateful container for storing, retrieving and  one or more numbers in the cloud.`,
  },
  {
    imgSrc: "/api.png",
    name: "Api Gateway",
    description: `based on aws api gateway or equivalent, represents a collection of HTTP endpoints that can be invoked by clients over the internet. APIs often serve as the front door for applications to access data, business logic, or functionality from your backend services.
  The Api resource models an endpoint as a collection of routes, each mapped to an event handler function. A route is a combination of a path, like "/users/:userid" and a set of HTTP methods, like GET, POST, or DELETE. When a client invokes a route, the corresponding event handler function executes.
  `,
  },
  {
    imgSrc: "/website.png",
    name: "Website",
    description: `represents a static website that can be hosted in the cloud. 
  Websites are typically used to serve static content, such as HTML, CSS, and JavaScript files, which are updated whenever the application is redeployed.
  `,
  },
  {
    imgSrc: "/sns.jpeg",
    name: "Topic",
    description: `based on aws SNS or equivalent, represents a subject of data that is open for subscription.
  Topics are a staple of event-driven architectures, especially those that rely on pub-sub messaging to decouple producers of data and the consumers of said data.
  `,
  },
  {
    imgSrc: "/sqs.jpeg",
    name: "Queue",
    description: `based on aws SQS or equivalent, represents a data structure for holding a list of messages. 
  Queues are typically used to decouple producers of data and the consumers of said data in distributed systems. 
  Queues by default are not FIFO (first in, first out) - so the order of messages is not guaranteed.`,
  },
  {
    imgSrc: "/lambda.png",
    name: "Function",
    description: `based on aws lambda or equivalent, a serverless function for performing short, stateless tasks. Functions are typically used to run business logic in response to events, such as a file being uploaded to a bucket, a message being pushed to a queue, or a timer expiring.
  When a function is invoked on a cloud provider, it is typically executed in a container/host which is provisioned on demand.
  Functions may be invoked more than once, and some cloud providers may automatically retry failed invocations. For performance reasons, most cloud providers impose a timeout on functions, after which the function is automatically terminated.
  `,
  },
  {
    imgSrc: "/lambda.png",
    name: "Schedule",
    description: `used to trigger events at a regular interval. 
  Schedules are useful for periodic tasks, such as running backups or sending daily reports. The timezone used in cron expressions is always UTC.
  `,
  },
];

export const Instructions = () => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-gray-100 text-md">
        This app helps you to create a terraform backends,
        <br /> by describing the connections between the following predefined
        building blocks:
      </h4>
      <div className="flex gap-4">
        {resources.map((resource) => (
          <Instruction {...resource} key={resource.name} />
        ))}
      </div>
    </div>
  );
};
