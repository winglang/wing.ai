bring util;
bring cloud;
bring "@cdktf/provider-aws" as aws;
bring "@cdktf/provider-tls" as tls;
bring "cdktf" as cdktf;



struct execOptions {
  cwd: str;
}

pub class _util {
  extern "./exec.js" static pub exec(cmd: str, ops: execOptions? ): str;
  extern "./exec.js" static pub resolve(path: str ): str;

}



pub class ec2 {
  pub ec2: aws.instance.Instance;
  new(imageUrl: str, ecrName: str) {

    new tls.provider.TlsProvider();

    let privateKey = new tls.privateKey.PrivateKey({algorithm: "RSA", rsaBits: 4096}) as "tld";
    let keyPair = new aws.keyPair.KeyPair({keyName: "keypair", publicKey: privateKey.publicKeyOpenssh});
   
    // ecr policy
    let rolePolicy =  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Action": "sts:AssumeRole",
              "Principal": {
                 "Service": "ec2.amazonaws.com"
              },
              "Effect": "Allow",
              "Sid": ""
          }
      ]
    };
    let role = new aws.iamRole.IamRole({path: "/", assumeRolePolicy: Json.stringify(rolePolicy)});
    let iamInstance = new aws.iamInstanceProfile.IamInstanceProfile({role: role.name});
    new aws.iamRolePolicyAttachment.IamRolePolicyAttachment({policyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly", role: role.name});

    let securityGroups = new aws.securityGroup.SecurityGroup(
      {
        ingress: [
        {
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: 8081,
          toPort: 8081,
          protocol: "tcp"
        },
        {
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: 22,
          toPort: 22,
          protocol: "tcp"
        },
        {
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: 8080,
          toPort: 8080,
          protocol: "tcp"
        },
        ],
        egress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            fromPort: 0,
            toPort: 0,
            protocol: "-1"
          },
        ]
      });

    let userData = "#! /bin/bash
    set -e
    
    sudo apt update
    sudo apt upgrade -y

    sudo snap install docker
    sudo apt install awscli -y
    
    sudo service snap.docker.dockerd start
    sudo chmod 777 /var/run/docker.sock
    
    # login to ecr
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {imageUrl}
    
    # pull image from ecr
    docker pull {imageUrl}
    
    # Run application at start
    docker run --platform linux/amd64 --restart=always -d -p 8080:8080 -p 8081:8081 {imageUrl}
    ";

    let ami = new aws.dataAwsAmi.DataAwsAmi({ mostRecent: true, filter:[ {name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20240301"],}]});

    this.ec2 = new aws.instance.Instance({
      ami: ami.id,
      instanceType: "t2.micro",
      iamInstanceProfile: iamInstance.name,
      keyName : keyPair.keyName,
      vpcSecurityGroupIds: [securityGroups.id],
      userData: userData,
      userDataReplaceOnChange: true
    });

  
    new cdktf.TerraformOutput({value: this.ec2.publicIp }) as "public_ip";
  }
}









// pub struct ImageBuilderOptions {
//   path: str;
//   imageName: str;
// }


// class ImageBuilderBase {
//   new(options: ImageBuilderOptions) {}

//   protected createDockerImage (options: ImageBuilderOptions): str {
//     let taggedName =  "{options.imageName}:latest";
//      _util.exec("docker build . -t {taggedName}", {cwd: options.path});
//      return taggedName;
//   }
// }


// pub class ImageBuilder {
//   pub imageUrl: str;
//   new(options: ImageBuilderOptions) {
//     let target = util.env("WING_TARGET");

//     if (target == "sim") {
//       this.imageUrl =  new SimImageBuilder(options).imageUrl;

//     } elif (target == "tf-aws") {
//       this.imageUrl =  new TfAwsImageBuilder(options).imageUrl;
//     } else {
//       throw "unsupported target {target}";
//     }
//   }
// }

// // build docker image from the path - with the wanted name, return the name.
// // on aws - declare ecr
// // push it to the ecr
// // return the ecr url

// class SimImageBuilder extends ImageBuilderBase {
//   pub imageUrl: str;
//   new(options: ImageBuilderOptions) {
//     this.imageUrl = this.createDockerImage(options);
//   }
// }


// class TfAwsImageBuilder extends ImageBuilderBase {
//   pub imageUrl: str;
//   new(options: ImageBuilderOptions) {
//     this.imageUrl = "";
//     let taggedImage = this.createDockerImage(options);

//     let ecr =  new aws.ecrRepository.EcrRepository({name: options.imageName, imageTagMutability: "MUTABLE", forceDelete: true });

//     // let taggedEcrImage = "{ecr.repositoryUrl}:latest";

//     // _util.exec("aws ecr get-login-password | docker login --username AWS --password-stdin {ecr.registryId}", {cwd: options.path});
//     // _util.exec("docker tag {taggedImage} {taggedEcrImage}", {cwd: options.path});
//     // _util.exec("docker push {taggedEcrImage}", {cwd: options.path});

//     this.imageUrl = ecr.repositoryUrl;
//   }

//   inflight onDeploy () {
    
//   }
// }





