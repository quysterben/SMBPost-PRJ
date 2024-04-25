import './TransferBtn.css';

import Proptypes from 'prop-types';
TransferButton.propTypes = {
  onClickAction: Proptypes.func
};

export default function TransferButton({ onClickAction }) {
  return (
    <button className="transferButton" onClick={onClickAction}>
      <div className="svg-wrapper-1">
        <div className="svg-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </div>
      <span>Transfer</span>
    </button>
  );
}
