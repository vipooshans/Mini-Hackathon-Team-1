import { Schema, model } from "mongoose";

const exampleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Example", exampleSchema);
