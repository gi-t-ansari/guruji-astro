import { Typography } from "@material-tailwind/react";
import React from "react";

const FormReview = ({ name, value }) => {
  return (
    <Typography
      variant="paragraph"
      className="text-sm mb-2 flex gap-1 items-center text-blue-gray-800"
    >
      <span className="font-bold">{`${name}: `}</span> {value}
    </Typography>
  );
};

export default FormReview;
