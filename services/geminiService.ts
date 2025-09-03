
import { GoogleGenAI, Type } from "@google/genai";
import { TimeTableEntry } from "../types";

// Ensure the API_KEY is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const timetableSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            day: {
                type: Type.STRING,
                description: "Day of the week (e.g., 'Monday', 'Tuesday').",
            },
            period: {
                type: Type.INTEGER,
                description: "The period number, as an integer (e.g., 1, 2).",
            },
            subject: {
                type: Type.STRING,
                description: "The subject being taught.",
            },
            className: {
                type: Type.STRING,
                description: "The name of the class (e.g., '8-A', '10-C').",
            },
            teacherId: {
                type: Type.STRING,
                description: "The unique ID of the teacher, which will be matched later from a provided list.",
            },
        },
        required: ["day", "period", "subject", "className", "teacherId"],
    },
};

export const parseTimetableWithGemini = async (
    timetableText: string,
    teachers: { id: string; name: string }[]
): Promise<TimeTableEntry[]> => {
    const teacherListForPrompt = teachers.map(t => `- ${t.name} (ID: ${t.id})`).join('\n');

    const prompt = `
        You are an intelligent timetable parsing assistant. Your task is to convert the following unstructured text, which describes a school timetable, into a structured JSON array.

        Here is the list of available teachers and their unique IDs. You MUST use these exact IDs in the 'teacherId' field of your JSON output.
        ${teacherListForPrompt}
        
        Now, parse the following timetable text. Make sure every entry in the output array corresponds to a single class period and includes the correct teacherId from the list above.
        
        Timetable Text:
        """
        ${timetableText}
        """
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: timetableSchema,
            },
        });
        if (!response.text) {
            throw new Error("Response did not contain any text.");
          }
        const jsonText = response.text.trim();
        // The response text is already a JSON string because of the responseMimeType
        const parsedData = JSON.parse(jsonText);
        
        // Basic validation
        if (!Array.isArray(parsedData)) {
            throw new Error("Gemini API did not return a valid array.");
        }
        
        // Further validation can be added here to check if items match TimeTableEntry structure
        return parsedData as TimeTableEntry[];

    } catch (error) {
        console.error("Error parsing timetable with Gemini:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to parse timetable. Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while parsing the timetable.");
    }
};
