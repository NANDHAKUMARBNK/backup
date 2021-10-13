import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getActiveProjectsListAPI = () => {
  return axiosConfig
    .get("/activeProjects", { headers: Headers() })
    .then((res) => {
      let activeList = res.data;
      return activeList;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};

const getCustomersAPI = () => {
  return axiosConfig
    .get("/customers", { headers: Headers() })
    .then((res) => {
      let activeList = res.data;
      return activeList;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getCostTypeAPI = () => {
  return axiosConfig
    .get("/costType", { headers: Headers() })
    .then((res) => {
      let resCostType = res.data;
      return resCostType;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getProjectTypeAPI = () => {
  return axiosConfig
    .get("/projectType?", { headers: Headers() })
    .then((res) => {
      let projectTypeRes = res.data;
      return projectTypeRes;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getEstimateAPI = () => {
  return axiosConfig
    .get("/estimateType", { headers: Headers() })
    .then((res) => {
      let estimateRes = res.data;
      return estimateRes;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
export {
  getActiveProjectsListAPI,
  getCustomersAPI,
  getProjectTypeAPI,
  getCostTypeAPI,
  getEstimateAPI,
};
