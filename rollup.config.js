import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dev from "rollup-plugin-dev";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/scripts/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    replace({
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
      "process.env.FORM_ID": JSON.stringify(process.env.FORM_ID),
      "process.env.FB_APP": JSON.stringify(process.env.FB_APP),
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    !production &&
      dev({
        dirs: ["public"],
        host: "localhost",
        port: 9000,
        spa: true,
      }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
