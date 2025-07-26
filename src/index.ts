import { z, ZodType } from "zod";

type SchemaMap = Record<string, ZodType<any>>;

/**
 * A type-safe, schema-validated localStorage wrapper using Zod.
 *
 * @template SchemaMap - A mapping of storage keys to Zod schemas.
 */
export class LocalStorageTyped<TSchemas extends SchemaMap> {
  constructor(private schemas: TSchemas) {}

  set<K extends keyof TSchemas>(key: K, value: z.infer<TSchemas[K]>): void {
    const parsed = this.schemas[key].parse(value);
    localStorage.setItem(key as string, JSON.stringify(parsed));
  }

  get<K extends keyof TSchemas>(key: K): z.infer<TSchemas[K]> | null {
    const raw = localStorage.getItem(key as string);
    if (raw === null) return null;

    try {
      const parsed = JSON.parse(raw);
      return this.schemas[key].parse(parsed);
    } catch (e) {
      console.error(`Validation failed for key "${String(key)}":`, e);
      return null;
    }
  }

  remove<K extends keyof TSchemas>(key: K): void {
    localStorage.removeItem(key as string);
  }

  clear(): void {
    Object.keys(this.schemas).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
