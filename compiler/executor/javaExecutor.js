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

export const runJava = async (code, testCases) => {
  const jobId = uuidv4().replace(/-/g, "_"); // 🔥 FIX
  const filePath = path.join(tempDir, `Main_${jobId}.java`);
  const className = `Main_${jobId}`;

  // 🔥 Replace class name dynamically
  const updatedCode = code.replace(
    /public\s+class\s+Main/,
    `public class ${className}`
  );

  fs.writeFileSync(filePath, updatedCode);

  // ---------------- COMPILE ----------------
  const compileCmd = `javac "${filePath}"`;
  const compileResult = await runExec(compileCmd);

  if (compileResult.error) {
    return {
      success: false,
      error: compileResult.error,
    };
  }

  let passed = 0;
  const results = [];

  // ---------------- RUN TEST CASES ----------------
  for (let tc of testCases) {
    const inputPath = path.join(tempDir, `${jobId}.txt`);

    const fixedInput = tc.input.replace(/\\n/g, "\n");
    fs.writeFileSync(inputPath, fixedInput);

    const runCmd = `java -cp "${tempDir}" ${className} < "${inputPath}"`;

    const result = await runExec(runCmd);

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

    if (fs.existsSync(inputPath)) await fs.unlinkSync(inputPath);
  }

  // ---------------- CLEANUP ----------------
  const classFile = path.join(tempDir, `${className}.class`);

  [filePath, classFile].forEach(async (file) => {
    if (fs.existsSync(file)) await fs.unlinkSync(file);
  });

  return {
    success: true,
    passed,
    total: testCases.length,
    status: passed === testCases.length ? "Accepted" : "Wrong Answer",
    results,
  };
};