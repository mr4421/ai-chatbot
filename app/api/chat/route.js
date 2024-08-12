import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI with API key
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    // Retrieve the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract the prompt from the request body
    const { prompt } = await req.json();

    if (!prompt) {
      console.log("No prompt provided");
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    console.log("Prompt received:", prompt);

    // Generate content using the model
    const result = await model.generateContent(prompt);
    console.log("Result from model:", result);

    // Extract the text from the result
    const text = await result.response.text();

    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);  // Log the full error object
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });  // Include detailed error message in the response
  }
}