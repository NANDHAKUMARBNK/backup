import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getProjectAPI = (projectID) => {
  return axiosConfig
    .get(`/projects/${projectID}`, { headers: Headers() })
    .then((response) => {
      let resProject = response.data;
      return resProject;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const editActiveProjectsAPI = (projectID, requestInfo) => {
  return axiosConfig
    .put(`/projects/${projectID}`, requestInfo, { headers: Headers() })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
export { getProjectAPI, editActiveProjectsAPI };
