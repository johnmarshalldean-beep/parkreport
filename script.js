const form = document.getElementById("reportForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(e){
    e.preventDefault();

    message.innerHTML = "✅ Thank you! Your park report has been submitted.";

    form.reset();
});