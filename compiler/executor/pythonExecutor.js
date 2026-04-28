import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";

const tempDir = path.join(process.cwd(), "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const runExec = (cmd) => {
  return new Promise((resolve) => {
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          error: stderr || error.message,
        });
      }
      resolve({
        output: stdout,
      });
    });
  });
};

export const executePython = async (code, testCases) => {
  const jobId = uuidv4();

  const filePath = path.join(tempDir, `${jobId}.py`);

  // 🔥 Write code
  fs.writeFileSync(filePath, code);

  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    const inputPath = path.join(tempDir, `${jobId}.txt`);

    // 🔥 Fix escaped newline
    const fixedInput = tc.input.replace(/\\n/g, "\n");
    fs.writeFileSync(inputPath, fixedInput);

    // ⚠️ Change python → python3 if needed
    const cmd = `python "${filePath}" < "${inputPath}"`;

    const result = await runExec(cmd);

    const actual = result.output?.trim() || "";
    const expected = tc.output.trim();

    const isPassed = actual === expected;

    if (isPassed) passed++;

    results.push({
      input: tc.input,
      expected,
      actual,
      passed: isPassed,
    });

    // cleanup input file
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
  }

  // cleanup code file
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return {
    success: true,
    passed,
    total: testCases.length,
    status: passed === testCases.length ? "Accepted" : "Wrong Answer",
    results,
  };
};