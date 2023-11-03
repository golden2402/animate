import FieldErrorList from "./field-error-list";

export default function FieldError({ errors }: { errors: any[] }) {
  return <FieldErrorList errors={[errors[0]].filter(Boolean)} />;
}
