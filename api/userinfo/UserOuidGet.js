import { API_KEY, BaseApiUrl, headers } from "../basinfo/BagicSet";

const UserOuidGet = await axios.get(
    BaseApiUrl.baseURRL + "/fconline/v1/id",
    headers,
);

