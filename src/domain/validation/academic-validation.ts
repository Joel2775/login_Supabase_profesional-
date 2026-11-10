export function assertNonBlank(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
}

export function normalizeOptionalText(
  value: string | null | undefined,
): string | null | undefined {
  if (value === undefined || value === null) return value;
  return value.trim() || null;
}

export function assertValidEmail(value: string | null | undefined): void {
  if (value == null || value === "") return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("El correo electrónico no tiene un formato válido.");
  }
}

export function assertHasChanges<T extends object>(
  input: T,
  entityName: string,
): void {
  if (!Object.values(input).some((value) => value !== undefined)) {
    throw new Error(`Debes indicar al menos un campo para actualizar ${entityName}.`);
  }
}
