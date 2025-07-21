import { db } from "@/Config/firebase.config";
import type { Interview } from "@/Types/index";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./LoaderPage";
import { InterviewPin } from "@/components/Pin";
import { Button } from "@/components/ui/button";
import { CustomBreadCrumb } from "@/components/CustomBreadCrumb";
import { Lightbulb, Sparkles, WebcamIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Webcam from "react-webcam";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading] = useState<boolean>(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState<boolean>(false);

  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
        }
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      {/* Top bar with breadcrumbs and start button */}
      <div className="flex items-center justify-between w-full gap-2">
        <CustomBreadCrumb
          breadCrumbPage={interview?.position || ""}
          breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
        />

        <Link to={`/generate/interview/${interviewId}/start`}>
          <Button size={"sm"} className="gap-2">
            Start <Sparkles size={18} />
          </Button>
        </Link>
      </div>

      {/* Interview details */}
      {interview && <InterviewPin interview={interview} onMockPage />}

      {/* Alert about webcam usage */}
      <Alert className="bg-yellow-100/50 border-yellow-200 p-4 rounded-lg">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <div>
          <AlertTitle className="text-yellow-800 font-semibold">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-sm text-yellow-700 mt-1">
            Please enable your webcam and microphone to start the AI-generated
            mock interview. The interview consists of five questions. You'll
            receive a personalized report based on your responses at the end.
            <br />
            <br />
            <span className="font-medium">Note:</span> Your video is{" "}
            <strong>never recorded</strong>. You can disable your webcam at any
            time.
          </AlertDescription>
        </div>
      </Alert>

      {/* Webcam preview box */}
      <div className="flex items-center justify-center w-full h-full">
        <div
          className={`w-full h-[400px] md:w-96 flex flex-col items-center justify-center 
          border-2 transition-all duration-300 ease-in-out 
          ${isWebcamEnabled ? "border-green-500 shadow-lg" : "border-dashed border-gray-400"} 
          p-4 bg-white rounded-2xl`}
        >
          {isWebcamEnabled ? (
            <Webcam
              audio={true}
              mirrored
              onUserMedia={() => setIsWebcamEnabled(true)}
              onUserMediaError={() => setIsWebcamEnabled(false)}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <WebcamIcon className="w-20 h-20 text-gray-400" />
              <p className="text-sm text-gray-500 text-center">
                Webcam is off. Enable it to preview your camera before interview.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Webcam toggle button */}
      <div className="flex items-center justify-center mt-4">
        <Button
          variant={isWebcamEnabled ? "destructive" : "default"}
          onClick={() => setIsWebcamEnabled(!isWebcamEnabled)}
          className="transition-all duration-300 ease-in-out"
        >
          {isWebcamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </Button>
      </div>
    </div>
  );
};
