exports.Platform = class TFBackend {
  postSynth(config) {
    const { BUCKET, REGION, TABLE } = process.env;
    if (!BUCKET || !REGION || !TABLE) {
      throw new Error(
        "BUCKET, REGION or TABLE environment vars are missing for creating an s3 backend.",
      );
    }

    console.log(
      `Creating s3 backend using bucket: ${BUCKET} and table: ${TABLE} in region: ${REGION}`,
    );
    config.terraform.backend = {
      s3: {
        bucket: BUCKET,
        region: REGION,
        key: "terraform.tfstate",
        dynamodb_table: TABLE,
      },
    };
    return config;
  }
};
