const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

// Hugging Face Gradio API endpoints
const API_BASE = "https://circuit-master-eternal-torment.hf.space";
const CALL_URL = `${API_BASE}/gradio_api/call/predict`;

async function getReflection() {
  reflectionBox.innerText = "Thinking...";
  console.log("[getReflection] Started");

  try {
    // 1. POST to trigger prediction
    console.log("[getReflection] Sending POST to:", CALL_URL);
    const postResponse = await fetch(CALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [] })
    });

    const postText = await postResponse.text();
    console.log("[POST Response]", postText);

    const match = postText.match(/"event_id":"([^"]+)"/);
    if (!match) {
      throw new Error("Failed to extract event_id from POST response");
    }
    const eventId = match[1];
    console.log("[getReflection] Extracted event ID:", eventId);

    // 2. GET streamed result
    const getUrl = `${CALL_URL}/${eventId}`;
    console.log("[getReflection] Sending GET to:", getUrl);
    const getResponse = await fetch(getUrl);
    const resultText = await getResponse.text();
    console.log("[GET Response]", resultText);

    // Try to extract reflection from the streamed event format
    const matchData = resultText.match(/"data":\s*\[\s*"([^"]+)"\s*\]/);
    const output = matchData ? matchData[1] : "No reflection received.";
    console.log("[getReflection] Final reflection:", output);
    reflectionBox.innerText = output;

  } catch (err) {
    console.error("Error in getReflection:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

getReflection();
refreshButton.addEventListener("click", getReflection);
