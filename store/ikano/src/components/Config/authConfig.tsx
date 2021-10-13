import axios from "axios";
const authConfig = axios.create({
  baseURL: "/auth/",
});
export default authConfig;
