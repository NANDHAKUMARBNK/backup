import apiConfig from "../../Config/config";

export const MnagerApplicantSubmitApi = (request: any) => {
  return apiConfig
    .post("/applicant/managerdetails/add", request)
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return error.response;
    });
};
// logout
export const FloorOperatorApplicantSubmitApi = (request: any) => {
  return apiConfig
    .post("/applicant/flooroperatordetails/add", request)
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return error.response;
    });
};
