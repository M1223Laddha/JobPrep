const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report on the basis of resume,selfDescription,jobDescription
 */

async function generateInterviewReportCOntroller(req, res) {
  // const resumeFile = req.file; // this will give us the pdf

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();

  const { selfDescription, jobDescription } = req.body; // this will be provided by the user from the frontend

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  console.log(interviewReportByAi);

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

/**
 * @description Controller to get interview report by interviewId
 */

async function getInterviewReportByIdController(req, res) {
  // get the id from the params

  const interviewId = req.params.interviewId;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

/**
 * @description Controller to get/fetch all the reports of the logged in user
 */

async function getAllInterviewReportController(req, res) {
  try {
    const userId = req.user.id;

    const AllinterviewReports = await interviewReportModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    res.status(200).json({
      message: "Interview reports fetched successfully",
      allInterviewReports: AllinterviewReports, // Keep names consistent
    });
  } catch (error) {
    console.error("Error in getAllInterviewReportController:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * @description Controller to generate resume PDF based on user self description,resume ad job description
 */

async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterviewReportCOntroller,
  getInterviewReportByIdController,
  getAllInterviewReportController,
  generateResumePdfController,
};
