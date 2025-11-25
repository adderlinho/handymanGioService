export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: any, rule: ValidationRule): string | null => {
  if (rule.required && (!value || value.toString().trim() === '')) {
    return 'Este campo es requerido';
  }

  if (!value || value.toString().trim() === '') return null;

  const stringValue = value.toString().trim();

  if (rule.minLength && stringValue.length < rule.minLength) {
    return `Mínimo ${rule.minLength} caracteres`;
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    return `Máximo ${rule.maxLength} caracteres`;
  }

  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return 'Formato inválido';
  }

  if (rule.min !== undefined && Number(value) < rule.min) {
    return `Valor mínimo: ${rule.min}`;
  }

  if (rule.max !== undefined && Number(value) > rule.max) {
    return `Valor máximo: ${rule.max}`;
  }

  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
};

export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Reglas comunes
export const commonRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^[0-9]{8}$/
  },
  salary: {
    required: true,
    min: 3000,
    max: 50000
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  price: {
    required: true,
    min: 0.01,
    max: 999999
  }
};