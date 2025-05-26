const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

// This is the endpoint for your Hugging Face Space
const HF_API = "https://circuit-master-eternal-torment.hf.space/api/predict/";

// Fetch a reflection
async function getReflection() {
  reflectionBox.innerText = "Thinking...";
  try {
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [] }) // No input, triggers random generation
    });

    const result = await response.json();
    const output = result.data[0];
    reflectionBox.innerText = output;
  } catch (err) {
    console.error("Error:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

// Auto-run on load
getReflection();
refreshButton.addEventListener("click", getReflection);
