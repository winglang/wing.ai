bring cloud;
bring aws;

let api = new cloud.Api();

api.get("/starter-message", new cloud.Function(), {});
