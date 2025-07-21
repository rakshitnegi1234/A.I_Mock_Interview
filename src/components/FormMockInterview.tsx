import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";
import { db } from "@/Config/firebase.config";
import { chatSession } from "@/scripts";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CustomBreadCrumb } from "./CustomBreadCrumb";
import { Headings } from "./Heading";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Interview } from "@/Types/index";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1).max(100),
  description: z.string().min(10),
  experience: z.coerce.number().min(0),
  techStack: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData ? initialData.position : "Create New Mock Interview";
  const breadCrumb = initialData ? initialData.position : "Create";
  const actionText = initialData ? "Save Changes" : "Create";

  const cleanAiResponse = (responseText: string) => {
    let cleanText = responseText.trim().replace(/```(json)?|```|`/g, "").trim();
    const match = cleanText.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!match) throw new Error("No valid JSON array found");
    return JSON.parse(match[0]);
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `
      Generate a JSON array with 5 tech interview questions and answers for:
      - Position: ${data.position}
      - Description: ${data.description}
      - Experience: ${data.experience}
      - Stack: ${data.techStack}
      Strict JSON: [{"question": "...", "answer": "..."}]
    `;
    const aiResult = await chatSession.sendMessage(prompt);
    return cleanAiResponse(aiResult.response.text());
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const aiResult = await generateAiResponse(data);

      if (initialData) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          ...data,
          questions: aiResult,
          updatedAt: serverTimestamp(),
        });
        toast("Updated!", { description: "Interview updated successfully." });
      } else {
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
        });
        toast("Created!", { description: "New mock interview created." });
      }

      navigate("/generate", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
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
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete the interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

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
            className="hover:bg-red-100 dark:hover:bg-zinc-800"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {[
            { name: "position", label: "Job Position", type: "text", placeholder: "e.g. Frontend Developer" },
            { name: "description", label: "Job Description", type: "textarea", placeholder: "Describe the role..." },
            { name: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 3" },
            { name: "techStack", label: "Tech Stack", type: "textarea", placeholder: "e.g. React, TypeScript" },
          ].map(({ name, label, type, placeholder }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof FormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">{label}</FormLabel>
                  <FormControl>
                    {type === "textarea" ? (
                      <Textarea
                        disabled={loading}
                        placeholder={placeholder}
                        className="resize-none focus:ring-2 focus:ring-primary rounded-xl border-zinc-300 dark:border-zinc-700"
                        {...field}
                      />
                    ) : (
                      <Input
                        type={type}
                        disabled={loading}
                        placeholder={placeholder}
                        className="focus:ring-2 focus:ring-primary rounded-xl border-zinc-300 dark:border-zinc-700"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="reset"
              variant="outline"
              disabled={loading}
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
