/**
 * Security-focused input validation and sanitization utilities
 */

// Input sanitization to prevent XSS attacks
export const sanitizeString = (input: string | undefined | null): string => {
  if (!input) return '';
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"']/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 1000); // Limit length as additional safety
};

// Validate and sanitize task title
export const validateTaskTitle = (title: string): { valid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(title);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, sanitized, error: 'Título é obrigatório' };
  }
  
  if (sanitized.length > 255) {
    return { valid: false, sanitized: sanitized.substring(0, 255), error: 'Título deve ter no máximo 255 caracteres' };
  }
  
  return { valid: true, sanitized };
};

// Validate and sanitize task description
export const validateTaskDescription = (description: string): { valid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(description);
  
  if (sanitized.length > 1000) {
    return { valid: false, sanitized: sanitized.substring(0, 1000), error: 'Descrição deve ter no máximo 1000 caracteres' };
  }
  
  return { valid: true, sanitized };
};

// Validate and sanitize discipline name
export const validateDisciplineName = (name: string): { valid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(name);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, sanitized, error: 'Nome da disciplina é obrigatório' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, sanitized: sanitized.substring(0, 100), error: 'Nome da disciplina deve ter no máximo 100 caracteres' };
  }
  
  // Check for alphanumeric + spaces + common Portuguese characters
  const validPattern = /^[a-zA-ZÀ-ÿ0-9\s\-\.\_]+$/;
  if (!validPattern.test(sanitized)) {
    return { valid: false, sanitized, error: 'Nome da disciplina contém caracteres inválidos' };
  }
  
  return { valid: true, sanitized };
};

// Validate date input
export const validateDate = (dateString: string): { valid: boolean; error?: string } => {
  if (!dateString) {
    return { valid: false, error: 'Data é obrigatória' };
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Data inválida' };
  }
  
  // Check if date is not too far in the past or future
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, 0, 1); // 1 year ago
  const maxDate = new Date(now.getFullYear() + 5, 11, 31); // 5 years in future
  
  if (date < minDate || date > maxDate) {
    return { valid: false, error: 'Data deve estar entre 1 ano atrás e 5 anos no futuro' };
  }
  
  return { valid: true };
};

// Rate limiting for API calls (simple client-side protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};