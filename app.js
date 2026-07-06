let savedLocation = null;
let deferredPrompt = null;

const form = document.getElementById("reportForm");
const message = document.getElementById("formMessage");
const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove("hidden");
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = "GPS not supported";
    return;
  }
  locationStatus.textContent = "Getting location...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      savedLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      };
      locationStatus.textContent = "GPS added";
    },
    () => {
      locationStatus.textContent = "GPS failed";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "message";

  const photo = document.getElementById("photo").files[0];
  if (!photo) {
    message.textContent = "Photo is required.";
    message.classList.add("error");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const fileExt = photo.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    const upload = await supabaseClient.storage
      .from("report-photos")
      .upload(filePath, photo);

    if (upload.error) throw upload.error;

    const publicUrl = supabaseClient.storage
      .from("report-photos")
      .getPublicUrl(filePath).data.publicUrl;

    const report = {
      employee_name: document.getElementById("employeeName").value.trim(),
      park: document.getElementById("park").value,
      category: document.getElementById("category").value,
      priority: document.getElementById("priority").value,
      asset: document.getElementById("asset").value.trim(),
      description: document.getElementById("description").value.trim(),
      photo_url: publicUrl,
      photo_path: filePath,
      status: "Open",
      gps_lat: savedLocation?.lat || null,
      gps_lng: savedLocation?.lng || null,
      gps_accuracy: savedLocation?.accuracy || null
    };

    const insert = await supabaseClient.from("reports").insert(report);
    if (insert.error) throw insert.error;

    message.textContent = "Report submitted.";
    message.classList.add("success");
    form.reset();
    savedLocation = null;
    locationStatus.textContent = "Not added";
  } catch (error) {
    console.error(error);
    message.textContent = "Something went wrong. Check Supabase settings.";
    message.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Report";
  }
});
