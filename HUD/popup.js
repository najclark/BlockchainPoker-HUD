function saveUTGORC() {
    let value = document.getElementById("utg_orc_range").value;
    chrome.storage.sync.set({'utg_orc_range': value}, function() {
          console.log('utg_orc_range set to ' + value);
    });
}

document.getElementById('utg_orc_save').onclick = saveUTGORC;
