export default function FieldErrorList({ errors }: { errors: any[] }) {
  return (
    errors.length > 0 && (
      <div
        className="
        px-1.5 py-1
        bg-red-100
        outline outline-1 outline-red-400
        rounded"
      >
        {errors.map((error, i) => (
          <p className="text-sm text-red-500" key={`error-${i}`}>
            {error}
          </p>
        ))}
      </div>
    )
  );
}
