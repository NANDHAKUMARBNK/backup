import React, {
  useState,
  useContext,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { getSkillsApplicantLookUpAPI } from "../../Services/AdminServices/AllJobPositions";
import BlockUI from "../../../common-themes/ui-blocker";
import Cancel from "../../../assets/Images/cancel.png";
import { useTranslation } from "react-i18next";
const Skills = forwardRef((props, ref: any) => {
  const {
    filterSkills,
    setFilterSkills,
    filterSkillvalue,
    filterSkillvalueset,
    Skills_,
    setSkills_,
    blockUi,
    setblockUi,
  }: any = useContext(Context);
  const [searchTerm, setSearchTerm]: any = useState("");
  const [ErrorData, setErrorData]: any = useState("");
  const { t } = useTranslation();
  useImperativeHandle(ref, () => ({
    data() {
      if (Skills_ && Skills_.length) {
        setErrorData("");
        return true;
      } else {
        setErrorData(t("Select atleast one skill"));
        return false;
      }
    },
  }));
  useEffect(() => {
    if (Skills_.length === 0) {
      SkillsLookup();
    }
  }, []);
  const SkillsLookup = async () => {
    setblockUi(true);
    const response: any = await getSkillsApplicantLookUpAPI();
    if (response && response.data) {
      setblockUi(false);
      response.data.sort((a: any, b: any) =>
        a.skillName > b.skillName ? 1 : -1
      );
      const result: any = response.data.map((item: any) => {
        return {
          isClicked: false,
          id: item.id,
          skill_name: item.skillName,
        };
      });
      filterSkillvalueset(result);
      setFilterSkills(result);
    }
  };
  useEffect(() => {
    if (filterSkillvalue) {
      const results: any = filterSkillvalue.filter((item: any) =>
        item.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilterSkills(results);
    }
  }, [searchTerm]);
  const handleChange = (e: any) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };
  const filterSkill = (id: any) => {
    setErrorData("");
    const result = filterSkills.find((item: any) => item.id === id);
    if (result.isClicked) {
      const result2 = Skills_.filter((item: any) => item.id !== id);
      setSkills_([...result2]);
      setFilterSkills(
        filterSkills.map((element: any) => {
          if (id === element.id) {
            element.isClicked = !element.isClicked;
            return element;
          }
          return element;
        })
      );
    } else {
      setSkills_([...Skills_, result]);
      setFilterSkills(
        filterSkills.map((element2: any) => {
          if (id === element2.id) {
            element2.isClicked = !element2.isClicked;
            return element2;
          }
          return element2;
        })
      );
    }
  };
  return (
    <React.Fragment>
      <div className="col-md-12 col-sm-12" style={{ marginBottom: "10%" }}>
        <div className="row">
          <div className="col-md-6">
            <div className="skils-right">
              <div className="form-group p-2 border-bottom">
                <input
                  type="text"
                  className="form-control  aplicant_Input"
                  value={searchTerm}
                  id="exampleFormControlInput1"
                  placeholder={t("Search Skills")}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12">
                <div className="skils-list">
                  <ul className="liststyle">
                    {filterSkills &&
                      filterSkills.map((item: any, index: any) => {
                        return (
                          <li
                            className="liststyle"
                            key={item.id}
                            onClick={() => {
                              filterSkill(item.id);
                            }}
                            style={{
                              color: item.isClicked ? "black" : "",
                              fontWeight: item.isClicked ? "bold" : "normal",
                              cursor: "pointer",
                            }}
                          >
                            {t(item.skill_name)}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <p className="thank">{t("Select your skills from the list")}</p>
            <div>
              <ul>
                {Skills_.map((elem: any) => {
                  return (
                    <li key={elem.id} className="sectedSkills mb-3">
                      {t(elem.skill_name)}
                      <img
                        src={Cancel}
                        onClick={() => {
                          filterSkill(elem.id);
                        }}
                      ></img>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
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
export default React.memo(Skills);
