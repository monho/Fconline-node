const API_KEY =
  "test_e9335a6787866a3cc9067b9336d410d9deda234d1ecd92a9b62e5b50be43978e09a938e49b96a3c2f6bbfda5e4ea66eb";

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
