#! /bin/bash
set -e

wing compile -t tf-aws main.w

terraform -chdir=./target/main.tfaws init
terraform -chdir=./target/main.tfaws apply --auto-approve