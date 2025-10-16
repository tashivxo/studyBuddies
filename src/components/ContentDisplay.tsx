import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface ContentDisplayProps {
  content: string;
  templateType: string;
}

export const ContentDisplay = ({ content, templateType }: ContentDisplayProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const handleDownload = () => {
    const templateNames: Record<string, string> = {
      "lesson-plan": "Lesson Plan",
      "study-guide": "Study Guide",
      "quiz": "Quiz",
      "learning-objectives": "Learning Objectives",
      "activity": "Activity Ideas",
    };
    
    const fileName = `${templateNames[templateType] || 'Content'}.txt`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Content downloaded!");
  };

  return (
    <Card className="shadow-[var(--shadow-medium)]">
      <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Generated Content</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="hover:bg-primary/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
            {content}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
