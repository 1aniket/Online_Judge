import { executeCpp } from "../executor/cppExecutor.js";
import { executePython } from "../executor/pythonExecutor.js";
import { runJava } from "../executor/javaExecutor.js";

export const runCode = async (req, res) => {

  try {
    const { language, code, testCases } = req.body;

    let result;

    if (language == "cpp") {
      result = await executeCpp(code, testCases);
    } 
    else if (language == "python") {
      result = await executePython(code, testCases);
    }else if(language == "java"){
      result = await runJava(code, testCases);
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }

    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};