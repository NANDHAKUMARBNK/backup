import axios from "axios";
const apiConfig = axios.create({
  baseURL: "/api/",
});
export default apiConfig;
