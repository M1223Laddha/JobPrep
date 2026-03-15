const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../contollers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description,resume pdf and job description
 * @access private
 */
// first authenticate the user by authMiddleware if ok then parse the file
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportCOntroller,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportController,
);

/**
 * @route  GET/api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description,resume content and job description
 * @access private
 */

interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
