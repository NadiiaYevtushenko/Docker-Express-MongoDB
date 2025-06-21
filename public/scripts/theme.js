document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("toggle-theme");
  if (!button) return;

  button.addEventListener("click", async () => {
    const current = document.body.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    await fetch("/set-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ theme: next })
    });

    location.reload();
  });
});
