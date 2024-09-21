const { z } = require("zod");


const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(255, { message: "Password must be at most 255 characters" }),
});


const registerSchema = loginSchema.extend({
    name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(255, { message: "Name must be at most 255 characters" }),
    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(10, { message: "Phone number must be at most 10 digits" }),
});

module.exports = { loginSchema, registerSchema };