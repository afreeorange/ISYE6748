import React from "react";

import "./Offline.css";

const Offline: React.FC = () => (
  <div className="w-100 py-2 text-center offline">
    <strong>Please note:</strong> Our API costs a lot to run and is currently
    offline. Please see{" "}
    <a href="https://github.com/afreeorange/ISYE6748">our project repository</a>{" "}
    to run it yourself.
  </div>
);

export default Offline;
