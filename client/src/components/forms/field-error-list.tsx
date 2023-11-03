export default function FieldErrorList({ errors }: { errors: any[] }) {
  return (
    errors.length > 0 && (
      <div
        className="
        px-1.5 py-1
        rounded
        bg-red-100
        outline outline-1 outline-red-400
        text-xs text-red-500"
      >
        {errors.map((error, i) => (
          <p key={`error-${i}`}>{error}</p>
        ))}
      </div>
    )
  );
}
