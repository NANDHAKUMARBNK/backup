import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { getLeadershipWordsAPI } from "../../Services/ApplicantServices/LeadershipWords";
import BlockUI from "../../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
const LeaderShipWords = forwardRef((props, ref: any) => {
  const [WarningMessage, setWarningMessage]: any = useState("");
  useImperativeHandle(ref, () => ({
    data() {
      if (demo()) {
        return true;
      } else {
        return false;
      }
    },
  }));
  const {
    words,
    setWords,
    UserSelection,
    setUserSelection,
    blockUi,
    setblockUi,
  }: any = useContext(Context);
  const { t } = useTranslation();
  function demo() {
    const onlyClicked: any = words.filter(
      (item: any) => item.isClicked === true
    );
    if (onlyClicked.length === 8) {
      setWarningMessage("");
      return true;
    } else {
      setWarningMessage(t("Select 8 statements"));
      return false;
    }
  }
  useEffect(() => {
    if (UserSelection.length === 0) {
      LeaderShipWordsAPI();
    }
  }, []);
  const LeaderShipWordsAPI = async () => {
    setblockUi(true);
    const response: any = await getLeadershipWordsAPI();
    if (response && response.data) {
      setblockUi(false);
      setWords(
        response.data.map((item: any) => {
          return {
            isClicked: false,
            id: item.id,
            word: item.word,
          };
        })
      );
    }
  };
  const selectWord = (id: any) => {
    setWarningMessage("");
    const result: any = words.find((item: any) => {
      return item.id === id;
    });
    if (result.isClicked) {
      const a: any = UserSelection.filter((el: any) => el.id != result.id);
      setUserSelection(a);
      setWords(
        words.map((item: any) => {
          if (item.id === id) {
            item.isClicked = false;
            return item;
          }
          return item;
        })
      );
    } else {
      if (words.filter((ele: any) => ele.isClicked).length < 8) {
        setUserSelection([...UserSelection, result]);
        setWords(
          words.map((item: any) => {
            if (item.id === id) {
              item.isClicked = !item.isClicked;
              return item;
            }
            return item;
          })
        );
      }
    }
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="headingLeadership">
            {t("Pick the 8 statements that describes you the best")}
          </div>
          <div className="row no-gutters">
            <ul className="leadershipWords">
              {words &&
                words.length &&
                words.map((item: any) => (
                  <li
                    className="leadershipWordsChild"
                    id={item.id}
                    onClick={() => {
                      selectWord(item.id);
                    }}
                    style={{
                      color: item.isClicked ? "#EC0801" : "#282828",
                      fontWeight: item.isClicked ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                  >
                    {t(item.word)}
                  </li>
                ))}
            </ul>
            <p
              style={{
                color: "red",
                fontWeight: "bold",
                left: "42%",
                position: "relative",
              }}
            >
              {WarningMessage ? WarningMessage : ""}
            </p>
          </div>
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </React.Fragment>
  );
});

export default React.memo(LeaderShipWords);
