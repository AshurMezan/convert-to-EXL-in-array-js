document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const firstColumnData = json.map(row => row[0]).filter(cell => cell !== undefined);
    const jsContent = `const dataArray = ${JSON.stringify(firstColumnData)};`;

    createDownloadableFile(jsContent);
  };

  reader.readAsArrayBuffer(file);
}

function createDownloadableFile(content) {
  const blob = new Blob([content], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const downloadButton = document.getElementById('downloadButton');
  
  downloadButton.href = url;
  downloadButton.download = 'add.js';
  downloadButton.style.display = 'block';
  downloadButton.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(url), 100);
  });
}
