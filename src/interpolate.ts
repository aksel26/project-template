export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    if (!(key in vars)) {
      throw new Error(`Unknown variable in template: {${key}}`);
    }
    return vars[key];
  });
}
