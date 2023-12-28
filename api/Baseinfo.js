const API_KEY =
  "live_e9335a6787866a3cc9067b9336d410d990c9f534532c7e04c6befe7059effef88169d67a8bd1347bc78b3ec9d1a5419d";

const BaseApiUrl = {
  baseURL: "https://open.api.nexon.com",
};

const headers = {
  "x-nxopen-api-key": API_KEY,
};

module.exports = {
  API_KEY,
  BaseApiUrl,
  headers,
};
