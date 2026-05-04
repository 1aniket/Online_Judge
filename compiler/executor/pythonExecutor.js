import fs from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";

const tempDir = path.join(process.cwd(), "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const runExec = (cmd) => {
  return new Promise((resolve) => {
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log("CMD:", cmd);
        console.log("ERROR:", error ? error.message : "");
        console.log("STDERR:", stderr);
        return resolve({
          error: stderr || (error ? error.message : ""),
        });
      }
      resolve({
        output: stdout,
      });
    });
  });
};

export const executePython = async (code, testCases) => {
  const jobId = crypto.randomUUID();

  const filePath = path.join(tempDir, `${jobId}.py`);
  const inputPath = path.join(tempDir, `${jobId}.txt`);

  // 🔥 Write code
  fs.writeFileSync(filePath, code);

  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    const fixedInput = tc.input.replace(/\\n/g, "\n");
    fs.writeFileSync(inputPath, fixedInput);

    // 🔥 Use python3 (Docker safe)
    const cmd = `python3 "${filePath}" < "${inputPath}"`;

    const result = await runExec(cmd);

    if (result.error) {
      return { success: false, error: result.error };
    }

    const actual = result.output ? result.output.trim() : "";
    const expected = tc.output.trim();

    const isPassed = actual === expected;

    if (isPassed) passed++;

    results.push({
      input: tc.input,
      expected,
      actual,
      passed: isPassed,
    });
  }

  // 🔥 Cleanup
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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