import type { Interview } from "@/Types/index";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/Config/firebase.config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomBreadCrumb } from "@/components/CustomBreadCrumb";
import { Lightbulb } from "lucide-react";
import { QuestionForm } from "@/components/QuestionForm";
import { LoaderPage } from "./LoaderPage";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        navigate("/generate", { replace: true });
        return;
      }

      try {
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          setInterview({
            id: interviewDoc.id,
            ...interviewDoc.data(),
          } as Interview);
        }
      } catch (error) {
        console.error("Failed to fetch interview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-6 px-4 sm:px-6 md:px-10">
      {/* Breadcrumb */}
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      {/* Instructions Alert */}
      <Alert className="bg-sky-100 border border-sky-200 p-5 rounded-xl shadow-sm animate-in fade-in zoom-in-75">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-sky-600 mt-1" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold text-lg mb-1">
              Interview Instructions
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 leading-relaxed">
              Click <strong>“Record Answer”</strong> to begin your response for each question. 
              After the final question, you’ll get a personalized report comparing your answers 
              with model solutions and key concepts.
              <br /><br />
              <span className="font-medium">Note:</span> <strong>Your video is never recorded.</strong> 
              You can disable your webcam anytime.
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Questions Section */}
      {interview?.questions?.length ? (
  <div className="mt-6 w-full flex flex-col items-start gap-6 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-900">
      {interview.questions?.length} Question{interview.questions?.length > 1 ? "s" : ""} for:{" "}
      <span className="text-sky-600">{interview.position}</span>
    </h2>

    <p className="text-gray-600 text-sm">
      Try to answer each question clearly and confidently. You can record your answers and receive smart feedback.
    </p>

    <QuestionForm questions={interview.questions} />
  </div>
) : (
  <div className="text-center text-gray-500 text-base mt-16 animate-fade-in">
    <p className="text-lg font-medium">No questions found</p>
    <p className="text-sm text-gray-400 mt-2">
      Please check back later or regenerate the interview questions.
    </p>
  </div>
)}

    </div>
  );
};
