(function () {
  var names = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];
  var abbr = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
  var state = document.getElementById("perk-state");
  var category = document.getElementById("perk-category");
  var status = document.getElementById("perk-status");
  var results = document.getElementById("perk-results");
  var count = document.getElementById("perk-count");
  if (!state || !results || !window.VETERAN_PERKS) return;
  names.forEach(function (name, i) {
    var option = document.createElement("option");
    option.value = abbr[i]; option.textContent = name; state.appendChild(option);
  });
  Array.from(new Set(window.VETERAN_PERKS.map(function (item) { return item.category; }))).sort().forEach(function (name) {
    var option = document.createElement("option"); option.value = name; option.textContent = name; category.appendChild(option);
  });
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) { return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]; });
  }
  function render() {
    var selectedState = state.value, selectedCategory = category.value, selectedStatus = status.value;
    var items = window.VETERAN_PERKS.filter(function (item) {
      return (!selectedState || item.geography === "NATIONAL" || item.state === selectedState) &&
        (!selectedCategory || item.category === selectedCategory) && (!selectedStatus || item.status === selectedStatus);
    });
    count.textContent = items.length + (items.length === 1 ? " verified listing" : " verified listings") + (selectedState ? " for " + state.options[state.selectedIndex].text : "");
    results.innerHTML = items.length ? items.map(function (item) {
      var place = item.geography === "NATIONAL" ? "National program" : stateName(item.state);
      return '<article class="perk-card"><div class="perk-tags"><span class="perk-tag">' + escapeHtml(place) + '</span><span class="perk-tag">' + escapeHtml(item.category) + '</span><span class="perk-tag">' + escapeHtml(item.status) + '</span></div><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.summary) + '</p><dl><dt>Eligibility</dt><dd>' + escapeHtml(item.eligibility) + '</dd><dt>Terms and costs</dt><dd>' + escapeHtml(item.details) + '</dd><dt>Source checked</dt><dd>' + escapeHtml(item.source) + ' · ' + escapeHtml(item.checked) + '</dd></dl><a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">Check current terms at the official source</a></article>';
    }).join("") : '<div class="empty-state"><h2>No verified state-specific listings yet</h2><p>We have not added a source-checked offer for this state and filter. National listings remain available when you clear the category or status filter.</p></div>';
  }
  function stateName(code) { var i = abbr.indexOf(code); return i < 0 ? code : names[i]; }
  [state, category, status].forEach(function (control) { control.addEventListener("change", render); });
  render();
}());