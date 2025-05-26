const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

// Correct REST endpoint
const HF_API = "https://circuit-master-eternal-torment.hf.space/api/predict/";

async function getReflection() {
  reflectionBox.innerText = "Thinking...";
  try {
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [] }) // No input needed
    });

    const result = await response.json();
    const output = result.data[0];
    reflectionBox.innerText = output;
  } catch (err) {
    console.error("Error:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

getReflection();
refreshButton.addEventListener("click", getReflection);
