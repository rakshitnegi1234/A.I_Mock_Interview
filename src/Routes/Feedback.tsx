import type { Interview, UserAnswer } from "@/Types/index";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CustomBreadCrumb } from "@/components/CustomBreadCrumb";
import { LoaderPage } from "./LoaderPage";
import { db } from "@/Config/firebase.config";
import { Headings } from "@/components/Heading";
import { InterviewPin } from "@/components/Pin";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
          const querySnap = await getDocs(
            query(
              collection(db, "userAnswers"),
              where("userId", "==", userId),
              where("mockIdRef", "==", interviewId)
            )
          );

          const feedbackData = querySnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserAnswer[];

          setFeedbacks(feedbackData);
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterview();
      fetchFeedbacks();
    }
  }, [interviewId, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";
    const total = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-8 px-4 md:px-8">
      <div className="flex items-center justify-between w-full">
        <CustomBreadCrumb
          breadCrumbPage="Feedback"
          breadCrumbItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />
      </div>

      <Headings
        title="🎉 Congratulations!"
        description="Your personalized feedback is here. Review your strengths, areas for improvement, and expert suggestions to prepare better."
      />

      <p className="text-lg text-muted-foreground">
        Overall Interview Rating:
        <span className="text-emerald-600 font-bold text-2xl ml-2">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Detailed Interview Feedback" isSubHeading />

      <Accordion type="single" collapsible className="space-y-6">
        {feedbacks.map((feed) => (
          <AccordionItem
            key={feed.id}
            value={feed.id}
            className="border rounded-xl shadow-sm bg-white"
          >
            <AccordionTrigger
              onClick={() => setActiveFeed(feed.id)}
              className={cn(
                "px-5 py-4 font-medium text-base transition-colors duration-200 ease-in-out",
                activeFeed === feed.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-muted"
              )}
            >
              {feed.question}
            </AccordionTrigger>

            <AccordionContent className="px-6 py-5 bg-gray-50 rounded-b-xl space-y-6">
              <div className="text-lg font-semibold text-gray-800">
                <Star className="inline mr-2 text-yellow-500" />
                Rating: {feed.rating}
              </div>

              <Card className="bg-green-100 border-none p-4 rounded-md">
                <CardTitle className="text-green-700 flex items-center">
                  <CircleCheck className="mr-2" /> Expected Answer
                </CardTitle>
                <CardDescription className="text-gray-800 mt-1">
                  {feed.correct_ans}
                </CardDescription>
              </Card>

              <Card className="bg-yellow-100 border-none p-4 rounded-md">
                <CardTitle className="text-yellow-700 flex items-center">
                  <CircleCheck className="mr-2" /> Your Answer
                </CardTitle>
                <CardDescription className="text-gray-800 mt-1">
                  {feed.user_ans}
                </CardDescription>
              </Card>

              <Card className="bg-red-100 border-none p-4 rounded-md">
                <CardTitle className="text-red-700 flex items-center">
                  <CircleCheck className="mr-2" /> Feedback
                </CardTitle>
                <CardDescription className="text-gray-800 mt-1">
                  {feed.feedback}
                </CardDescription>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
