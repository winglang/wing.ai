bring util;
bring containers;
bring sim;
// bring vite;
bring "@cdktf/provider-aws" as aws;
bring "./lightsail.w" as _ls;

pub struct repoContainerOptions {
  path: str;
  imageName: str;
  tag: str;
  port: num;
  env: Map<str>?;
}

struct execOptions {
  cwd: str;
}

pub class repoContainer {
  pub url: str;

  new(options: repoContainerOptions) {
    let path =repoContainer.resolve(options.path);
    let target = util.env("WING_TARGET");
    if (target == "sim") {
      // package docker
        let taggedName =  "{options.imageName}:{options.tag}";
        repoContainer.exec("docker build . -t {taggedName}", { cwd: options.path });

        let container = new sim.Container({
          image: taggedName, 
          name:options.imageName, 
          containerPort: options.port,
          env: options.env
          });

        this.url = "http://localhost:{container.hostPort ?? str.fromJson(options.port)}/";
    
      } elif (target == "tf-aws") {
        let repository = new containers.Repository(directory: path, name: options.imageName, tag: options.tag);
        let ecr: aws.ecrRepository.EcrRepository = unsafeCast(repository.deps.at(0));
        let container = new _ls.lightSail({image: repository.image, repository: ecr.name, port: options.port, env: options.env});
        this.url = container.url;
    }
    else {
      throw "unsupported target {target}";
    }
  }

  extern "./utils.js" static resolve(path: str ): str;
  extern "./utils.js" static exec(cmd: str, ops: execOptions? ): str;

}