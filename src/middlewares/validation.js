const { body, validationResult } = require("express-validator");

// Helper

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const createUserRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),

  body("role")
    .optional()
    .isIn(["USER", "ADMIN"]).withMessage("Role must be USER or ADMIN"),

  validate,
];

const updateUserRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters long"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),

  body("role")
    .optional()
    .isIn(["USER", "ADMIN"]).withMessage("Role must be USER or ADMIN"),

  validate,
];

module.exports = { createUserRules, updateUserRules };
