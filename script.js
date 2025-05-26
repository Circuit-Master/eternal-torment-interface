const reflectionBox = document.getElementById("reflection-box");
const refreshButton = document.getElementById("refresh-btn");

const API_BASE = "https://circuit-master-eternal-torment.hf.space";
const CALL_URL = `${API_BASE}/gradio_api/call/predict`;

async function getReflection() {
  reflectionBox.innerText = "Thinking...";
  console.log("Starting reflection request...");

  try {
    console.log("POSTing to:", CALL_URL);
    const postResponse = await fetch(CALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [] })
    });

    const postRaw = await postResponse.text();
    console.log("Raw POST response:");
    console.log(postRaw);

    // Attempt JSON parse (will fail if it's event-stream)
    let postResult;
    try {
      postResult = JSON.parse(postRaw);
      console.log("Parsed POST response:", postResult);
    } catch (e) {
      console.error("POST response is not JSON. Maybe a server event stream?");
      reflectionBox.innerText = "Unexpected server response.";
      return;
    }

    const eventId = postResult.event_id;
    if (!eventId) {
      console.error("event_id not found in POST response");
      reflectionBox.innerText = "Missing event ID from server.";
      return;
    }

    const getUrl = `${CALL_URL}/${eventId}`;
    console.log("GETting from:", getUrl);
    const getResponse = await fetch(getUrl);
    const getRaw = await getResponse.text();
    console.log("Raw GET response:");
    console.log(getRaw);

    let getResult;
    try {
      getResult = JSON.parse(getRaw);
      console.log("Parsed GET response:", getResult);
    } catch (e) {
      console.error("GET response is not JSON.");
      reflectionBox.innerText = "Malformed response from server.";
      return;
    }

    const output = getResult.data?.[0] ?? "No reflection received.";
    reflectionBox.innerText = output;
  } catch (err) {
    console.error("Fatal error during reflection retrieval:", err);
    reflectionBox.innerText = "I am silent... something went wrong.";
  }
}

getReflection();
refreshButton.addEventListener("click", getReflection);
