// FIXME: comprehensive email validation is kind of annoying--so a naive check
// is probably OK for the purposes of this project:
const naiveEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function naiveEmail(message: string) {
  return function (value: string) {
    return !naiveEmailRegex.test(value.trim()) && message;
  };
}
