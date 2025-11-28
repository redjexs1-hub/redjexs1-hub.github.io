let mainImage = null;
let tileCanvases = [];
let tileColors = [];

async function loadAllPNG() {
  const status = document.getElementById('tilesStatus');
  const bar = document.querySelector('#tilesProgress .bar');
  document.getElementById('tilesProgress').style.display = 'block';

  try {
    const res = await fetch('img/');
    if (!res.ok) throw new Error('Папка img/ недоступна');

    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Правильно получаем только .png ссылки
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href && href.toLowerCase().endsWith('.png'))
      .map(href => {
        // Делаем полный путь: img/filename.png
        if (href.startsWith('img/') || href.startsWith('/img/')) return href.replace(/^\/+/, '');
        if (href.startsWith('/')) return href.slice(1);
        return 'img/' + href;
      });

    if (links.length === 0) {
      status.textContent = 'В папке img/ нет PNG-файлов';
      return;
    }

    status.textContent = `Найдено ${links.length} PNG. Загрузка...`;
    bar.style.width = '0%';

    const tileSize = parseInt(document.getElementById('tileSize').value);
    let loaded = 0;
    let good = 0;

    for (let i = 0; i < links.length; i++) {
      const path = links[i];
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = tileSize;
        canvas.height = tileSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, tileSize, tileSize);

        const data = ctx.getImageData(0, 0, tileSize, tileSize).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let j = 0; j < data.length; j += 4) {
          if (data[j + 3] > 80) {
            r += data[j];
            g += data[j + 1];
            b += data[j + 2];
            count++;
          }
        }

        if (count > tileSize * tileSize * 0.05) {
          tileCanvases.push(canvas);
          tileColors.push([
            Math.round(r / count),
            Math.round(g / count),
            Math.round(b / count)
          ]);
          good++;
        }

        loaded++;
        bar.style.width = (loaded / links.length * 100) + '%';
        status.textContent = `Загружено: ${loaded}/${links.length} | Годных: ${good}`;

        if (loaded === links.length) {
          document.getElementById('tilesProgress').style.display = 'none';
          status.textContent = `Готово! Доступно тайлов: ${tileCanvases.length}`;
          checkReady();
        }
      };

      img.onerror = () => {
        console.warn('Не удалось загрузить:', path);
        loaded++;
        if (loaded === links.length) {
          document.getElementById('tilesProgress').style.display = 'none';
          status.textContent = `Загружено: ${tileCanvases.length} тайлов (с ошибками)`;
          checkReady();
        }
      };

      // САМОЕ ГЛАВНОЕ: правильный путь!
      img.src = path + (path.includes('?') ? '&' : '?') + 't=' + Date.now();
    }
  } catch (e) {
    status.innerHTML = 'Ошибка: запусти через сервер!<br><code>python -m http.server 8000</code>';
    console.error(e);
  }
}

// === Остальные функции (главное изображение + мозаика) ===
function loadMain(file) {
  const reader = new FileReader();
  reader.onload = e => {
    mainImage = new Image();
    mainImage.onload = () => {
      document.getElementById('mainPreview').innerHTML = `<img src="${e.target.result}" style="max-width:100%;border-radius:12px;">`;
      checkReady();
    };
    mainImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('mainImage').addEventListener('change', e => e.target.files[0] && loadMain(e.target.files[0]));
document.getElementById('mainDrop').addEventListener('drop', e => {
  e.preventDefault(); e.currentTarget.classList.remove('dragover');
  e.dataTransfer.files[0] && loadMain(e.dataTransfer.files[0]);
});
['dragover','dragenter'].forEach(ev => document.getElementById('mainDrop').addEventListener(ev, e => {e.preventDefault(); e.currentTarget.classList.add('dragover');}));
['dragleave','dragend'].forEach(ev => document.getElementById('mainDrop').addEventListener(ev, () => document.getElementById('mainDrop').classList.remove('dragover')));

function checkReady() {
  if (mainImage && tileCanvases.length > 10) {
    document.getElementById('createBtn').disabled = false;
  }
}

// === СОЗДАНИЕ МОЗАИКИ С МИКСОМ ФОНА (как в предыдущей версии) ===
document.getElementById('createBtn').onclick = () => {
  const tileSize = parseInt(document.getElementById('tileSize').value);
  const outputWidth = parseInt(document.getElementById('outputWidth').value);
  const reuse = document.getElementById('reuseTiles').checked;

  const scale = outputWidth / mainImage.width;
  const canvas = document.getElementById('mosaicCanvas');
  canvas.width = mainImage.width * scale;
  canvas.height = mainImage.height * scale;
  const ctx = canvas.getContext('2d');

  const low = document.createElement('canvas');
  low.width = Math.floor(canvas.width / tileSize);
  low.height = Math.floor(canvas.height / tileSize);
  low.getContext('2d').drawImage(mainImage, 0, 0, low.width, low.height);

  const gridW = low.width, gridH = low.height;
  const total = gridW * gridH;
  let placed = 0;
  const colorCache = new Map();

  document.getElementById('assemblyProgress').style.display = 'block';
  document.getElementById('result').style.display = 'block';

  function placeTile() {
    const x = placed % gridW;
    const y = Math.floor(placed / gridW);
    const pixel = low.getContext('2d').getImageData(x, y, 1, 1).data;
    const alpha = pixel[3];

    if (alpha < 100) {
      placed++;
    } else {
      const target = [pixel[0], pixel[1], pixel[2]];
      const key = target.join(',');

      let candidates = colorCache.get(key);
      if (!candidates || candidates.length === 0) {
        candidates = [];
        for (let i = 0; i < tileColors.length; i++) {
          const dist = Math.hypot(target[0]-tileColors[i][0], target[1]-tileColors[i][1], target[2]-tileColors[i][2]);
          if (dist < 70) candidates.push(i);
        }
        if (candidates.length === 0) {
          let best = 0, minD = Infinity;
          for (let i = 0; i < tileColors.length; i++) {
            const d = Math.hypot(target[0]-tileColors[i][0], target[1]-tileColors[i][1], target[2]-tileColors[i][2]);
            if (d < minD) { minD = d; best = i; }
          }
          candidates = [best];
        }
        colorCache.set(key, candidates.slice());
      }

      const idx = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
      if (candidates.length === 0) colorCache.delete(key);

      ctx.drawImage(tileCanvases[idx], x * tileSize, y * tileSize, tileSize, tileSize);
      placed++;
    }

    const pct = Math.round(placed / total * 100);
    document.getElementById('progressPercent').textContent = pct + '%';
    document.getElementById('assemblyBar').style.width = pct + '%';

    if (placed < total) {
      if (placed % 40 === 0) setTimeout(placeTile, 0);
      else placeTile();
    } else {
      document.getElementById('downloadLink').href = canvas.toDataURL('image/png');
      document.getElementById('downloadSection').style.display = 'block';
      document.getElementById('assemblyProgress').style.display = 'none';
    }
  }

  placeTile();
};
document.getElementById('tileSize').addEventListener('input', e => {
  document.getElementById('tileSizeValue').textContent = e.target.value;
});

window.onload = () => loadAllPNG();