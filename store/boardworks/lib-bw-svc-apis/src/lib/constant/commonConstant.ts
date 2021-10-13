export const REFERENCE_TYPES = Object.freeze([
  { displayName: "CORPORATE INFORMATION", value: "CorporateInfo", id: 1 },
  { displayName: "DIRECTOR GUIDE", value: "DirectorsGuide", id: 2 },
  {
    displayName: "GENERAL BOARD INFORMATION",
    value: "GeneralBoardInfo",
    id: 3,
  },
]);
export const EVALUATION_QUESTIONS_TYPE = {
  text: "Text",
  textArea: "Note",
  boolean: "Boolean",
  dateTimePicker: "DateTime",
  checkbox: "Choice",
  number: "Number",
  opinion: "Opinion",
  radio: "Radio",
  combo: "Combo",
  textSingleLine: "TextSingleLine",
  textMultiLine: "TextMultiLine",
  date: "Date",
};

export const ROLES = {
  administrators: "Administrators",
  directors: "Directors",
  auditors: "Auditors",
  committeeAdmins: "CommitteeAdministrators",
  officers: "Officers",
  regulators: "Regulators",
  seniorOfficers: "SeniorOfficers",
  siteViewers: "SiteViewers",
  techAdmins: "TechnicalAdministrators",
  userAdmins: "UserAdministrators",
  documentAdmins: "DocumentAdministrators"
};

export const AREAS = Object.freeze([
  { displayName: "Alerts", value: "alerts", id: 1 },
  { displayName: "Communications", value: "communications", id: 2 },
  { displayName: "Contacts", value: "contacts", id: 3 },
  { displayName: "CorporateInformation", value: "corporateInfo", id: 4 },
  { displayName: "DirectorsGuide", value: "directorsGuide", id: 5 },
  { displayName: "GeneralBoardInfo", value: "generalBoardInfo", id: 6 },
  { displayName: "MeetingsEvents", value: "meetingsEvents", id: 7 },
  { displayName: "Discussions", value: "discussions", id: 8 },
  { displayName: "Links", value: "links", id: 9 },
  { displayName: "Surveys", value: "surveys", id: 10 },
  { displayName: "Votings", value: "votings", id: 11 },
  { displayName: "Profiles", value: "profiles", id: 12 },
  { displayName: "Collaboration", value: "collaboration", id: 13 },
  { displayName: "UserAdministration", value: "userAdmin", id: 14 },
  { displayName: "OfficerGroupAdministration", value: "officerGroupAdmin", id: 15 },
  { displayName: "CommitteeAdministration", value: "committeeAdmin", id: 16 },
  { displayName: "Evaluations", value: "evaluations", id: 17 }
])
