import apiConfig from "../../Config/config";
import ErrorHandler from "../../Common/ErrorHandler";
import Headers from "../../Config/Headers";
const getAllCandidateDetailsFromSpecificJobPositionAPI = (jobId: any) => {
  return apiConfig
    .get(`/dashboard/jobpositions/candidates/${jobId}`, { headers: Headers() })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
const getCandidateDetailsFromSpecificJobPositionAPI = (candidateId: any) => {
  return apiConfig
    .get(`/dashboard/jobPositions/candidates/view/${candidateId}`, {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
const updateCandidateApplicationStatusAPI = (
  candidateId: any,
  applicationStatus: any
) => {
  return apiConfig
    .put(
      `/dashboard/jobpositions/candidates/updateStatus?candidateId=${candidateId}&status=${applicationStatus}`,
      {},
      {
        headers: Headers(),
      }
    )
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
const downloadCVAPI = (FilePath: any) => {
  return apiConfig
    .get(`/download?fileName=${FilePath}`, {
      headers: Headers(),
      responseType: "blob",
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
export {
  getAllCandidateDetailsFromSpecificJobPositionAPI,
  getCandidateDetailsFromSpecificJobPositionAPI,
  updateCandidateApplicationStatusAPI,
  downloadCVAPI,
};
