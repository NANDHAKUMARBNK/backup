import React from "react";
function CommanData(props: any) {
  return (
    <>
      <div className="rectangle-1 row">
        <div className=" col-lg-6 col-md-6 col-sm-12">
          <h3 className="heading">{props.props.title.t1} </h3>
          <h4 className="org-details"> {props.props.title.t2} </h4>
          <p className="thank text-left"> {props.props.title.t3} </p>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row float-right">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <button
                className="edit mb-2"
                onClick={() =>
                  props.props.EditmoduleSet(!props.props.moduleEidt)
                }
              >
                <label className="mb-0">Edit</label>
              </button>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <button
                className="edit mb-2"
                onClick={() =>
                  props.props.setDeletemodule(!props.props.Deletemodule)
                }
              >
                <label className="mb-0">Delete</label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommanData;
