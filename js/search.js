(function () {
  var panel = document.querySelector('[data-search-panel]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  if (!panel || !input || !results) return;

  var sources = (panel.dataset.searchSources || '')
    .split(',')
    .map(function (value) { return value.trim(); })
    .filter(Boolean);
  if (!sources.length) return;

  var documents = null;
  var loading = null;

  function normalise(json) {
    var docs = json.documentStore && json.documentStore.docs;
    if (docs && !Array.isArray(docs)) {
      return Object.keys(docs).map(function (id) {
        var doc = docs[id];
        return {
          title: doc.title || '',
          body: (doc.description ? doc.description + '\n' : '') + (doc.body || ''),
          url: doc.path || doc.url || doc.id || ''
        };
      });
    }
    var list = Array.isArray(docs) ? docs : Array.isArray(json.docs) ? json.docs : Array.isArray(json) ? json : [];
    return list.map(function (doc) {
      return {
        title: doc.title || '',
        body: doc.body || '',
        url: doc.path || doc.url || doc.id || ''
      };
    });
  }

  function load() {
    if (documents) return Promise.resolve(documents);
    if (loading) return loading;
    loading = Promise.all(
      sources.map(function (url) {
        return fetch(url)
          .then(function (response) { return response.ok ? response.json() : null; })
          .catch(function () { return null; });
      })
    ).then(function (payloads) {
      var merged = [];
      payloads.forEach(function (payload) {
        if (payload) merged = merged.concat(normalise(payload));
      });
      documents = merged;
      return documents;
    });
    return loading;
  }

  function score(doc, terms) {
    var title = (doc.title || '').toLowerCase();
    var body = (doc.body || '').toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (title.indexOf(term) !== -1) total += 6;
      if (body.indexOf(term) !== -1) total += 1;
    }
    return total;
  }

  function excerpt(doc, terms) {
    var body = doc.body || '';
    var lower = body.toLowerCase();
    var at = -1;
    for (var i = 0; i < terms.length && at === -1; i++) {
      at = lower.indexOf(terms[i]);
    }
    if (at === -1) return body.slice(0, 140);
    var start = Math.max(0, at - 60);
    var text = body.slice(start, start + 170).trim();
    return (start > 0 ? '…' : '') + text + '…';
  }

  function render(term) {
    var terms = term.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) {
      results.innerHTML = '';
      return;
    }
    var hits = (documents || [])
      .map(function (doc) { return { doc: doc, score: score(doc, terms) }; })
      .filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 20);

    if (!hits.length) {
      results.innerHTML = '<li class="search-empty">' + (panel.dataset.searchEmpty || '') + '</li>';
      return;
    }

    results.innerHTML = hits
      .map(function (hit) {
        return (
          '<li><a href="' + hit.doc.url + '">' +
          '<span class="search-result__title">' + (hit.doc.title || hit.doc.url) + '</span>' +
          '<span class="search-result__path">' + hit.doc.url + '</span>' +
          '<span class="search-result__excerpt">' + excerpt(hit.doc, terms) + '</span>' +
          '</a></li>'
        );
      })
      .join('');
  }

  var timer = null;
  input.addEventListener('input', function () {
    var value = input.value.trim();
    if (!value) {
      results.innerHTML = '';
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
      load().then(function () { render(value); });
    }, 120);
  });
})();
