(function () {
  var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  var numerals = "〇一二三四五六七八九";

  function yearText(year) {
    return String(year).split("").map(function (digit) {
      return numerals[Number(digit)];
    }).join("");
  }

  function dayText(n) {
    var digit = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (n < 10) return digit[n];
    if (n === 10) return "十";
    if (n < 20) return "十" + digit[n - 10];
    if (n === 20) return "二十";
    if (n < 30) return "二十" + digit[n - 20];
    if (n === 30) return "三十";
    return "三十" + digit[n - 30];
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var date = new URLSearchParams(location.search).get("d");
  var entry = (window.JOURNAL || []).filter(function (item) { return item.id === date; })[0];
  var main = document.querySelector("main");

  if (!entry) {
    document.title = "这一天还空着";
    main.innerHTML =
      '<header class="entry"><h1>这一天还空着。</h1><p class="place-line"><a href="index.html">回到日历</a></p></header>';
    return;
  }

  var parts = entry.id.split("-");
  var y = Number(parts[0]);
  var m = Number(parts[1]);
  var d = Number(parts[2]);
  var heading = months[m - 1] + dayText(d) + "日";
  var count = entry.frames.length;
  var kind = entry.kind ? entry.kind + " · " + count + " 帧" : count + " 帧";

  document.title = heading + " · " + entry.place;
  document.querySelector(".mast a").href = "index.html?m=" + parts[0] + "-" + parts[1];

  var html = '<header class="entry">';
  html += '<p class="year">' + yearText(y) + "年</p>";
  html += "<h1>" + heading + "</h1>";
  html += '<p class="place-line">' + esc(entry.place) + "</p>";
  html += '<p class="kind">' + kind + "</p>";
  html += "</header>";
  html += '<div class="frames" id="frames">';

  entry.frames.forEach(function (frame, i) {
    var last = i === count - 1;
    var cls = "shot";
    if (frame.h > frame.w) cls += " tall";
    else if (last) cls += " end";
    else if (i % 2 === 1) cls += " shift";
    html += '<figure class="' + cls + '">';
    html += '<button type="button" class="shot-btn" aria-label="放大第 ' + (i + 1) + ' 张">';
    html += '<img src="' + esc(frame.src) + '" width="' + frame.w + '" height="' + frame.h + '" alt="' + esc(frame.alt) + '">';
    html += "</button><figcaption>" + pad(i + 1) + "</figcaption></figure>";
  });

  html += "</div>";
  main.innerHTML = html;
})();
