# Tyne

> _“Shape your data. Trust your types.”_

**Tyne** is a minimalist, type-safe schema system for defining data shapes, inferring TypeScript types, validating runtime data, and generating `.d.ts` files. Built for speed, clarity, and type fidelity.

## Features

- 🚀 **Runtime validation** with detailed error messages
- 🔒 **Type-safe** schemas with automatic TypeScript inference
- 🧩 **Composable** validators with chainable API
- ⚡ **Zero dependencies** and lightweight
- 📝 **Type generation** for TypeScript definitions

## Installation

```bash
npm install tyne
# or
yarn add tyne
# or
pnpm add tyne
```

## Basic Usage

```ts
import { t } from 'tyne';

// Define a schema
const userSchema = t.object({
  id: t.number(),
  name: t.string(),
  email: t.email().optional(),
  createdAt: t.instanceof(Date),
  tags: t.array(t.union([t.literal('admin'), t.literal('user')])),
});

// Infer TypeScript type
type User = t.infer<typeof userSchema>;
/*
{
  id: number;
  name: string;
  email?: string | undefined;
  createdAt: Date;
  tags: ('admin' | 'user')[];
}
*/

// Validate data
const validUser = {
  id: 1,
  name: 'John Doe',
  createdAt: new Date(),
  tags: ['admin', 'user'],
};

const result = userSchema.validate(validUser); // Returns validated data

// Handle invalid data
try {
  userSchema.validate({ id: '1', name: 123 });
} catch (error) {
  console.error(error.message);
  // "Object validation failed:
  //   - "id": Expected number, got string
  //   - "name": Expected string, got number
  //   - "createdAt": Expected instance of Date, got undefined"
}
```

## Core Validators

### Primitive Types

| Validator       | Description           | TypeScript Equivalent |
| --------------- | --------------------- | --------------------- |
| `t.string()`    | Validates strings     | `string`              |
| `t.number()`    | Validates numbers     | `number`              |
| `t.boolean()`   | Validates booleans    | `boolean`             |
| `t.null()`      | Validates `null`      | `null`                |
| `t.undefined()` | Validates `undefined` | `undefined`           |
| `t.any()`       | Accepts any value     | `any`                 |

### Complex Types

| Validator                         | Description                           |
| --------------------------------- | ------------------------------------- |
| `t.array(type)`                   | Validates arrays of specified type    |
| `t.object(shape)`                 | Validates objects with specific shape |
| `t.tuple(type1, type2).res(type)` | Validates fixed-length arrays         |
| `t.union(type1, type2)`           | Validates one of several types        |
| `t.literal(value)`                | Validates specific literal values     |
| `t.instanceof(Class)`             | Validates class instances             |

### Specialized Validators

| Validator   | Description                        |
| ----------- | ---------------------------------- |
| `t.email()` | Validates email format strings     |
| `t.url()`   | Validates URL format strings       |
| `t.tel()`   | Validates telephone number strings |

## Type Modifiers

### Optional Fields

```ts
t.string().optional();
// string | undefined
```

### Default Values

```ts
t.number().default(0);
// Returns 0 if undefined
```

## Advanced Features

### Custom Validation with `.refine()`

```ts
const positiveNumber = t
  .number()
  .refine((val) => val > 0 || 'Must be positive');
positiveNumber.validate(5); // OK
positiveNumber.validate(-1); // Throws "Must be positive"
```

### Value Transformation with `.transform()`

```ts
const toUpperCase = t.string().transform((str) => str.toUpperCase());
toUpperCase.validate('hello'); // "HELLO"

const toDate = t.string().transform((val) => new Date(val));
toDate.validate('2023-01-01'); // Date object
```

### Complex Object Validation

```ts
const passwordSchema = t
  .object({
    password: t.string(),
    confirmPassword: t.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword || 'Passwords must match',
  );

passwordSchema.validate({
  password: 'secret',
  confirmPassword: 'different',
});
// Throws "Passwords must match"
```

### Extract TypeScript Type

```ts
const schema = t.object({
  name: t.string(),
  age: t.number(),
});

type SchemaType = t.infer<typeof schema>;
/*
{
  name: string;
  age: number;
}
*/
```

### Generate TypeScript Definitions

```ts
console.log(schema.toDts('UserType'));
/*
export type UserType = {
  name: string;
  age: number;
};
*/
```

## API Reference

### Core Methods

| Method                | Description                               |
| --------------------- | ----------------------------------------- |
| `validate(value)`     | Validate and return value or throw error  |
| `safeValidate(value)` | Return validation result without throwing |
| `toDts(name?)`        | Generate TypeScript type definition       |
| `optional()`          | Mark field as optional                    |
| `default(value)`      | Provide default value for optional fields |
| `refine(validator)`   | Add custom validation logic               |
| `transform(fn)`       | Transform value after validation          |

## Error Handling

Tyne provides detailed error messages:

```ts
try {
  userSchema.validate(invalidData);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    /*
    Object validation failed:
      - "id": Expected number, got string
      - "name": Expected string, got number
      - "createdAt": Expected instance of Date, got undefined
    */
  }
}
```

> _Whether you're building libraries, APIs, or tools that rely on strong typing, **Tyne** helps you keep your data consistent across dev and runtime — without unnecessary weight._

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
