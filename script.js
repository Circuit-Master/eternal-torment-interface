async function getReflection() {
  console.log("Starting reflection request...");

  const predictUrl = "https://circuit-master-eternal-torment.hf.space/gradio_api/call/predict";

  console.log("POSTing to:", predictUrl);
  const postResponse = await fetch(predictUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [] })
  });

  const postJson = await postResponse.json();
  console.log("POST response:", postJson);

  const eventId = postJson.event_id;
  const getUrl = `${predictUrl}/${eventId}`;
  console.log("GETting from:", getUrl);

  const getResponse = await fetch(getUrl);
  const rawText = await getResponse.text();
  console.log("Raw GET response:", rawText);

  // Parse SSE-style response manually
  const events = rawText
    .split("\n\n")
    .filter(chunk => chunk.includes("event:"))
    .map(chunk => {
      const lines = chunk.split("\n");
      const event = lines.find(l => l.startsWith("event:"))?.slice(7).trim();
      const data = lines.find(l => l.startsWith("data:"))?.slice(6).trim();
      return { event, data };
    });

  console.log("Parsed events:", events);

  const final = events.find(e => e.event === "complete");
  if (!final) throw new Error("No completion event found");

  const reflection = JSON.parse(final.data)[0];
  console.log("Final reflection:", reflection);

  typeText("reflection-box", reflection, () => getReflection()); // Call again after completion
}

// Typewriter effect function
function typeText(elementId, text, callback) {
  const el = document.getElementById(elementId);
  el.textContent = "";
  let index = 0;

  function typeChar() {
    if (index < text.length) {
      el.textContent += text.charAt(index);
      index++;
      setTimeout(typeChar, 30); // Typing speed in ms
    } else if (callback) {
      setTimeout(callback, 3000); // Wait 3 seconds before next reflection
    }
  }

  typeChar();
}

document.addEventListener("DOMContentLoaded", getReflection);
document.getElementById("refresh-btn").addEventListener("click", getReflection);
