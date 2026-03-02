import { ST } from "next/dist/shared/lib/utils";
import z from "zod";

export const ContainsUppercase = (str: string) => /[A-B]/.test(str);

export const ContainsNumber = (str: string) => /\d/.test(str);

export const ContainsSpecialChar = (str: string) => {
  const specialChars = /[`!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;

  return specialChars.test(str);
};

export const PasswordSchema = z.string().superRefine((value, ctx) => {
  if (value.length < 5) {
    ctx.addIssue({
      code: "custom",
      message: "Must be 5 or more characters long",
      fatal: true,
    });

    return z.NEVER;
  }

  if (value.length > 15) {
    ctx.addIssue({
      code: "custom",
      message: "Must be 10 or less characters long",
      fatal: true,
    });

    return z.NEVER;
  }
  if (!ContainsNumber(value)) {
    ctx.addIssue({
      code: "custom",
      message: "At least contain one number",
      fatal: true,
    });

    return z.NEVER;
  }

  if (!ContainsUppercase(value)) {
    ctx.addIssue({
      code: "custom",
      message: "At least contain uppercase letter",
      fatal: true,
    });

    return z.NEVER;
  }

  if (!ContainsSpecialChar(value)) {
    ctx.addIssue({
      code: "custom",
      message: "At least contain one special characters (@, #, $, etc.)",
      fatal: true,
    });

    return z.NEVER;
  }
});
