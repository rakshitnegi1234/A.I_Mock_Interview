import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./ToolTipButton";
import { VolumeX, Volume2 } from "lucide-react"; 
import {RecordAnswer} from "./RecordAnswer";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}


export const QuestionForm = ({ questions }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSpeech, setCurrentSpeech] =

    useState<SpeechSynthesisUtterance | null>(null);

    const [isWebCam,setIsWebCam] = useState<boolean>(false);

    const handlePlayQuestion = (qst: string) => {
      if (!("speechSynthesis" in window)) return;
    
      const speakNow = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          alert("No voices available. Try using Firefox or install speech engine on Linux.");
          return;
        }
    
        const utterance = new SpeechSynthesisUtterance(qst);
        utterance.voice = voices[0]; // Choose the first available voice
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        window.speechSynthesis.speak(utterance);
    
        setIsPlaying(true);
        setCurrentSpeech(utterance);
    
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      };
    
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
          speakNow();
        };
      } else {
        speakNow();
      }
    };
    
    

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      <Tabs
        defaultValue={questions?.[0]?.question}
        className="w-full space-y-12"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
          {questions?.map((tab, i) => (
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2"
              )}
              key={tab.question}
              value={tab.question}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {questions?.map((tab, i) => (
          <TabsContent key={tab.question} value={tab.question}>
            <p className="text-base text-left tracking-wide text-neutral-500">
              {tab.question}
            </p>

            <div className="w-full flex items-center justify-end mt-2">
              <TooltipButton
                content={isPlaying ? "Stop" : "Play"}
                icon={
                  isPlaying ? (
                    <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                  )
                }
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer question = {tab} isWebCam = {isWebCam} setIsWebCam = {setIsWebCam} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
