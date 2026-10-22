const $ = (id) => document.getElementById(id);
const urlInput = $("apiUrl");
let cameraStream = null;

function cleanUrl(value) {
  return value.trim().replace(/\/+$/, "");
}
function setApiStatus(ok, message) {
  $("apiStat").textContent = ok ? "Online" : "Offline";
  $("apiSub").textContent = ok ? "API responded successfully" : "Connection needs attention";
  $("sidebarStatus").textContent = ok ? "API connected" : "API connection issue";
  $("connectionPill").textContent = ok ? "Connected" : "Unavailable";
  $("connectionPill").style.background = ok ? "#e8f5eb" : "#fff0ed";
  $("connectionPill").style.color = ok ? "#24653a" : "#9a3f35";
  $("connectionResult").className = "connection-result " + (ok ? "good" : "bad");
  $("connectionResult").textContent = message;
}
async function testApi() {
  const base = cleanUrl(urlInput.value);
  if (!base) {
    $("connectionResult").className = "connection-result bad";
    $("connectionResult").textContent = "Enter your full Render API URL first, for example https://your-api-name.onrender.com";
    urlInput.focus();
    return;
  }
  localStorage.setItem("smartOfficeApiUrl", base);
  $("connectionResult").className = "connection-result";
  $("connectionResult").textContent = "Checking /health, then / ...";
  try {
    let response = await fetch(base + "/health", { method: "GET" });
    let path = "/health";
    if (!response.ok) {
      response = await fetch(base + "/", { method: "GET" });
      path = "/";
    }
    if (!response.ok) throw new Error("Server returned HTTP " + response.status);
    let body = "";
    try { body = JSON.stringify(await response.json()); } catch (_) { body = "The server responded."; }
    setApiStatus(true, "Connected using " + path + ". Response: " + body + " Note: this confirms the API is reachable; it does not mean face recognition or attendance endpoints are ready.");
  } catch (err) {
    setApiStatus(false, "Could not connect. Check the URL and Render deployment logs. If the API is online but this dashboard is on a different domain, configure CORS in Flask. Details: " + err.message);
  }
}
$("todayDate").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
urlInput.value = localStorage.getItem("smartOfficeApiUrl") || "";
$("saveUrl").addEventListener("click", () => {
  const base = cleanUrl(urlInput.value);
  if (!base) {
    $("connectionResult").className = "connection-result bad";
    $("connectionResult").textContent = "Enter a Render API URL first.";
    return;
  }
  localStorage.setItem("smartOfficeApiUrl", base);
  $("connectionResult").className = "connection-result";
  $("connectionResult").textContent = "URL saved in this browser. Select Test connection to check the API.";
});
$("testUrl").addEventListener("click", testApi);
$("checkApiBtn").addEventListener("click", testApi);
$("startCamera").addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $("cameraMessage").textContent = "Camera access is not available here. Use HTTPS or localhost and a supported browser.";
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    $("camera").srcObject = cameraStream;
    $("camera").style.display = "block";
    $("cameraPlaceholder").style.display = "none";
    $("cameraTag").textContent = "Camera active";
    $("startCamera").disabled = true;
    $("stopCamera").disabled = false;
    $("cameraMessage").textContent = "Camera preview is active. This page does not send video to the server or identify faces.";
  } catch (err) {
    $("cameraMessage").textContent = "Camera could not start: " + err.message + ". Allow camera access in your browser settings.";
  }
});
$("stopCamera").addEventListener("click", stopCamera);
function stopCamera() {
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
  $("camera").srcObject = null;
  $("camera").style.display = "none";
  $("cameraPlaceholder").style.display = "flex";
  $("cameraTag").textContent = "Camera off";
  $("startCamera").disabled = false;
  $("stopCamera").disabled = true;
  $("cameraMessage").textContent = "Camera preview only. Face recognition is not connected to this webpage yet.";
}
$("exportBtn").addEventListener("click", () => {
  $("connectionResult").className = "connection-result";
  $("connectionResult").textContent = "Export is not available yet because the attendance records API has not been implemented. No sample records will be exported.";
  $("settings").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
  link.classList.add("active");
}));
