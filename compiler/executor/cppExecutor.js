import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

const tempDir = path.join(process.cwd(), "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const runExec = (command) => {
  return new Promise((resolve) => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        return resolve({ error: stderr || error.message });
      }
      resolve({ output: stdout });
    });
  });
};

export const executeCpp = async (code, testCases) => {
  const jobId = uuidv4();

  const filePath = path.join(tempDir, `${jobId}.cpp`);
  const outputPath = path.join(tempDir, `${jobId}.exe`);
  const inputPath = path.join(tempDir, `${jobId}.txt`);

  fs.writeFileSync(filePath, code);

  // 🔥 Compile
  const compileCmd = `g++ "${filePath}" -o "${outputPath}"`;
  const compileResult = await runExec(compileCmd);

  if (compileResult.error) {
    return { success: false, error: compileResult.error };
  }

  let passed = 0;
  const results = [];

  for (let tc of testCases) {
    fs.writeFileSync(inputPath, tc.input);

    const runCmd = `"${outputPath}" < "${inputPath}"`;
    const result = await runExec(runCmd);

    if (result.error) {
      return { success: false, error: result.error };
    }

    const actual = result.output?.trim();
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

  // Cleanup
  [filePath, outputPath, inputPath].forEach((file) => {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch {}
  });

  return {
    success: true,
    passed,
    total: testCases.length,
    status: passed === testCases.length ? "Accepted" : "Wrong Answer",
    results,
  };
};