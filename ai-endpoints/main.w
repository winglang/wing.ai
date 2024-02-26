bring cloud;
bring http;
bring expect;
bring "./ai.w" as _ai;

let api = new cloud.Api(cors: true, corsOptions: {
allowOrigin: ["*"], allowHeaders: ["*"], allowMethods: [cloud.HttpMethod.POST]

});



let ai = new _ai.Ai();

api.post("/generate", inflight (req) => {
  try {
    if let conversationId = req.headers?.tryGet("conversation-id") {
      if let prompt = Json.parse(req.body ?? "").tryGet("prompt")?.tryAsStr() {
        let code = Json.parse(req.body ?? "").tryGet("code")?.tryAsStr();
        return  {
          status: 200,
          body: ai.generateContent(prompt, conversationId, code)
        };
      }
    return {
      status: 500,
      body: "no prompt found in the request body: {req.body}"
    };
  }
  return {
    status: 500,
    body: "conversation-id header is required " + Json.stringify(req.headers?.keys())
  };
  } catch e {
    return {
      status: 500,
      body: e
    };
  }
   
});

api.post("/fix", inflight (req) => {
  try {
    if let code = Json.parse(req.body ?? "").tryGet("code")?.tryAsStr() {
      return {
        status: 200,
        body: ai.fixCode(code)
      };
    }
    return {
      status: 500,
      body: "no code found in the request body: {req.body}"
    };
  } catch e {
    return {
      status: 500,
      body: e
    };
  }
});

new std.Test(inflight () => {
  // generate code
  // no conversation-id header
  let noHeaderRes = http.post(api.url + "/generate", {body: Json.stringify({prompt: ""})});
  expect.equal(noHeaderRes.status, 500);
  assert(noHeaderRes.body.contains("conversation-id header is required"));

  // with conversation id header, no prompt
  let noPromptRes = http.post(api.url + "/generate", {body: Json.stringify({}), headers: {"conversation-id": "123"}});
  expect.equal(noPromptRes.status, 500);
  assert(noPromptRes.body.contains("no prompt found in the request body"));
  
  // with cId, and prompt
  let validRes = http.post(api.url + "/generate", {body: Json.stringify({prompt: "create an hello world app"}), headers: {"conversation-id": "123"}});
  assert(validRes.ok);
  
  // fixcode
  // no code
  let noCode = http.post(api.url + "/fix", {body: Json.stringify({})});
  expect.equal(noCode.status, 500);
  assert(noCode.body.contains("no code found in the request body"));

  // with code
  let validFixRes = http.post(api.url + "/fix", {body: Json.stringify({code: "bring cloud"})});
  assert(validFixRes.ok);

}, {timeout: 5m}) as "testing api endpoints";

