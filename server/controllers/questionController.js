import Question from "../models/Question.js";

// ✅ CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      slug,
      testCases,
    } = req.body;

    // 🔒 Basic validation
    if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 🔒 Check slug uniqueness (important)
    if (slug) {
      const existing = await Question.findOne({ slug });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    // 🚀 Create question
    const question = await Question.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });

  } catch (error) {
    console.error("Create Question Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ✅ GET ALL QUESTIONS
export const getAllQuestions = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;

    // 🔍 Filtering (basic)
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;

    const questions = await Question.find(filter)
      .select("title slug difficulty tags") // optimize response
      .lean();

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });

  } catch (error) {
    console.error("Get Questions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ✅ GET SINGLE QUESTION
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });

  } catch (error) {
    console.error("Get Question Error:", error);

    return res.status(500).json({
      success: false,
      message: "Invalid ID or server error",
    });
  }
};



// ✅ UPDATE QUESTION
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Question.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated",
      data: updated,
    });

  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};



// ✅ DELETE QUESTION
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};