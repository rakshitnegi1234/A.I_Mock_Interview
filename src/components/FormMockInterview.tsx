import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CustomBreadCrumb } from "./CustomBreadCrumb";
import { Headings } from "./Heading";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/Config/firebase.config";
import { chatSession } from "@/scripts";
import type { Interview } from "@/Types/index";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  techStack: z.string().min(1, "Tech stack is required"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          position: initialData.position,
          description: initialData.description,
          experience: initialData.experience,
          techStack: initialData.techStack,
        }
      : {
          position: "",
          description: "",
          experience: 0,
          techStack: "",
        },
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData ? "Edit Interview" : "Create New Mock Interview";
  const breadCrumb = initialData ? initialData.position : "Create";
  const actionText = initialData ? "Save Changes" : "Create";

  const cleanAiResponse = (responseText: string) => {
    try {
      const raw = responseText.trim().replace(/```(json)?|```|`/g, "").trim();
      const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("No valid JSON array found");
      return JSON.parse(match[0]);
    } catch (err) {
      console.error("AI JSON Parse Error:", err);
      throw new Error("Failed to parse AI response");
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `
Generate a JSON array of 5 technical interview questions with answers for:
- Position: ${data.position}
- Description: ${data.description}
- Experience: ${data.experience} years
- Tech Stack: ${data.techStack}
Respond strictly with JSON like:
[
  {"question": "...", "answer": "..."},
  ...
]
    `;
    const result = await chatSession.sendMessage(prompt);
    return cleanAiResponse(result.response.text());
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const questions = await generateAiResponse(data);

      if (initialData?.id) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          ...data,
          questions,
          updatedAt: serverTimestamp(),
        });
        toast.success("Interview updated!");
      } else {
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions,
          createdAt: serverTimestamp(),
        });
        toast.success("Interview created!");
      }

      navigate("/generate");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "interviews", initialData.id));
      toast("Deleted!", { description: "Interview deleted successfully." });
      navigate("/generate");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl transition-all duration-300">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumb}
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="flex justify-between items-center mt-4">
        <Headings title={title} isSubHeading />
        {initialData && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={loading}
            className="hover:bg-red-100 dark:hover:bg-zinc-800"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {[
            {
              name: "position",
              label: "Job Position",
              type: "text",
              placeholder: "e.g. Frontend Developer",
            },
            {
              name: "description",
              label: "Job Description",
              type: "textarea",
              placeholder: "Describe the job responsibilities...",
            },
            {
              name: "experience",
              label: "Years of Experience",
              type: "number",
              placeholder: "e.g. 3",
            },
            {
              name: "techStack",
              label: "Tech Stack",
              type: "textarea",
              placeholder: "e.g. React, TypeScript, Firebase",
            },
          ].map(({ name, label, type, placeholder }) => (
            <FormField
              key={name}
              name={name as keyof FormData}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">
                    {label}
                  </FormLabel>
                  <FormControl>
                    {type === "textarea" ? (
                      <Textarea
                        {...field}
                        disabled={loading}
                        placeholder={placeholder}
                        className="resize-none rounded-xl border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <Input
                        {...field}
                        type={type}
                        disabled={loading}
                        placeholder={placeholder}
                        className="rounded-xl border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => form.reset()}
              className="rounded-xl border-zinc-300 dark:border-zinc-700"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || loading}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : actionText}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
