const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

// Hugging Face Gradio API endpoints
const API_BASE = "https://circuit-master-eternal-torment.hf.space";
const CALL_URL = `${API_BASE}/gradio_api/call/predict`;

async function getReflection() {
  reflectionBox.innerText = "Thinking...";

  try {
    // 1. Send POST to initiate prediction
    const postResponse = await fetch(CALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [] })
    });

    const postResult = await postResponse.json();
    const eventId = postResult.event_id;

    if (!eventId) {
      throw new Error("No event ID returned");
    }

    // 2. Poll GET endpoint using the event ID
    const getUrl = `${CALL_URL}/${eventId}`;
    const getResponse = await fetch(getUrl);
    const getResult = await getResponse.json();

    const output = getResult.data?.[0] ?? "No reflection received.";
    reflectionBox.innerText = output;
  } catch (err) {
    console.error("Error:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

getReflection();
refreshButton.addEventListener("click", getReflection);
