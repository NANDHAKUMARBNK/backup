import apiConfig from "../../Config/config";
const getLangugaesApi = () => {
  return apiConfig
    .get("/load")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};

export { getLangugaesApi };
