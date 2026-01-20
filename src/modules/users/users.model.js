import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userLast: { type: String, required: true, trim: true },
    img:{type: String},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phoneNumber: { type: String, minlength: 10, maxlength: 10 },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const TeaUser = mongoose.model("User", userSchema);
