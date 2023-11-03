export default function checkRegex(regex: RegExp, message: string) {
  return function (value: string) {
    return !regex.test(value.trim()) && message;
  };
}
