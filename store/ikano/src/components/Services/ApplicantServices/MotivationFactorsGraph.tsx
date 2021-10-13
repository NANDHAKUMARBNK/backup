import apiConfig from "../../Config/config";
const getMotivationAPI = () => {
  return apiConfig
    .get("/applicant/motivationfactors")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};
const getIkanoValuesAPI = () => {
  return apiConfig
    .get("/applicant/ikanovalues")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};
const availablePositionsAPI = () => {
  return apiConfig
    .get("/applicant/jobpositions")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};
export { getMotivationAPI, getIkanoValuesAPI, availablePositionsAPI };
