import { useEffect, useState } from "react";

const Instruction = ({
  imgSrc,
  name,
  description,
  hoverSrc,
}: // mousePosition,
{
  imgSrc: string;
  hoverSrc: string;
  name: string;
  description: string;
  // mousePosition: { x: number; y: number };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  return (
    <div className="cursor-pointer flex flex-col items-center">
      {isOpen && (
        <div
          className={`bg-neutral-700 z-20 p-3 mt-12 ml-[436px] rounded absolute max-w-[400px] text-xs`}
        >
          <h3 className="font-normal text-sm">{name}</h3>
          {description.split("\n").map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}
      <img
        className="h-[48px]"
        onMouseEnter={toggle}
        onMouseLeave={toggle}
        src={isOpen ? hoverSrc : imgSrc}
      />
    </div>
  );
};

const resources = [
  {
    imgSrc: "/icons/s3.svg",
    hoverSrc: "/icons/s3-hover.svg",
    name: "Bucket",
    description: `based on aws s3 or equivalent, a file storage.   
  Buckets are a common way to store arbitrary files (images, videos, etc.), but can also be used to store structured data like JSON or CSV files.
  Buckets in the cloud use object storage, which is optimized for storing large amounts of data with high availability. Unlike other kinds of storage like file storage, data is not stored in a hierarchical structure, but rather as a flat list of objects, each associated with a key.`,
  },
  {
    imgSrc: "/icons/counter.svg",
    hoverSrc: "/icons/counter-hover.svg",
    name: "Counter",
    description: `a stateful container for storing, retrieving and  one or more numbers in the cloud.`,
  },
  {
    imgSrc: "/icons/api-gateway.svg",
    hoverSrc: "/icons/api-gateway-hover.svg",
    name: "Api Gateway",
    description: `based on aws api gateway or equivalent, represents a collection of HTTP endpoints that can be invoked by clients over the internet. APIs often serve as the front door for applications to access data, business logic, or functionality from your backend services.
  The Api resource models an endpoint as a collection of routes, each mapped to an event handler function. A route is a combination of a path, like "/users/:userid" and a set of HTTP methods, like GET, POST, or DELETE. When a client invokes a route, the corresponding event handler function executes.
  `,
  },
  {
    imgSrc: "/icons/website.svg",
    hoverSrc: "/icons/website-hover.svg",
    name: "Website",
    description: `represents a static website that can be hosted in the cloud. 
  Websites are typically used to serve static content, such as HTML, CSS, and JavaScript files, which are updated whenever the application is redeployed.
  `,
  },
  {
    imgSrc: "/icons/sns.svg",
    hoverSrc: "/icons/sns-hover.svg",
    name: "Topic",
    description: `based on aws SNS or equivalent, represents a subject of data that is open for subscription.
  Topics are a staple of event-driven architectures, especially those that rely on pub-sub messaging to decouple producers of data and the consumers of said data.
  `,
  },
  {
    imgSrc: "/icons/sqs.svg",
    hoverSrc: "/icons/sqs-hover.svg",
    name: "Queue",
    description: `based on aws SQS or equivalent, represents a data structure for holding a list of messages. 
  Queues are typically used to decouple producers of data and the consumers of said data in distributed systems. 
  Queues by default are not FIFO (first in, first out) - so the order of messages is not guaranteed.`,
  },
  {
    imgSrc: "/icons/lambda.svg",
    hoverSrc: "/icons/lambda-hover.svg",
    name: "Function",
    description: `based on aws lambda or equivalent, a serverless function for performing short, stateless tasks. Functions are typically used to run business logic in response to events, such as a file being uploaded to a bucket, a message being pushed to a queue, or a timer expiring.
  When a function is invoked on a cloud provider, it is typically executed in a container/host which is provisioned on demand.
  Functions may be invoked more than once, and some cloud providers may automatically retry failed invocations. For performance reasons, most cloud providers impose a timeout on functions, after which the function is automatically terminated.
  `,
  },
  {
    imgSrc: "/icons/schedule.svg",
    hoverSrc: "/icons/schedule-hover.svg",
    name: "Schedule",
    description: `used to trigger events at a regular interval. 
  Schedules are useful for periodic tasks, such as running backups or sending daily reports. The timezone used in cron expressions is always UTC.
  `,
  },
];

export const Instructions = () => {
  return (
    <div className="flex gap-1">
      {resources.map((resource) => (
        <Instruction {...resource} key={resource.name} />
      ))}
    </div>
  );
};
