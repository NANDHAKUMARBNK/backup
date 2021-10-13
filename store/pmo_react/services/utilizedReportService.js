import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getUtilizedReportsAPI = (targetValue) => {
  return axiosConfig
    .get(`/reportAllocationBySkill/${targetValue}`, { headers: Headers() })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return ErrorHandler(err);
    });
};

export { getUtilizedReportsAPI };
