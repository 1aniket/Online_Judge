import fs from "fs";
import path from "path";
import { exec } from "child_process";
import crypto from "crypto";
import { normalize } from "../lib/Normalize.js";

const tempDir = path.join(process.cwd(), "temp");

// Ensure temp dir exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const runExec = (command) => {
  return new Promise((resolve) => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log("CMD:", command);
        console.log("ERROR:", error ? error.message : "");
        console.log("STDERR:", stderr);
        return resolve({ error: stderr || (error ? error.message : "") });
      }
      resolve({ output: stdout });
    });
  });
};

export const executeCpp = async (code, testCases) => {
  // ✅ Use native Node UUID
  const jobId = crypto.randomUUID();

  const filePath = path.join(tempDir, `${jobId}.cpp`);
  const outputPath = path.join(tempDir, `${jobId}`); // 🔥 better than .out
  const inputPath = path.join(tempDir, `${jobId}.txt`);

  fs.writeFileSync(filePath, code);

  // 🔥 Compile
  const compileCmd = `g++ "${filePath}" -o "${outputPath}"`;
  const compileResult = await runExec(compileCmd);

  if (compileResult.error) {
    return { success: false, error: compileResult.error };
  }

  // 🔥 Ensure executable permission
  await runExec(`chmod +x "${outputPath}"`);

  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    const fixedInput = tc.input.replace(/\\n/g, "\n");
    fs.writeFileSync(inputPath, fixedInput);

    const runCmd = `"${outputPath}" < "${inputPath}"`;
    const result = await runExec(runCmd);

    if (result.error) {
      return { success: false, error: result.error };
    }

    const actual = result.output ? result.output.trim() : "";
    const expected = tc.output.trim();


    const isPassed = normalize(actual) === normalize(expected);

    if (isPassed) passed++;

    results.push({
      input: tc.input,
      expected,
      actual,
      passed: isPassed,
    });
  }

  // 🔥 Cleanup (safe + sync)
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
  } catch (err) {
    console.log("Cleanup error:", err.message);
  }

  return {
    success: true,
    passed,
    total: testCases.length,
    status: passed === testCases.length ? "Accepted" : "Wrong Answer",
    results,
  };
};