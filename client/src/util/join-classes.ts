export default function joinClasses(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
