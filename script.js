let itemData = [];
let displayedItems = 0;
const itemsPerPage = 200;
let searchInput = '';

function loadJSON(callback) {
    var jsonData = {};
    var count = 0;
    var files = [
        { name: 'output.json', key: 'items' },
        { name: 'images.json', key: 'images' }
    ];

    function handleResponse(responseText, key) {
        try {
            jsonData[key] = JSON.parse(responseText);
            count++;

            if (count === files.length) {
                callback(jsonData);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Response text:', responseText);
        }
    }

    files.forEach(function (file) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', file.name, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                handleResponse(xhr.responseText, file.key);
            }
        };
        xhr.send();
    });
}


function getItemIcon(itemName, imagesData) {
    if (!imagesData) {
      console.error('Images data not loaded.');
      return '';
    }
  
    const wearLevels = [
      '(Factory New)',
      '(Minimal Wear)',
      '(Field Tested)',
      '(Well-Worn)',
      '(Battle-Scarred)'
    ];
  
    for (const wearLevel of wearLevels) {
      const altItemName = itemName.replace(wearLevels[0], wearLevel);
      if (imagesData.hasOwnProperty(altItemName)) {
        return imagesData[altItemName];
      }
    }
  
    console.error('Image URL not found for item:', itemName);
    return './Default.png';
  }
  
  

function searchItems() {
    searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    displayedItems = 0;

    loadJSON(function (response) {
        itemData = Object.entries(response.items).map(([name, price]) => ({ name, price }));

        // Sort the itemData array based on price
        itemData.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceB - priceA;
        });

        displayItems(response);
    });
}

function formatPrice(price) {
    if (price === null) {
        return 'NP';
    }

    const formattedPrice = parseFloat(price).toFixed(2);
    return `$${formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function displayItems(jsonData) {
    const resultsDiv = document.getElementById('results');

    // Match items based on search input
    const matchingItems = itemData.filter(item => {
        if (searchInput.startsWith('/') && searchInput.endsWith('/')) {
            // Input is a regular expression
            const regexInput = searchInput.slice(1, -1);
            const regex = new RegExp(regexInput);
            return regex.test(item.name.toLowerCase());
        } else {
            // Input is a normal string
            return item.name.toLowerCase().includes(searchInput);
        }
    });

    if (matchingItems.length === 0) {
        resultsDiv.innerHTML = '<p style="color: white;">No results found.</p>';
    } else {
        const itemsToShow = matchingItems.slice(displayedItems, displayedItems + itemsPerPage);
        itemsToShow.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const itemIcon = document.createElement('img');
            itemIcon.classList.add('item-icon');
            itemIcon.src = getItemIcon(item.name, jsonData.images);

            const itemText = document.createElement('span');
            itemText.style.maxWidth = "375px";
            itemText.textContent = item.name;

            const priceText = document.createElement('span');
            priceText.style.position = "Absolute"
            priceText.style.left = "1165px";
            priceText.style.fontWeight = "bold";
            priceText.textContent = "\u00A0" + formatPrice(item.price);

            itemDiv.appendChild(itemIcon);
            itemDiv.appendChild(itemText);
            itemDiv.appendChild(priceText);

            resultsDiv.appendChild(itemDiv);

            // Add alternating background colors
            if ((displayedItems + index) % 2 === 0) {
                itemDiv.classList.add('even');
            } else {
                itemDiv.classList.add('odd');
            }
        });

        displayedItems += itemsToShow.length;

        const showMoreButton = document.getElementById('showMoreButton');
        if (displayedItems < matchingItems.length) {
            showMoreButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'none';
        }
    }
}

function showMore() {
    loadJSON(function(response) {
      displayItems(response);
    });
  }

// Automatically display items on page load
window.addEventListener('load', searchItems);