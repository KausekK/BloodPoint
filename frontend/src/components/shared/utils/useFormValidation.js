export function useFormValidation(form, rules) {
  const fields = {};
  let isValid = true;

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = form[field];

    const valid = fieldRules.every((fn) => fn(value));

    fields[field] = valid;

    if (!valid) {
      isValid = false;
    }
  });

  return { fields, isValid };
}