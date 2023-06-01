let itemData = [];
let displayedItems = 0;
const itemsPerPage = 20;
let searchInput = '';

function loadJSON(callback) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'output.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

function searchItems() {
    searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    displayedItems = 0;

    loadJSON(function (response) {
        itemData = Object.entries(JSON.parse(response)).map(([name, price]) => ({ name, price }));

        // Sort the itemData array based on price
        itemData.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceB - priceA;
        });

        displayItems();
    });
}

function formatPrice(price) {
    if (price === null) {
        return 'NP';
    }

    const formattedPrice = parseFloat(price).toFixed(2);
    return `$${formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function getItemIcon(itemName) {
    if (itemName.includes('Sticker')) {
        return 'Sticker.png';
    } else if (itemName.includes('★')) {
        if (itemName.includes('Glove')) {
            return 'Glove.png';
        } else {
            return 'Knife.png';
        }
    } else if (itemName.includes('Music Kit')) {
        return 'Music.png';
    } else if (
        itemName.includes('AWP') ||
        itemName.includes('AK-47') ||
        itemName.includes('M4A4') ||
        itemName.includes('M4A1-S') ||
        itemName.includes('Galil AR') ||
        itemName.includes('FAMAS') ||
        itemName.includes('SCAR-20') ||
        itemName.includes('G3SG1') ||
        itemName.includes('SG 553') ||
        itemName.includes('AUG') ||
        itemName.includes('SSG 08') ||
        itemName.includes('AWP') ||
        itemName.includes('P90') ||
        itemName.includes('MP7') ||
        itemName.includes('MP9') ||
        itemName.includes('MAC-10') ||
        itemName.includes('UMP-45') ||
        itemName.includes('PP-Bizon') ||
        itemName.includes('Glock-18') ||
        itemName.includes('USP-S') ||
        itemName.includes('P2000') ||
        itemName.includes('Dual Berettas') ||
        itemName.includes('Tec-9') ||
        itemName.includes('Five-SeveN') ||
        itemName.includes('CZ75-Auto') ||
        itemName.includes('Desert Eagle') ||
        itemName.includes('R8 Revolver') ||
        itemName.includes('Negev') ||
        itemName.includes('XM1014')
    ) {
        return 'Gun.png';
    } else if (
        itemName.includes('Ava') ||
        itemName.includes('The Doctor') ||
        itemName.includes('Dragomir') ||
        itemName.includes('Rezan') ||
        itemName.includes('Maximus') ||
        itemName.includes('Blackwolf') ||
        itemName.includes('John Pilgrim') ||
        itemName.includes('Seal Team 6 Soldier') ||
        itemName.includes('Buckshot') ||
        itemName.includes('Lt. Commander Ricksaw') ||
        itemName.includes('Ground Rebel') ||
        itemName.includes('Osiris') ||
        itemName.includes('Prof. Shahmat') ||
        itemName.includes('3rd Commando Company') ||
        itemName.includes('Bio-Haz Specialist') ||
        itemName.includes('Michael Syfers') ||
        itemName.includes('Safecracker Voltzmann') ||
        itemName.includes('Sir Bloody Darryl') ||
        itemName.includes('Sir Bloody Silent Darryl')
    ) {
        return 'Agent.png';
    }

    return 'Default.png';
}

function displayItems() {
    const resultsDiv = document.getElementById('results');
    const matchingItems = itemData.filter(item => item.name.toLowerCase().includes(searchInput));

    if (matchingItems.length === 0) {
        resultsDiv.innerHTML = '<p style="color: white;">No results found.</p>';
    } else {
        const itemsToShow = matchingItems.slice(displayedItems, displayedItems + itemsPerPage);
        itemsToShow.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const itemIcon = document.createElement('img');
            itemIcon.classList.add('item-icon');
            itemIcon.src = getItemIcon(item.name);

            const itemText = document.createElement('span');
            itemText.textContent = item.name;

            const priceText = document.createElement('span');
            priceText.textContent = formatPrice(item.price);

            itemDiv.appendChild(itemIcon);
            itemDiv.appendChild(itemText);
            itemDiv.appendChild(document.createTextNode(' - '));
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
    displayItems();
}

// Automatically display items on page load
window.addEventListener('load', searchItems);
