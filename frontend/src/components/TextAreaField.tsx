import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FormControl, FormLabel, Textarea, FormErrorMessage } from "@chakra-ui/core";

type TextAreaFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string };

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea {...field} {...props} id={field.name} placeholder={props.placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextAreaField;
