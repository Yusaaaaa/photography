(function () {
  var dialog = document.getElementById("lightbox");
  if (!dialog) return;

  var img = dialog.querySelector("img");
  var cap = dialog.querySelector("figcaption");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".shot-btn"));
  var index = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function show(next) {
    if (!buttons.length) return;
    index = (next + buttons.length) % buttons.length;
    var source = buttons[index].querySelector("img");
    img.src = source.src;
    img.alt = source.alt;
    cap.textContent = pad(index + 1) + " / " + pad(buttons.length);
    if (!dialog.open) dialog.showModal();
  }

  buttons.forEach(function (button, i) {
    button.addEventListener("click", function () { show(i); });
  });

  dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  dialog.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog || event.target.classList.contains("lb-inner")) dialog.close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1); }
  });
})();
