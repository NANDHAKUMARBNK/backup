import apiConfig from "../../Config/config";

const getLeadershipWordsAPI = () => {
  return apiConfig
    .get("/applicant/leadershipwords")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};

const uploadCVAPI = (file: any) => {
  const formData: any = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);
  return apiConfig
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return;
    });
};
export { getLeadershipWordsAPI, uploadCVAPI };
