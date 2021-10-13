import axios from "axios";
const axiosConfig = axios.create({
  // .. where we make our configurations
  baseURL: "https://pmo.spurtreetech.com/ru_api_dev/",
});

export default axiosConfig;
