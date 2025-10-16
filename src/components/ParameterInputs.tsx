import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Parameters {
  gradeLevel: string;
  subject: string;
  duration: string;
  learningStyle: string;
  topic: string;
}

interface ParameterInputsProps {
  parameters: Parameters;
  onParameterChange: (key: keyof Parameters, value: string) => void;
}

export const ParameterInputs = ({ parameters, onParameterChange }: ParameterInputsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Customize Your Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gradeLevel">Grade Level</Label>
          <Select 
            value={parameters.gradeLevel} 
            onValueChange={(value) => onParameterChange('gradeLevel', value)}
          >
            <SelectTrigger id="gradeLevel" className="transition-all duration-300 focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="K-2">K-2 (Ages 5-7)</SelectItem>
              <SelectItem value="3-5">3-5 (Ages 8-10)</SelectItem>
              <SelectItem value="6-8">6-8 (Ages 11-13)</SelectItem>
              <SelectItem value="9-12">9-12 (Ages 14-18)</SelectItem>
              <SelectItem value="College">College/University</SelectItem>
              <SelectItem value="Adult">Adult Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject Area</Label>
          <Input
            id="subject"
            placeholder="e.g., Mathematics, Science, History"
            value={parameters.subject}
            onChange={(e) => onParameterChange('subject', e.target.value)}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select 
            value={parameters.duration} 
            onValueChange={(value) => onParameterChange('duration', value)}
          >
            <SelectTrigger id="duration" className="transition-all duration-300 focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
              <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
              <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
              <SelectItem value="60-90 minutes">60-90 minutes</SelectItem>
              <SelectItem value="Full class period">Full class period</SelectItem>
              <SelectItem value="Multiple sessions">Multiple sessions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningStyle">Learning Style</Label>
          <Select 
            value={parameters.learningStyle} 
            onValueChange={(value) => onParameterChange('learningStyle', value)}
          >
            <SelectTrigger id="learningStyle" className="transition-all duration-300 focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select learning style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visual">Visual (diagrams, charts)</SelectItem>
              <SelectItem value="Auditory">Auditory (lectures, discussions)</SelectItem>
              <SelectItem value="Kinesthetic">Kinesthetic (hands-on)</SelectItem>
              <SelectItem value="Reading/Writing">Reading/Writing</SelectItem>
              <SelectItem value="Mixed">Mixed/Multi-modal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic or Focus (Optional)</Label>
        <Textarea
          id="topic"
          placeholder="e.g., Introduction to Photosynthesis, World War II, Algebraic Equations..."
          value={parameters.topic}
          onChange={(e) => onParameterChange('topic', e.target.value)}
          className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
    </div>
  );
};
