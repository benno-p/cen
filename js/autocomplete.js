// --- util: debounce ---
function debounce(fn, delay = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

$(function () {
  const $input = $('#searchInput');
  const $menu  = $('#autocompleteMenu');

  let currentItems = [];   // [{id, label, value}]
  let highlightedIndex = -1;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function hideMenu() {
    $menu.removeClass('show').empty();
    highlightedIndex = -1;
  }

  function showMenu(items) {
    $menu.empty();
    if (!items || !items.length) { hideMenu(); return; }
    items.forEach((item, idx) => {
      const html = `
        <button type="button"
          class="dropdown-item text-start" style="font-size:12px;"
          data-index="${idx}">
          ${escapeHtml(item.label ?? item.value ?? '')}
        </button>`;
      $menu.append(html);
    });
    $menu.addClass('show');
  }

  function selectItem(idx) {
    if (idx < 0 || idx >= currentItems.length) return;
    const item = currentItems[idx];
    const val = item.value ?? item.label ?? '';
    $input.val(item.value ?? val);
    console.log(val); // <= demandé
    hideMenu();
    add_layer_admin(item);
  }

  $menu.on('click', '.dropdown-item', function () {
    const idx = Number($(this).data('index'));
    selectItem(idx);
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('#searchInput, #autocompleteMenu').length) {
      hideMenu();
    }
  });

  $input.on('keydown', function (e) {
    if (!$menu.hasClass('show')) return;
    const max = currentItems.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % max;
      updateHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + max) % max;
      updateHighlight();
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        e.preventDefault();
        selectItem(highlightedIndex);
      }
    } else if (e.key === 'Escape') {
      hideMenu();
    }
  });

  function updateHighlight() {
    const $items = $menu.children('.dropdown-item');
    $items.removeClass('active');
    if (highlightedIndex >= 0) {
      const $target = $items.eq(highlightedIndex);
      $target.addClass('active');
      $target.get(0)?.scrollIntoView({ block: 'nearest' });
    }
  }

  const doSearch = debounce(function () {
    const terms = $input.val().trim();
    if (terms.length < 3) { hideMenu(); return; }

    $.ajax({
      url: 'php/ajax/autocomplete_search.js.php',   // <-- endpoint PHP
      method: 'POST',
      dataType: 'json',
      data: { terms: terms },              // => $_POST['terms']
      timeout: 4000
    })
    .done(function (res) {
    currentItems=[];
    outlayer = JSON.parse(res).features;
    console.log('Réponse AJAX:', outlayer);
    outlayer = outlayer.slice(0, 20); // Limiter à 20 résultats
    for (const [key, value] of Object.entries(outlayer)) {
        currentItems.push({id: value.properties.l_id, label: value.properties.l_nom+' - '+value.properties.l_id, value: value.properties.l_nom, geom: value.geometry});
    }
      currentItems.sort((a, b) => a.label.localeCompare(b.label));
      showMenu(currentItems);
    })
    .fail(function (xhr, status, err) {
      console.error('Erreur AJAX:', status, err, xhr.responseText);
      hideMenu();
    });
  }, 300);

  $input.on('input focus', doSearch);
});

