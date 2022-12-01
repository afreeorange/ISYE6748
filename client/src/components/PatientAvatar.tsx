import React from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/micah";

import "./PatientAvatar.css";

const Avatar: React.FC<{ seed: string }> = ({ seed }) => {
  return (
    <div
      className={`patient-avatar ${seed === "0" ? "no-patient-selected" : ""}`}
      dangerouslySetInnerHTML={{
        __html: createAvatar(style, {
          seed,
        }),
      }}
    ></div>
  );
};

export default Avatar;
