const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

async function getReflection() {
  reflectionBox.innerText = "Thinking...";
  console.log("Starting reflection request...");

  try {
    const postUrl = "https://circuit-master-eternal-torment.hf.space/gradio_api/call/predict";
    console.log("POSTing to:", postUrl);

    const postResponse = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [] }) // No input expected
    });

    const postData = await postResponse.json();
    console.log("POST response:", postData);

    const eventId = postData.event_id;
    if (!eventId) throw new Error("No event_id returned.");

    const getUrl = `https://circuit-master-eternal-torment.hf.space/gradio_api/call/predict/${eventId}`;
    console.log("GETting from:", getUrl);

    // Wait a moment for the result to be ready
    await new Promise(r => setTimeout(r, 800));

    const getResponse = await fetch(getUrl);
    const getText = await getResponse.text();

    console.log("Raw GET response:", getText);

    const parsed = JSON.parse(getText);
    const reflection = parsed.data?.[0] || "Empty reflection.";
    reflectionBox.innerText = reflection;

  } catch (err) {
    console.error("Fatal error during reflection retrieval:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

refreshButton.addEventListener("click", getReflection);
window.addEventListener("load", getReflection);
