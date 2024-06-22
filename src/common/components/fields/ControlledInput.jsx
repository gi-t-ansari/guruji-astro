import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@material-tailwind/react";

function ControllerInput({ control, name, label, type, icon }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="mb-4">
          <Input
            {...field}
            type={type}
            label={label}
            error={fieldState.error}
            size="lg"
            icon={icon}
          />{" "}
          {fieldState.error?.message && (
            <span className="text-xs text-red-500 ml-1">
              {fieldState.error?.message}
            </span>
          )}
        </div>
      )}
      defaultValue=""
    />
  );
}

export default ControllerInput;
