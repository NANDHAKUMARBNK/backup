import React, { useState } from "react";
import AplicantHome from "../applicant-home/AplicantHome";
import { useParams } from "react-router-dom";
import {
  floorOperator,
  manager,
} from "../../../common-themes/controls-validation-and-constants";
export const Context = React.createContext({});
let ContextApi = (props: any) => {
  const params: any = useParams();
  const heading: any =
    params && params.aplicantType === "floor-operator"
      ? floorOperator
      : params && params.aplicantType === "manager"
      ? manager
      : [];
  const [next, setNext] = useState(1);
  const [data, setData] = useState([]);
  const [filedata, setFIle]: any = useState("");
  const [final, setfinal]: any = useState([]);
  const [functions, setFunction] = useState([]);
  const [fn, setFn]: any = useState("");
  const [ln, setLn]: any = useState("");
  const [em, setEm]: any = useState("");
  const [dob, setDob]: any = useState("");
  const [ph1, setPh1]: any = useState("");
  const [ph2, setPh2]: any = useState("");
  const [hn, setHn]: any = useState("");
  const [munici, setMunici]: any = useState("");
  const [munici2, setMunici2]: any = useState("");
  const [stName, setStName]: any = useState("");
  // const [city, setCity]: any = useState("");
  // const [state, setState]: any = useState("");
  const [zipcode, setZipcode]: any = useState("");
  const [gender, setGender]: any = useState([
    {
      id: 1,
      name: "Female",
      isClicked: false,
    },
    { id: 2, name: "Male", isClicked: false },
  ]);
  const [gen, setGen]: any = useState([]);
  const [maritalStatus, setMaritalStatus]: any = useState([
    {
      id: 11,
      name: "Single",
      isClicked: false,
    },
    {
      id: 12,
      name: "Married",
      isClicked: false,
    },
    {
      id: 13,
      name: "Other",
      isClicked: false,
    },
  ]);
  const [ms, setMs]: any = useState([]);
  const [PersonalInformation, setPersonalInformation]: any = useState({});
  const [EmploymeantData, SetEmploymeantData]: any = useState([]);
  const [EductionData, SetEductionData]: any = useState([]);
  const [blockUi, setblockUi]: any = useState(true);
  const [Skills_, setSkills_]: any = useState([]);
  const [filterSkills, setFilterSkills]: any = useState([]);
  const [Factors, setFactors]: any = useState([]);
  const [TooltipInfo, setTooltipInfo]: any = useState([]);
  const [FactorValue, setFactorvalue]: any = useState([]);
  const [filterSkillvalue, filterSkillvalueset]: any = useState([]);
  const [words, setWords]: any = useState([]);
  const [UserSelection, setUserSelection]: any = useState([]);
  const [IkanoValue, setIkanoValue]: any = useState([]);
  const [UserChecked, setUserChecked]: any = useState([]);
  const [isShowFile, setIsShowFile]: any = useState(false);
  const [cv, setCv]: any = useState(null);
  const nextPage = (a: any) => {
    setPersonalInformation({
      fn: fn,
      ln: ln,
      em: em,
      dob: dob,
      ph1: ph1,
      ph2: ph2,
      hn: hn,
      munici: munici,
      munici2: munici2,
      stName: stName,
      // city: city,
      // state: state,
      zipcode: zipcode,
      gender: gender,
      maritalStatus: maritalStatus,
    });

    if (a > 0 && a < heading.length) {
      setNext(a + 1);
    }
  };

  const backPage = (a: any) => {
    if (a > 1) {
      setNext(a - 1);
    }
  };

  let Sumbit = (a: any) => {
    setData({ ...final, ...data });
  };

  let nextData = (a: any) => {};
  const Edit = (e: any, list: any, setList: any) => {};

  const Remove = (id: any, list: any, setList: any, setModel: any) => {
    const newList = list.filter((item: any, index: any) => {
      return index !== id;
    });
    setList(newList);
    setModel({ module: false });
  };
  return (
    <Context.Provider
      value={{
        next,
        nextPage,
        backPage,
        Sumbit,
        data,
        setData,
        final,
        setfinal,
        nextData,
        functions,
        setFunction,
        EmploymeantData,
        SetEmploymeantData,
        Remove,
        Edit,
        EductionData,
        SetEductionData,
        words,
        setWords,
        blockUi,
        setblockUi,
        Factors,
        setFactors,
        TooltipInfo,
        setTooltipInfo,
        Skills_,
        setSkills_,
        filterSkills,
        setFilterSkills,
        filterSkillvalue,
        filterSkillvalueset,
        UserSelection,
        setUserSelection,
        setIkanoValue,
        IkanoValue,
        UserChecked,
        setUserChecked,
        setMaritalStatus,
        maritalStatus,
        gender,
        setGender,
        gen,
        setGen,
        ms,
        setMs,
        FactorValue,
        setFactorvalue,
        fn,
        ln,
        em,
        dob,
        ph1,
        ph2,
        setFn,
        setLn,
        setEm,
        setDob,
        setPh1,
        setPh2,
        hn,
        setHn,
        munici,
        setMunici,
        stName,
        setStName,
        // city,
        // setCity,
        // state,
        // setState,
        zipcode,
        setZipcode,
        PersonalInformation,
        setPersonalInformation,
        filedata,
        setFIle,
        munici2,
        setMunici2,
        isShowFile,
        setIsShowFile,
        cv,
        setCv,
      }}
    >
      <AplicantHome />
    </Context.Provider>
  );
};

export default ContextApi;
