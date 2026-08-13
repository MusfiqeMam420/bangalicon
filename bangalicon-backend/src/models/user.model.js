const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },
    password: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
    },
    signupCodeHash: {
      type: String,
      default: null,
    },
    signupCodeExpiresAt: {
      type: Date,
      default: null,
    },
    signupCodeVerifiedAt: {
      type: Date,
      default: null,
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },
    premiumSince: {
      type: Date,
      default: null,
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    lastDemoPayment: {
      amount: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "USD",
      },
      paidAt: {
        type: Date,
        default: null,
      },
      reference: {
        type: String,
        default: null,
      },
    },
    avatar: {
      type: String,
      default: "/avatar/avatar-meow.jpg",
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
