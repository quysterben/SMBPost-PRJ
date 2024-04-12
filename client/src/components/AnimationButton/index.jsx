import { useNavigate } from 'react-router-dom';

import './AnimationBtn.css';

import PropTypes from 'prop-types';
AnimationButton.propTypes = {
  navigateLink: PropTypes.string
};

export default function AnimationButton({ navigateLink }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="button" onClick={() => navigate(navigateLink)}>
      <span className="button__text">New Order</span>
      <span className="button__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          height="24"
          fill="none"
          className="svg"
        >
          <line y2="19" y1="5" x2="12" x1="12"></line>
          <line y2="12" y1="12" x2="19" x1="5"></line>
        </svg>
      </span>
    </button>
  );
}
