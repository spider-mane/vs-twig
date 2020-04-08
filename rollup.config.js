import json from "@rollup/plugin-json";

export default {
  input: "src/extension.js",
  output: {
    file: "extension/index.js",
    format: "cjs",
  },
  plugins: [
    json({
      exclude: ["node_modules/**"],
      preferConst: false,
      indent: "  ",
      compact: true,
      namedExports: false,
    }),
  ],
};
