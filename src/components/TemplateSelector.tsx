import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, ClipboardList, Target, Lightbulb } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const templates: Template[] = [
  {
    id: "lesson-plan",
    name: "Lesson Plan",
    description: "Comprehensive lesson plans with objectives, activities, and assessments",
    icon: BookOpen,
  },
  {
    id: "study-guide",
    name: "Study Guide",
    description: "Organized study materials with key concepts and practice questions",
    icon: FileText,
  },
  {
    id: "quiz",
    name: "Quiz/Assessment",
    description: "High-quality quizzes with varied question types and explanations",
    icon: ClipboardList,
  },
  {
    id: "learning-objectives",
    name: "Learning Objectives",
    description: "Clear, measurable objectives using Bloom's Taxonomy",
    icon: Target,
  },
  {
    id: "activity",
    name: "Activity Ideas",
    description: "Interactive, hands-on activities promoting active learning",
    icon: Lightbulb,
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Choose Content Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-medium)] ${
                isSelected 
                  ? "ring-2 ring-primary shadow-[var(--shadow-glow)] bg-primary/5" 
                  : "hover:border-primary/50"
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
