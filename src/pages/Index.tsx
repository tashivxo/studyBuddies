import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ParameterInputs } from "@/components/ParameterInputs";
import { ContentDisplay } from "@/components/ContentDisplay";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-education.jpg";

interface Parameters {
  gradeLevel: string;
  subject: string;
  duration: string;
  learningStyle: string;
  topic: string;
}

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [parameters, setParameters] = useState<Parameters>({
    gradeLevel: "",
    subject: "",
    duration: "",
    learningStyle: "",
    topic: "",
  });
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleParameterChange = (key: keyof Parameters, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const validateInputs = (): boolean => {
    if (!selectedTemplate) {
      toast.error("Please select a content type");
      return false;
    }
    if (!parameters.gradeLevel) {
      toast.error("Please select a grade level");
      return false;
    }
    if (!parameters.subject.trim()) {
      toast.error("Please enter a subject area");
      return false;
    }
    if (!parameters.duration) {
      toast.error("Please select a duration");
      return false;
    }
    if (!parameters.learningStyle) {
      toast.error("Please select a learning style");
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateInputs()) return;

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          templateType: selectedTemplate,
          parameters,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.content) {
        setGeneratedContent(data.content);
        toast.success("Content generated successfully!");
      } else {
        throw new Error("No content received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate content. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Educational Content</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            EduCreate AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate high-quality educational materials in seconds. From lesson plans to quizzes,
            create engaging content tailored to your students' needs.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12 max-w-7xl">
        {/* Template Selection */}
        <section className="animate-fade-in">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        </section>

        {/* Parameter Inputs */}
        {selectedTemplate && (
          <section className="animate-fade-in">
            <ParameterInputs
              parameters={parameters}
              onParameterChange={handleParameterChange}
            />
          </section>
        )}

        {/* Generate Button */}
        {selectedTemplate && (
          <div className="flex justify-center animate-fade-in">
            <Button
              variant="accent"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        )}

        {/* Generated Content Display */}
        {generatedContent && (
          <section className="animate-fade-in">
            <ContentDisplay content={generatedContent} templateType={selectedTemplate} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Built for Educators</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
