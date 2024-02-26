bring ex;
bring fs;
bring http;
bring "./types.w" as types;


pub class Ai {
  context: str;
  redis: ex.Redis;
  new () {
    this.redis = new ex.Redis();
    this.context = "
    You are a wing expert, writing only wing code.
    do not include the words \"--- END OF EXAMPLE ---\" in your answers.
    you learned wing by following this sdk reference: {fs.readFile("../files/wing-sdk.txt", {encoding: "utf-8"})}
    and this standard library reference: {fs.readFile("../files/std.txt", {encoding: "utf-8"})}
    and those examples: {fs.readFile("../files/examples.txt", {encoding: "utf-8"})}
    ONLY WRITE CODE IN YOUR ANSWERS";
    log(" ");
  }

  extern "./gemini.js" static inflight _generateContent(prompt: str, context: str, history: MutArray<types.History>, onStream: ((str): void)?): str;
  
  pub inflight generateContent(prompt: str, conversationId: str, code: str?): str {
    let var nextHistory = MutArray<types.History>[];
    if let history = this.redis.get(conversationId)  {
      nextHistory = types.HistoryList.parseJson(history).histories.copyMut();
    }
    if code != nil {
      let var i: num = nextHistory.length - 1;
      while i > 0 {
        if nextHistory.at(i).role == "model" {
          nextHistory.popAt(i);
          nextHistory.insert(i, {role: "model", parts: [{text: code!}]});
          break;
      }
      i = i+1;
      }
    }

    let aiResponse = Ai._generateContent(prompt, this.context, nextHistory);
    nextHistory.push({role: "user", parts: [{text: prompt}]});
    nextHistory.push({role: "model", parts: [{text: aiResponse}]});

    this.redis.set(conversationId, Json.stringify({histories: nextHistory.copy()}));
    return aiResponse;
  }

  pub inflight fixCode(code: str): str {
    // send a request to the compiler
    let res = http.post("https://re0pxufp83.execute-api.us-east-1.amazonaws.com/prod", {
      body: Json.stringify({ code: code, target: "sim"})
    });

    if let errors = Json.parse(res.body).tryGet("error")?.tryGet("stderr") {
      let parsedErrors = str.fromJson(errors);
      let prompt = "fix this code: ```\n{code}```\n according to those errors:\n ```{parsedErrors}```. ";

      let aiResponse = Ai._generateContent(prompt, this.context, MutArray<types.History>[]);
      return aiResponse;
    }
    let looksFine = "\\ this code looks fine :)";
    if (code.startsWith(looksFine)) {
      return code;
    }
    return "{looksFine}\n {code}";
  }
}
