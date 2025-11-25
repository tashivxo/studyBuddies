import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateType, parameters } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const MODEL = Deno.env.get("OPENAI_MODEL");
    const BASE = Deno.env.get("OPENAI_API_BASE");
    const VERSION = Deno.env.get("OPENAI_API_VERSION");
    
    if (!OPENAI_API_KEY || !MODEL || !BASE || !VERSION) {
      const missing = [];
      if (!OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
      if (!MODEL) missing.push("OPENAI_MODEL");
      if (!BASE) missing.push("OPENAI_API_BASE");
      if (!VERSION) missing.push("OPENAI_API_VERSION");
      throw new Error(`Azure OpenAI configuration incomplete. Missing: ${missing.join(", ")}`);
    }

    // Build the system prompt based on template type
    const systemPrompts: Record<string, string> = {
      "lesson-plan": `You are an expert educational content creator specializing in comprehensive lesson plans. Create detailed, engaging lesson plans that include clear learning objectives, step-by-step activities, assessment methods, and differentiation strategies. Focus on student engagement and measurable outcomes.`,
      
      "study-guide": `You are an expert at creating effective study materials. Generate comprehensive study guides that organize information clearly, include key concepts, definitions, examples, and practice questions. Make content accessible and easy to review.`,
      
      "quiz": `You are an expert assessment designer. Create high-quality quizzes with a variety of question types (multiple choice, short answer, true/false) that accurately measure student understanding. Include clear questions, plausible distractors, and correct answers with brief explanations.`,
      
      "learning-objectives": `You are an expert curriculum designer. Write clear, measurable learning objectives using Bloom's Taxonomy. Ensure objectives are specific, achievable, and aligned with educational standards. Focus on observable student behaviors and outcomes.`,
      
      "activity": `You are an expert at designing engaging educational activities. Create interactive, hands-on activities that promote active learning, collaboration, and critical thinking. Include clear instructions, materials needed, and expected outcomes.`
    };

    const systemPrompt = systemPrompts[templateType] || systemPrompts["lesson-plan"];

    // Build user prompt with parameters
    const userPrompt = `Create educational content with the following specifications:
- Grade Level: ${parameters.gradeLevel}
- Subject: ${parameters.subject}
- Duration: ${parameters.duration}
- Learning Style: ${parameters.learningStyle}
- Topic: ${parameters.topic || 'General'}

Please provide comprehensive, well-structured content that is appropriate for the specified grade level and engaging for the learning style mentioned.`;

    console.log("Generating content with:", { templateType, parameters });

    const response = await fetch(`${BASE}/openai/deployments/${MODEL}/chat/completions?api-version=${VERSION}`, {
      method: "POST",
      headers: {
        "api-key": OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated");
    }

    console.log("Content generated successfully");

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-content function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
