import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Step, Stepper, Typography } from "@material-tailwind/react";
import { USER_DETAILS_FORM_STEPS } from "../../config";
import { TiTick } from "react-icons/ti";
import ControllerInput from "../../common/components/fields/ControlledInput";
import FormReview from "../../common/components/FormReview/FormReview";

const LOCAL_STORAGE_KEY = "userDetailsForm";

const UserDetailsForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [loading, setLoading] = useState(false);

  /**---------------FORM VALIDATION---------------- */
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid input"),
    phone: yup
      .string()
      .required("Phone no. is required")
      .matches(/^\d+$/, "Phone no. must contain only numbers")
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    addressLine1: yup.string().required("Address is required"),
    addressLine2: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup
      .string()
      .required("ZIP Code is required")
      .matches(/^\d+$/, "ZIP Code must contain only numbers")
      .matches(/^\d{6}$/, "ZIP Code must be exactly 6 digits"),
  });

  const { handleSubmit, reset, control, trigger, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset(parsedData);
    }
  }, [reset]);

  // Save data to local storage on form change
  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleNext = async () => {
    let output;
    if (activeStep === 0) {
      output = await trigger(["name", "email", "phone"], {
        shouldFocus: true,
      });
    } else if (activeStep === 1) {
      output = await trigger(
        ["addressLine1", "addressLine2", "city", "state", "zipCode"],
        {
          shouldFocus: true,
        }
      );
    }

    if (!output) return;
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    !isFirstStep && setActiveStep((prevStep) => prevStep - 1);
  };

  const formValues = getValues();

  const submitForm = (data) => {
    if (data) {
      setLoading(true);
      console.log(data);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      reset();
      setActiveStep(0);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="w-full max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
    >
      <Typography
        variant="h4"
        className="text-center text-blue-gray-800 font-bold mb-4"
      >
        Multi-Step Form
      </Typography>
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        activeLineClassName="bg-green-600"
        className="mb-4"
      >
        {USER_DETAILS_FORM_STEPS?.map((step, i) => (
          <Step
            key={i}
            activeClassName="bg-primary"
            completedClassName="bg-green-600"
            className="flex-1"
          >
            {activeStep > i ? <TiTick className="text-lg" /> : i + 1}
          </Step>
        ))}
      </Stepper>
      <Typography variant="h5" className="mt-4 text-blue-gray-800 text-center">
        {USER_DETAILS_FORM_STEPS[activeStep]}
      </Typography>
      <section className="mt-4 w-full">
        {isFirstStep && (
          <>
            <ControllerInput
              control={control}
              name={"name"}
              label={"Name*"}
              type={"text"}
            />
            <ControllerInput
              control={control}
              name={"email"}
              label={"Email*"}
              type={"email"}
            />
            <ControllerInput
              control={control}
              name={"phone"}
              label={"Phone*"}
              type={"phone"}
            />
          </>
        )}
        {activeStep ===
          USER_DETAILS_FORM_STEPS.indexOf("Address Information") && (
          <>
            <ControllerInput
              control={control}
              name={"addressLine1"}
              label={"Address Line 1*"}
              type={"text"}
            />
            <ControllerInput
              control={control}
              name={"addressLine2"}
              label={"Address Line 2"}
              type={"text"}
            />
            <ControllerInput
              control={control}
              name={"city"}
              label={"City*"}
              type={"text"}
            />
            <ControllerInput
              control={control}
              name={"state"}
              label={"State*"}
              type={"text"}
            />
            <ControllerInput
              control={control}
              name={"zipCode"}
              label={"ZIP Code*"}
              type={"text"}
            />
          </>
        )}
        {isLastStep && (
          <>
            <h2 className="font-bold text-lg mb-1">Personal Information:</h2>
            <FormReview name={"Name"} value={formValues?.name} />
            <FormReview name={"Email"} value={formValues?.email} />
            <FormReview name={"Phone"} value={formValues?.phone} />
            <h2 className="font-bold text-lg mb-1 mt-4">
              Address Information:
            </h2>
            <FormReview
              name={"Address Line 1"}
              value={formValues?.addressLine1}
            />
            <FormReview
              name={"Address Line 2"}
              value={formValues?.addressLine2 ? formValues?.addressLine2 : "_"}
            />
            <FormReview name={"City"} value={formValues?.city} />
            <FormReview name={"State"} value={formValues?.state} />
            <FormReview name={"ZIP Code"} value={formValues.zipCode} />
          </>
        )}
      </section>
      <section className="mt-4 flex justify-between gap-2">
        <Button
          variant="outlined"
          className="border-primary text-primary"
          onClick={handlePrev}
          disabled={loading || isFirstStep}
        >
          Prev
        </Button>

        {!isLastStep && (
          <Button className="bg-primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {isLastStep && (
          <Button className="bg-primary" type="submit" disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 rounded-full animate-spin border-white border-t-2"></div>
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </section>
    </form>
  );
};

export default UserDetailsForm;
