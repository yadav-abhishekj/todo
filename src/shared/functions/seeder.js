import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("../static/countries+cities.json");

export async function seederData(insertTotal, modelName) {
  const Model = mongoose.models && mongoose.models[modelName];
  if (!Model) {
    throw new Error(
      `Mongoose model "${modelName}" is not registered. Register the model before calling seederData.`
    );
  }

  for (let i = 0; i < insertTotal; i++) {
    const entry = {
      title: `${data[i]?.cities.splice(0, 10) || "Unknown City"} ${modelName} ${
        i + 1
      }`,
      description: `${
        data[i]?.cities.splice(0, 20) || "Unknown City"
      } for Sample ${modelName} ${i + 1}`,
      completed: false,
    };
    await Model.create(entry);
  }
}
