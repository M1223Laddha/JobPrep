// import {
//   getAllInterviewReports,
//   generateInterviewReport,
//   getInterviewReportById,
//   generateResumePdf,
// } from "../services/interview.api";
// import { useContext, useEffect } from "react";
// import { InterviewContext } from "../interview.context";
// import { useParams } from "react-router";

// export const useInterview = () => {
//   const context = useContext(InterviewContext);
//   const { interviewId } = useParams();

//   if (!context) {
//     throw new Error("useInterview must be used within an InterviewProvider");
//   }

//   const { loading, setLoading, report, setReport, reports, setReports } =
//     context;

//   const generateReport = async ({
//     jobDescription,
//     selfDescription,
//     resumeFile,
//   }) => {
//     setLoading(true);
//     let response = null;

//     try {
//       response = await generateInterviewReport({
//         jobDescription,
//         selfDescription,
//         resumeFile,
//       });

//       setReport(response.interviewReport);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }

//     return response.interviewReport;
//   };

//   const getReportById = async (interviewId) => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await getInterviewReportById(interviewId);
//       setReport(response.interviewReport);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//     return response.interviewReport;
//   };

//   const getReports = async () => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await getAllInterviewReports();
//       setReports(response.interviewReports);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }

//     return response.interviewReports;
//   };

//   const getResumePdf = async (interviewReportId) => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await generateResumePdf({ interviewReportId });
//       const url = window.URL.createObjectURL(new Blob[response](), {
//         type: "application/pdf",
//       });
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `resume_${interviewReportId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (interviewId) {
//       getReportById(interviewId);
//     } else {
//       getReports();
//     }
//   }, [interviewId]);

//   return {
//     loading,
//     report,
//     reports,
//     generateReport,
//     getReportById,
//     getReports,
//     getResumePdf,
//   };
// };

import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  /**
   * @description Generates a new AI interview report
   */
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      // Added safety check to prevent "reading properties of null"
      const newReport = response?.interviewReport || null;
      setReport(newReport);
      return newReport;
    } catch (error) {
      console.error("Error generating report:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Fetches a single report by its ID
   */
  const getReportById = async (id) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(id);
      const data = response?.interviewReport || null;
      setReport(data);
      return data;
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Fetches all reports for the current user
   */
  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();

      // FIX: Matches the backend property 'allInterviewReports'
      // Use fallback empty array [] so .map() in UI doesn't crash
      const fetchedReports = response?.allInterviewReports || [];

      setReports(fetchedReports);
      return fetchedReports;
    } catch (error) {
      console.error("Error fetching all reports:", error);
      setReports([]); // Ensure state is an array even on failure
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Downloads the resume PDF
   */
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });

      // Fixed Blob constructor syntax
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object to save memory
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize data based on URL params
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
