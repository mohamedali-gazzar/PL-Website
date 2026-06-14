// Starts the Next dev server in an ISOLATED build dir (.next-preview) so the
// preview/verification server never shares `.next` with the user's `npm run dev`.
import { spawn } from "node:child_process";

process.env.NEXT_DIST_DIR = ".next-preview";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npx, ["next", "dev", "-p", "3030"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
