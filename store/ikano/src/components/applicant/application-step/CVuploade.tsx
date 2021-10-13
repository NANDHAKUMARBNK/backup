import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useContext,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { uploadCVAPI } from "../../Services/ApplicantServices/LeadershipWords";
import BlockUI from "../../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
const CVuploade = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      return true;
    },
  }));
  const { t } = useTranslation();
  const [ErrorData, setErrorData]: any = useState("");
  const [cvMessage, setCvMessage]: any = useState("");
  const {
    setFIle,
    blockUi,
    setblockUi,
    isShowFile,
    setIsShowFile,
    cv,
    setCv,
  }: any = useContext(Context);

  function isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  function executeFileIfValid(file: any, e: any) {
    const allowedExtensions = [
      "pdf",
      "xls",
      "xlsx",
      "tiff",
      "pdf",
      "doc",
      "docx",
    ];
    const fileExtension = file.name.split(".").pop();
    if (isInArray(allowedExtensions, fileExtension)) {
      const size = file.size;
      if (size > 1024 * 1024 * 5) {
        e.preventDefault();
        setErrorData(t("File size should be below 5 MB"));
        setCv(null);
        setFIle("");
        return;
      } else {
        return file;
      }
    } else {
      e.preventDefault();
      setCv("");
      setFIle("");
      setErrorData(t("Selected file type is not allowed"));
      return;
    }
  }

  const upload = async (e: any) => {
    console.log(e.target.files);
    setblockUi(true);
    setCvMessage("");
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const validFile = executeFileIfValid(file, e);
      if (validFile) {
        setCvMessage("");
        setCv(e.target.files[0]);
        setIsShowFile(false);
        const response: any = await uploadCVAPI(e.target.files[0]);
        if (response && response.data) {
          setblockUi(false);
          setFIle(response.data);
          setErrorData("");
          setCvMessage("");
          setIsShowFile(true);
          return;
        }
        setblockUi(false);
      } else {
        setblockUi(false);
        setCvMessage("");
        return;
      }
    } else {
      setblockUi(false);
    }
  };
  const fileValue: any = t("Choose File");
  return (
    <React.Fragment>
      <div className="mb-5">
        <p className="thank ">{t("Please upload your CV below")}</p>
      </div>
      <div className="col-md-6 m-auto">
        <form>
          <div className="custom-file">
            {/* <input
              type="file"
              className="form-control  aplicant_Input cvFile"
              accept="*"
              onChange={upload}
            /> */}
            <div className="newCustomFile">
              <input
                type="button"
                className="form-control"
                value={fileValue}
                style={{ background: "#cdc8be" }}
                onClick={() => {
                  const inputTag: any = document.createElement("input");
                  inputTag.setAttribute("type", "file");
                  inputTag.setAttribute("accept", "*");
                  inputTag.onchange = upload;
                  inputTag.click();
                }}
              />
              <label>{cv ? cv.name : t("No file chosen")}</label>
            </div>
          </div>
          <p style={{ marginTop: "5px" }}>{isShowFile ? cv.name : ""}</p>
          <small className="mt-2">
            {t(
              "Max file size is 5MB and allowed formats are pdf, doc, docx, xls, xlsx, tiff"
            )}
          </small>
          <p className="mt-2" style={{ color: "red" }}>
            {cvMessage ? cvMessage : ""}
          </p>
        </form>
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            // left: "42%",
            // position: "relative",
          }}
        >
          {ErrorData ? ErrorData : ""}
        </p>
      </div>
      <div></div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </React.Fragment>
  );
});

export default React.memo(CVuploade);
