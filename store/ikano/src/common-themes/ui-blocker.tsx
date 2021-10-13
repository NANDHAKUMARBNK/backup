import React from "react";
import "./../components/styles/BlockUI.scss";
function BlockUI({ loader }: any) {
  return (
    <>
      {loader.blocking ? (
        <div className="block-ui-container">
          <div className="block-ui-overlay" />
          <div className="block-ui-message-container">
            <div className="block-ui-message">
              <h4>{loader.title}</h4>
              <div className="loading-indicator">
                <svg id="indicator" viewBox="0 0 100 100">
                  <circle id="circle" cx="50" cy="50" r="45" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default BlockUI;
