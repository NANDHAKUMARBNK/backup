import React from "react";
function Edit(props: any) {
  return (
    <>
      <div className="model">
        <div className="container mt-4">
          <div className="card p-3">
            <div className="aplicantHome_Heading w-100">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 ">
                  <h3 className="heading">{props.props.title.heading} </h3>
                </div>
                <div className="col-md-6 col-sm-6 text-right">
                  <button
                    className="module-btn"
                    onClick={() =>
                      props.props.EditmoduleSet(!props.props.moduleEidt)
                    }
                  >
                    <label>X</label>
                  </button>
                </div>
              </div>
            </div>
            <form className="row  mt-4">
              <div className="col-md-6">
                <div className="form-group m-b-32">
                  <input
                    type="text"
                    className="form-control aplicant_Input"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Company/Organisation"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group m-b-32">
                  <input
                    type="text"
                    className="form-control aplicant_Input"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Position"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group m-b-32">
                  <input
                    type="text"
                    className="form-control aplicant_Input"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Location"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group m-b-32">
                  <input
                    type="text"
                    className="form-control aplicant_Input"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Website URL"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="address col-md-12">Starting From :</div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <select className="form-control form-control-sm">
                      <option className="aplicant_Input">Month</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <select className="form-control  form-control-sm">
                      <option className="aplicant_Input">Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="address col-md-12">Ending In :</div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <select className="form-control form-control-sm">
                      <option className="aplicant_Input">Month</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <select className="form-control form-control-sm">
                      <option className="aplicant_Input">Year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-12 col-sm-12 mt-4">
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                  ></textarea>
                </div>
              </div>
              <div className="col-md-4 m-auto mt-4">
                <button className="rectangle mb-2">
                  <label>Submit</label>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
