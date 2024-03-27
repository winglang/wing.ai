bring "@cdktf/provider-aws" as aws;
bring "cdktf" as cdktf;

pub class lightSail {
  pub url: str;
  new (image: str, repository: str) {
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
        repository: repository,
        policy: iamDocument.json
    });
    
    let deployment = new aws.lightsailContainerServiceDeploymentVersion.LightsailContainerServiceDeploymentVersion({
      container: {
        container_name: containerService.name,
        image: image,
        ports: {
          "8080": "HTTP",
          "8081": "HTTP"
        }
      },
      publicEndpoint: {
        containerName: containerService.name,
        containerPort: 8080,
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

// data "aws_iam_policy_document" "default" {
//   statement {
//     effect = "Allow"

//     principals {
//       type        = "AWS"
//       identifiers = [aws_lightsail_container_service.default.private_registry_access[0].ecr_image_puller_role[0].principal_arn]
//     }

//     actions = [
//       "ecr:BatchGetImage",
//       "ecr:GetDownloadUrlForLayer",
//     ]
//   }
// }

// resource "aws_ecr_repository_policy" "default" {
//   repository = aws_ecr_repository.default.name
//   policy     = data.aws_iam_policy_document.default.json
// }

// resource "aws_lightsail_container_service" "flask_application" {
//   name = "flask-application"
//   power = "nano"
//   scale = 1
//   tags = {
//     version = "1.0.0"
//   }
// }

// resource "aws_lightsail_container_service_deployment_version" "flask_app_deployment" {
//   container {
//     container_name = "flask-application"

//     image = "treydegale/flask_app:0.0.3"
    
//     ports = {
//       # Consistent with the port exposed by the Dockerfile and app.py
//       5000 = "HTTP"
//     }
//   }

//   public_endpoint {
//     container_name = "flask-application"
//     # Consistent with the port exposed by the Dockerfile and app.py
//     container_port = 5000

//     health_check {
//       healthy_threshold   = 2
//       unhealthy_threshold = 2
//       timeout_seconds     = 2
//       interval_seconds    = 5
//       path                = "/"
//       success_codes       = "200-499"
//     }
//   }

//   service_name = aws_lightsail_container_service.flask_application.name
// }