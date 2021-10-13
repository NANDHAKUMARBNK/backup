import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getResourceUtilizationAPI = () => {
  return axiosConfig
    .get("/resourceUtilization", {
      headers: Headers(),
    })
    .then((response) => {
      let resResourceUtilization = response.data;
      return resResourceUtilization;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getExecutionPeriodAPI = () => {
  return axiosConfig
    .get("/executionPeriod", { headers: Headers() })
    .then((response) => {
      let resExecutionPeriod = response.data;
      return resExecutionPeriod;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getProjectsAPI = () => {
  return axiosConfig
    .get("/projects", { headers: Headers() })
    .then((response) => {
      let resProjects = response.data;
      return resProjects;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const addCopyResourceUtilizationAPI = (reqData) => {
  return axiosConfig
    .post("/copyUtilization", reqData, { headers: Headers() })
    .then((response) => {
      let resCopyUtilization = response;
      return resCopyUtilization;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const createResourceUtilizationAPI = (req) => {
  return axiosConfig
    .post("/resourceUtilization", req, { headers: Headers() })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const editResourceUtilizationAPI = (request, Id) => {
  let id = Id;
  return axiosConfig
    .put(`/resourceUtilization/${id}`, request, {
      headers: Headers(),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getResourceUtilizationAPI_BasedOnId = (resourceId) => {
  return axiosConfig
    .get(`/resourceUtilization/${resourceId}`, {
      headers: Headers(),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const deleteResourceUtilizationAPI_BasedOnId = (resourceId) => {
  return axiosConfig
    .delete(`/resourceUtilization/${resourceId}`, {
      headers: Headers(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
export {
  getResourceUtilizationAPI,
  getExecutionPeriodAPI,
  getProjectsAPI,
  addCopyResourceUtilizationAPI,
  createResourceUtilizationAPI,
  editResourceUtilizationAPI,
  getResourceUtilizationAPI_BasedOnId,
  deleteResourceUtilizationAPI_BasedOnId,
};
