bring cloud;
bring util;
bring containers;
bring vite;
bring "./lightsail.w" as _ls;
bring "./ec2.w" as helpers;
bring "@cdktf/provider-aws" as aws;


let repository = new containers.Repository(directory: helpers._util.resolve("./server"), name: "tf-generator", tag: "latest-4");
let x = new cloud.Endpoint(repository.image) as "ecrUrl";

let ecr: aws.ecrRepository.EcrRepository = unsafeCast(repository.deps.at(0));

let container = new _ls.lightSail(repository.image, ecr.name);

let website = new vite.Vite(
  root: "../public",
  publicEnv: {
    API_URL: container.url,
  },
);
