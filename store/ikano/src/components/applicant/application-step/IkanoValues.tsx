import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { useTranslation } from "react-i18next";
import "../Style/aplicant.scss";
import BlockUI from "../../../common-themes/ui-blocker";
import { getIkanoValuesAPI } from "../../Services/ApplicantServices/MotivationFactorsGraph";
const IkanoValues = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      if (UserChecked && UserChecked.length) {
        const checkedLenght = UserChecked.filter((res: any) => {
          if (res.ikanoOptions.find((val: any) => val.isChecked)) {
            return res;
          }
        });
        if (checkedLenght && checkedLenght.length === UserChecked.length) {
          setErrorData("");
          return true;
        } else {
          setErrorData(t("Please answer all questions"));
          return false;
        }
      } else {
        setErrorData(t("Please answer all questions"));
        return false;
      }
    },
  }));
  const {
    setIkanoValue,
    IkanoValue,
    UserChecked,
    setUserChecked,
    blockUi,
    setblockUi,
  }: any = useContext(Context);
  const { t } = useTranslation();
  useEffect(() => {
    if (UserChecked.length === 0) {
      IkanoValuesAPI();
    }
  }, []);
  const [Type, setType]: any = useState(null);
  const [ErrorData, setErrorData]: any = useState("");
  const IkanoValuesAPI = async () => {
    setblockUi(true);
    const response: any = await getIkanoValuesAPI();
    if (response && response.data) {
      setblockUi(false);
      setIkanoValue(
        response.data.map((item: any) => {
          return {
            id: item.id ? item.id : null,
            value: item.value ? item.value : t("Not Mentioned"),
            iconUrl: item.iconUrl ? item.iconUrl : t("Not Mentioned"),
            ikanoOptions: item.ikanoOptions.map((element: any) => {
              return {
                isChecked: false,
                id: element.id ? element.id : null,
                options: element.options ? element.options : t("Not Mentioned"),
              };
            }),
          };
        })
      );
    }
  };
  const handleBulkRadioButtons = (childId: any, parentId: any) => {
    IkanoValue.map((item: any) => {
      if (parentId === item.id) {
        item.ikanoOptions.map((element: any) => {
          if (element.id === childId) {
            element.isChecked = true;
          } else {
            element.isChecked = false;
          }
        });
      }
    });
    setIkanoValue(IkanoValue);
    setUserChecked(IkanoValue);
    setErrorData("");
  };
  return (
    <React.Fragment>
      <div className="col-md-12 col-sm-12">
        <div className="col-md-8 m-auto">
          <p className="thank mb-4 mt-3">
            {t("At Ikano we would like to get to know you better")}
          </p>
          <p className="thank mb-2 mt-2">
            {t("Select 1 sentence of each group that represent you best")}
          </p>
        </div>
        <form>
          {IkanoValue &&
            IkanoValue.length > 0 &&
            IkanoValue.map((item: any, index: any) => {
              return (
                <div className="row eachRow no-gutters">
                  <div className="col-md-2 ikanoIcons">
                    <img src={item.iconUrl} alt="" key={item.id} />
                  </div>
                  <div className="col-md-10">
                    {item.ikanoOptions &&
                      item.ikanoOptions.length > 0 &&
                      item.ikanoOptions.map((element: any) => {
                        return (
                          <div className="radio-item mb-3 my-2">
                            <input
                              type="radio"
                              id={element.id}
                              name={item.value}
                              value={element.id}
                              onChange={(e: any) => {
                                setType(e.target.value);
                                handleBulkRadioButtons(element.id, item.id);
                              }}
                              checked={element.isChecked}
                            />
                            <label
                              htmlFor={element.id}
                              className="radioIkanoValues"
                            >
                              {t(element.options)}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </form>
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            left: "42%",
            position: "relative",
          }}
        >
          {ErrorData ? ErrorData : ""}
        </p>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </React.Fragment>
  );
});

export default React.memo(IkanoValues);
