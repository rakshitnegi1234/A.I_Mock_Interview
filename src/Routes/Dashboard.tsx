import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Headings } from "@/components/Heading";
import { db } from "@/Config/firebase.config";
import { useAuth } from "@clerk/clerk-react";
import type { Interview } from "@/Types/index";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewPin } from "@/components/Pin";
export const Dashboard = () => {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Interview),
        }));
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching interviews:", error);
        toast.error("Something went wrong while loading your interviews.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="w-full px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mt-6">
        <Headings
          title="Dashboard"
          description="Create and start your AI mock interview"
        />
        <Link to="/generate/create">
          <Button
            size="sm"
            className="gap-1 hover:scale-105 transition-transform duration-200"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      {/* Interview Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border p-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse shadow-sm h-28"
            />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewPin key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16">
            <img
              src="/assets/svg/not-found.svg"
              className="w-36 h-36 object-contain opacity-70"
              alt="No interviews found"
            />
            <h2 className="text-xl font-semibold text-muted-foreground mt-4">
              No Interviews Found
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              You haven't created any mock interviews yet. Start your first AI-powered session now!
            </p>
            <Link to="/generate/create">
              <Button
                size="sm"
                className="mt-5 gap-1 hover:scale-105 transition-transform duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Interview
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
