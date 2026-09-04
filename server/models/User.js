import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User schema — authentication for CleanLanka.
 *
 * Roles: citizen (default), municipality, recycler
 */
export const ROLES = ["citizen", "municipality", "recycler"];

const userSchema = new Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Never return password by default
  },
  role: {
    type: String,
    enum: ROLES,
    default: "citizen",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  district: {
    type: String,
    trim: true,
    default: "",
  },
  /** Collection reminder preferences (citizen) */
  reminderEnabled: {
    type: Boolean,
    default: false,
  },
  reminderDay: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save hook — hash password before storing.
 * Only runs if password field is modified (not on every save).
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method — compare a plain-text password with the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);
