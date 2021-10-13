import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";

const getBenchReportsAPI = (targetValue) => {
  return axiosConfig
    .get(`/reportBench/${targetValue}`, { headers: Headers() })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return ErrorHandler(err);
    });
};

export { getBenchReportsAPI };
