bring vite;
bring util;
bring "./repo-container.w" as _rc;
bring "./tracker-api.w" as tracker;

let trackerApi = new tracker.TrackerApi();

let container = new _rc.repoContainer(imageName: "tf-generator", tag: "a{util.nanoid(size: 6)}", path: "./server", port: 8081, env: {
  TRACKER_URL: "{trackerApi.url}/track"
});

let website = new vite.Vite(
  root: "../public",
  publicEnv: {
    API_URL: container.url,
  },
);
