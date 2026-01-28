export function fieldClass(isValid, submitAttempted, baseClass = "input") {
  return `${baseClass} ${!isValid && submitAttempted ? "input-error" : ""}`;
}

export function shouldShowError(isValid, submitAttempted, value) {
  return !isValid && (submitAttempted || value);
}