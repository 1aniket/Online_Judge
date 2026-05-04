import fs from "fs";
import path from "path";
import crypto from "crypto"; // ✅ replace uuid
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

export const runJava = async (code, testCases) => {
  // ✅ Docker-safe UUID
  const jobId = crypto.randomUUID().replace(/-/g, "_");

  const className = `Main_${jobId}`;
  const filePath = path.join(tempDir, `${className}.java`);

  // 🔥 Ensure correct class name
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

    // 🔥 cleanup input safely
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch {}
  }

  // ---------------- CLEANUP ----------------
  const classFile = path.join(tempDir, `${className}.class`);

  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
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