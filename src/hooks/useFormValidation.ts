import { useState, useCallback } from 'react';
import { validateForm, ValidationRules, ValidationErrors } from '../utils/validation';

export const useFormValidation = (initialData: any, rules: ValidationRules) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((field: string, value: any) => {
    const fieldErrors = validateForm({ [field]: value }, { [field]: rules[field] });
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field] || ''
    }));
  }, [rules]);

  const handleChange = useCallback((field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, data[field]);
  }, [data, validateField]);

  const validateAll = useCallback(() => {
    const allErrors = validateForm(data, rules);
    setErrors(allErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(allErrors).length === 0;
  }, [data, rules]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};