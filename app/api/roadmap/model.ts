import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const task = body.task;

  const prompt = `# Task Generation Prompt Template

## Objective
Generate a structured 4-week task list with concise, clear tasks.

## Output Specifications
- Use short, clear task names (2-5 words max).
- Create a 4-week task plan.
- Each week should include:
  - 2-3 main tasks.
  - Each main task should have 3-4 actionable subtasks.

## Output Format

### Week 1: [Brief Focus Area]
**Initial Setup**
- Install development environment
- Configure tools
- Review basic concepts

**Fundamental Concepts**
- Watch introductory videos
- Complete basic tutorials
- Take initial notes

### Week 2: [Skill Development]
**Basic Techniques**
- Practice core skills
- Complete beginner exercises
- Review progress

**First Project Prep**
- Plan small project
- Gather resources
- Start initial draft

### Week 3: [Advanced Learning]
**Complex Skills**
- Follow advanced tutorials
- Practice challenging exercises
- Analyze complex examples

**Project Development**
- Build main project
- Implement core features
- Test initial version

### Week 4: [Final Stage]
**Project Refinement**
- Complete project
- Optimize code
- Add advanced features

**Final Review**
- Comprehensive practice
- Create summary document
- Plan next steps

## Customization Guidelines
- Keep main tasks concise (2-5 words).
- Use clear, action-oriented language.
- Ensure subtasks are specific and achievable.


### Key Features:
- Extremely concise main task names.
- Clear, actionable subtasks.
- Easy to read and display.
- Flexible for various objectives.
## Generate tasks for: ${task} `;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'roadmap',
      }),
    });

    if (!response.ok) {
      console.error(`Ollama API error: ${response.status} - ${await response.text()}`);
      return NextResponse.json({ error: 'Failed to generate content with Ollama' }, { status: 500 });
    }

    const stream = response.body;
    let fullText = '';
    const reader = stream?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        fullText += decoder.decode(value);
      }
    }

    // Ollama's response is a stream of JSON objects, each containing a 'response' key.
    // We need to concatenate these responses to get the full text.
    const generatedText = fullText
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line).response)
      .join('');

    return NextResponse.json({ data: generatedText });
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return NextResponse.json({ error: 'Failed to call Ollama API' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ data: 'Hello, World from Ollama!' });
}