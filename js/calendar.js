(function () {
  var entries = window.JOURNAL || [];
  var byDay = {};
  entries.forEach(function (entry) { byDay[entry.id] = entry; });

  var week = ["日", "一", "二", "三", "四", "五", "六"];
  var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  var numerals = "〇一二三四五六七八九";

  var root = document.getElementById("cal");
  var title = document.getElementById("month-title");
  var yearEl = document.getElementById("year");
  var live = document.getElementById("live");

  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth();
  var query = new URLSearchParams(location.search).get("m");
  if (query && /^\d{4}-\d{2}$/.test(query)) {
    y = Number(query.slice(0, 4));
    m = Number(query.slice(5, 7)) - 1;
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function yearText(year) {
    return String(year).split("").map(function (digit) {
      return numerals[Number(digit)];
    }).join("");
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function render() {
    var start = new Date(y, m, 1).getDay();
    var count = new Date(y, m + 1, 0).getDate();
    var todayY = now.getFullYear();
    var todayM = now.getMonth();
    var todayD = now.getDate();
    var html = '<table class="cal"><caption class="sr">' + y + "年" + months[m] + '</caption><thead><tr>';

    week.forEach(function (name) {
      html += '<th scope="col">' + name + "</th>";
    });
    html += "</tr></thead><tbody>";

    var day = 1;
    for (var row = 0; row < 6 && day <= count; row++) {
      html += "<tr>";
      for (var col = 0; col < 7; col++) {
        var index = row * 7 + col;
        if (index < start || day > count) {
          html += '<td class="out"></td>';
          continue;
        }
        var id = y + "-" + pad(m + 1) + "-" + pad(day);
        var entry = byDay[id];
        var today = y === todayY && m === todayM && day === todayD;
        html += '<td' + (today ? ' class="today"' : "") + (today ? ' aria-current="date"' : "") + ">";
        if (entry) {
          html += '<a class="day" href="day.html?d=' + id + '" aria-label="' +
            y + "年" + (m + 1) + "月" + day + "日，" + esc(entry.place) + '">';
          html += '<span class="num">' + day + "</span>";
          html += '<span class="place"><i class="dot" aria-hidden="true"></i>' + esc(entry.short) + "</span>";
          html += "</a>";
        } else {
          html += '<span class="num">' + day + "</span>";
        }
        html += "</td>";
        day += 1;
      }
      html += "</tr>";
    }
    html += "</tbody></table>";
    root.innerHTML = html;
    yearEl.textContent = yearText(y);
    title.textContent = months[m];
    document.title = y + "年" + months[m];
    live.textContent = y + "年" + months[m];
    history.replaceState(null, "", "?m=" + y + "-" + pad(m + 1));
  }

  function shiftMonth(delta) {
    m += delta;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    render();
  }

  document.getElementById("prev-year").addEventListener("click", function () {
    y -= 1;
    render();
  });
  document.getElementById("next-year").addEventListener("click", function () {
    y += 1;
    render();
  });
  document.getElementById("prev").addEventListener("click", function () { shiftMonth(-1); });
  document.getElementById("next").addEventListener("click", function () { shiftMonth(1); });

  var loose = window.LOOSE || [];
  if (loose.length) {
    document.getElementById("loose").hidden = false;
    document.getElementById("loose-list").innerHTML = loose.map(function (item) {
      return '<li><a href="' + esc(item.href) + '">' + esc(item.label) + "</a></li>";
    }).join("");
  }

  render();
})();
