export default function checkRegex(regex: RegExp, message: string) {
  return function (value: any) {
    return value && !regex.test(String(value).trim()) && message;
  };
}
