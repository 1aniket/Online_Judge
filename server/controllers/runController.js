import axios from "axios";

export const runCode = async (req, res) => {
  try {
    const { code, testCases } = req.body;

    if (!code || !testCases) {
      return res.status(400).json({
        success: false,
        message: "Code and testCases required",
      });
    }

    // 🔥 Forward request to compiler service
    const response = await axios.post(
      process.env.COMPILER_URL,
      {
        code,
        testCases,
      },
      {
        headers: {
          "x-api-key": process.env.COMPILER_SECRET, // 🔒 security
        },
        timeout: 10000, // prevent hanging
      }
    );

    // ✅ Send back compiler response to client
    return res.json(response.data);

  } catch (error) {
    console.error("Compiler Service Error:", error.message);

    // Handle compiler errors properly
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to execute code",
    });
  }
};