const mongoose = require("mongoose");

/**
 * This will be given by the user
 * - job description schema  -> String
 * - resume text -> String
 * - self description  > String
 *
 * - OverAll score / match score : -> number
 *
 * This will be provided by the ai
 * - Technical Questions ->
 *          [{
 *      question : "",
 *      intention : "",
 *      answer : ""
 * }]
 * - Behavioral questions ->
 *          [{
 *      question : "",
 *      intention : "",
 *      answer : ""
 * }]
 * - Skills Gaps -> [{
 *      skill : "",
 *      severity : {
 *       type : String,
 *       enum : ["low","medium","high"]
 *      }
 * }]
 * - Preparation Plan -> [{Day 1} , {Day 2} ]
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },

    intention: {
      type: String,
      required: [true, "Intention is required"],
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },

    intention: {
      type: String,
      required: [true, "Intention is required"],
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },

  focus: {
    type: String,
    required: [true, "Focus is required"],
  },

  tasks: [
    {
      type: String,
      required: [true, "Task is required"],
    },
  ],
});

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
    },

    selfDescription: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    // title: {
    //   type: String,
    //   required: [true, "Job title is required"],
    // },
  },
  {
    timestamps: true,
  },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
