import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

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

export const runCode = async (req, res) => {
  try {
    const { code, testCases } = req.body;

    if (!code || !testCases || testCases.length === 0) {
      return res.status(400).json({ success: false });
    }

    const jobId = uuidv4();

    const filePath = path.join(tempDir, `${jobId}.cpp`);
    const outputPath = path.join(tempDir, `${jobId}.exe`);
    const inputPath = path.join(tempDir, `${jobId}.txt`);

    fs.writeFileSync(filePath, code);

    // Compile
    const compileCmd = `g++ "${filePath}" -o "${outputPath}"`;
    const compileResult = await runExec(compileCmd);

    if (compileResult.error) {
      return res.json({
        success: false,
        error: compileResult.error,
      });
    }

    let passed = 0;
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      fs.writeFileSync(inputPath, tc.input);

      const runCmd = `"${outputPath}" < "${inputPath}"`;
      const result = await runExec(runCmd);

      if (result.error) {
        return res.json({
          success: false,
          error: result.error,
        });
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
      } catch (e) {
        console.error("Cleanup error:", e.message);
      }
    });

    return res.json({
      success: true,
      passed,
      total: testCases.length,
      status: passed === testCases.length ? "Accepted" : "Wrong Answer",
      results,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};