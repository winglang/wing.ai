bring cloud;
bring util;
bring containers;
bring vite;
bring dynamodb;
bring "./repo-container.w" as _rc;
bring "@cdktf/provider-aws" as aws;

struct EventSchema {
  id: str;
  prompt: str;
  origin: str;
  generatedCode: str;
  existingCode: str;
  hasError: bool;
}


let trackerTable = new dynamodb.Table(
  attributes: [
    {
      name: "id",
      type: "S",
    },
    {
      name: "time",
      type: "N"
    }
  ],
  hashKey: "id",
  rangeKey: "time"
);

let trackerApi = new cloud.Api(); //TODO: cors settings
trackerApi.post("/track", inflight (req) => {
  try {
    let body = EventSchema.parseJson(req.body ?? "");
    // save to db: id (index), prompt (index), origin, wing-code, hasError (index), existingCode, timestamp (sort)
    trackerTable.put(
      Item: {
        id: body.id,
        prompt: body.prompt,
        origin: body.origin,
        generatedCode: body.generatedCode,
        existingCode: body.existingCode,
        hasError: body.hasError,
        time: datetime.systemNow().timestampMs
      },
    );
    log("item saved: {req.body ?? ""}");

    return { status: 200 };
  
    } catch e {
      log("error: {e}");
      return {status: 500, body: Json.stringify({ error: e}) };
    }

});

let container = new _rc.repoContainer(imageName: "tf-generator", tag: "7", path: "./backend/server", port: 8081, env: {
  TRACKER_URL: "{trackerApi.url}/track"
});


let website = new vite.Vite(
  root: "public",
  publicEnv: {
    API_URL: container.url,
  },
);
