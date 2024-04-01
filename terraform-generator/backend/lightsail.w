bring "@cdktf/provider-aws" as aws;
bring "cdktf" as cdktf;

struct lightSailOptions {
  image: str;
  repository: str;
  port: num;
  env: Map<str>?;
}

pub class lightSail {
  pub url: str;
  new (options: lightSailOptions) {
    let containerService = new aws.lightsailContainerService.LightsailContainerService({
      name: "tf-generator",
      power: "nano",
      scale: 1,
      privateRegistryAccess: {
        ecrImagePullerRole: {
          isActive: true
        }
      }
    });

    let iamDocument = new aws.dataAwsIamPolicyDocument.DataAwsIamPolicyDocument({
      statement: { 
        effect: "Allow",
        principals: {
          type: "AWS",
          identifiers: [containerService.privateRegistryAccess.ecrImagePullerRole.principalArn]
        },
        actions: [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
        ]
      }
    });

    let policy = new aws.ecrRepositoryPolicy.EcrRepositoryPolicy({
        repository: options.repository,
        policy: iamDocument.json
    });

    let var ports = MutJson{};
    ports.set("{options.port}", "HTTP");
    
    let deployment = new aws.lightsailContainerServiceDeploymentVersion.LightsailContainerServiceDeploymentVersion({
      container: {
        container_name: containerService.name,
        image: options.image,
        environment: options.env,
        ports: Json.deepCopy(ports)
      },
      publicEndpoint: {
        containerName: containerService.name,
        containerPort: options.port,
        healthCheck: {
          healthyThreshold: 2,
          unhealthyThreshold: 2,
          timeoutSeconds: 2,
          intervalSeconds: 5,
          path: "/",
          successCodes: "200-499",
        }
      },
      serviceName: containerService.name,
    });

    new cdktf.TerraformOutput({value: containerService.url }) as "public_ip";
    this.url = containerService.url;
  }
}
