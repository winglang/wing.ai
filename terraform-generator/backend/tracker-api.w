bring cloud;
bring dynamodb;
bring util;

struct EventSchema {
  id: str;
  prompt: str;
  origin: str;
  generatedCode: str;
  existingCode: str;
  hasError: bool;
}

pub class TrackerApi {
  pub url: str;
  new() {
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

    let trackerApi = new cloud.Api();
    trackerApi.post("/track", inflight (req) => {
      // TODO: adding an auth layer
      try {
        let body = EventSchema.parseJson(req.body ?? "");
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
    this.url = trackerApi.url;
  }
}