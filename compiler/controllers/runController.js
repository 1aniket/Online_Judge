import { executeCpp } from "../executor/cppExecutor.js";

export const runCode = async (req, res) => {
  try {
    const { code, testCases } = req.body;

    if (!code || !testCases) {
      return res.status(400).json({ success: false });
    }

    const result = await executeCpp(code, testCases);

    return res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};