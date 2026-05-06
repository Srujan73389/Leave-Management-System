import React, { useState } from 'react';
import './Tooltip.css'; // we'll create this

const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;