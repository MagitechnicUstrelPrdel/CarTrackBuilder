const tileTypes = ["tile-grass", "tile-road", "tile-water"];
let mapState = Array(400).fill(tileTypes[0]);

let currentMapId = null;

const mainMenuScreen = document.getElementById('main-menu');
const editorScreen = document.getElementById('editor-screen');

const newMapBtn = document.getElementById('new-map-btn');
const saveBtn = document.getElementById('save-btn');
const exitBtn = document.getElementById('exit-btn');
const resetBtn = document.getElementById('reset-btn')

const mapNameInput = document.querySelector('input[name="map-name"]');
const mapContainer = document.querySelector('.container');
const savedMapsList = document.getElementById('saved-maps-list');


showScreen(mainMenuScreen);
hideScreen(editorScreen);
displaySavedMaps();

initEvents()

function showScreen(screenElement) {
    screenElement.classList.remove('hidden');
}

function hideScreen(screenElement) {
    screenElement.classList.add('hidden');
}



function generateMap(initialMapState = mapState){
    const existingMapGrid = document.querySelector('.map-grid');
    if (existingMapGrid) {
        existingMapGrid.remove();
    }

    const mapGrid = document.createElement('div');
    mapGrid.classList.add('map-grid');

    for (let i = 0; i < initialMapState.length; i++){
        mapGrid.append(generateTile(initialMapState[i], i));
    }
    return mapGrid;
}

function generateTile(type, index){

    const tile = document.createElement('div');

    tile.classList.add('tile');
    tile.classList.add(type);
    tile.dataset.index = index;

    return tile;
}

function changeTileType(tile, index){

    let currentClass = mapState[index];

    let nextClass = tileTypes[0];


    if(currentClass){
        let nextIndex = (tileTypes.indexOf(currentClass) + 1) % tileTypes.length
        nextClass = tileTypes[nextIndex];
        tile.classList.remove(currentClass);
    }
    tile.classList.add(nextClass);
    mapState[index] = nextClass;
}

function handleTileClick(event){
    const clickedTile = event.target;
    if (clickedTile.classList.contains('tile')) {
        const index = parseInt(clickedTile.dataset.index);
        changeTileType(clickedTile, index);
    }
}

function startNewMap(){
    mapState = Array(400).fill(tileTypes[0]);
    currentMapId = null;
    mapNameInput.value = "";

    const newMapGrid = generateMap(mapState);
    mapContainer.append(newMapGrid);
    newMapGrid.addEventListener('click', handleTileClick);
}

function loadMap(mapObject){
    mapState = mapObject.state;
    currentMapId = mapObject.id;
    mapNameInput.value = mapObject.name;

    const loadedMapGrid = generateMap(mapState);
    mapContainer.append(loadedMapGrid);

    loadedMapGrid.addEventListener('click', handleTileClick);

    hideScreen(mainMenuScreen);
    showScreen(editorScreen);
}

function displaySavedMaps(){
    savedMapsList.innerHTML = "";

    const savedMapsJSON = localStorage.getItem("savedMaps");
    const savedMaps = savedMapsJSON ? JSON.parse(savedMapsJSON) : [];

    if (savedMaps.length > 0) {
        const title = document.createElement('h3');
        title.textContent = "Uložené mapy:";
        savedMapsList.append(title);

        savedMaps.forEach(map => {
            savedMapsList.append(createMapListItem(map));
        });
    } else {
        const message = document.createElement('p');
        message.textContent = "Žádné uložené mapy.";
        savedMapsList.append(message);
    }
}

function createMapListItem(map){
    const mapItemWrapper = document.createElement('div');

    const mapButton = document.createElement('button');
    mapButton.textContent = map.name;
    mapButton.classList.add('load-map-item');
    mapButton.addEventListener('click', () => loadMap(map));
    mapItemWrapper.append(mapButton)

    const removeMapBtn = document.createElement('button');
    removeMapBtn.innerText = 'X';
    removeMapBtn.classList.add('remove-btn');

    mapItemWrapper.append(removeMapBtn);

    removeMapBtn.addEventListener('click', () =>{
        removeMapItemList(map.id);
        displaySavedMaps();
    });


    return mapItemWrapper;
}

function removeMapItemList(id){
    const savedMapsJSON = localStorage.getItem("savedMaps");
    const savedMaps = savedMapsJSON ? JSON.parse(savedMapsJSON) : [];

    const updateMaps = savedMaps.filter(m => m.id !== id)

    localStorage.setItem("savedMaps", JSON.stringify(updateMaps))

}



function initBtnsFunctionality(){
    newMapBtn.addEventListener('click', () => {
        startNewMap();
        hideScreen(mainMenuScreen);
        showScreen(editorScreen);
    });

    exitBtn.addEventListener('click', () => {
        hideScreen(editorScreen);
        showScreen(mainMenuScreen);
        displaySavedMaps();
    });

    resetBtn.addEventListener('click', () =>{
       startNewMap();
    });

}


function initSaveFunctionality(){
    saveBtn.addEventListener('click', () => {
        const mapName = mapNameInput.value.trim();
        if (!mapName) {
            alert("Zadejte jméno mapy.");
            return;
        }

        let savedMapsJSON = localStorage.getItem("savedMaps");
        let savedMaps = savedMapsJSON ? JSON.parse(savedMapsJSON) : [];

        let mapIdToSave = currentMapId;

        if (!mapIdToSave) {
            mapIdToSave = generateUUID();
        }

        const mapObject = createMapObject(mapIdToSave, mapName, mapState);

        const existingIndex = savedMaps.findIndex(m => m.id === mapIdToSave);

        if (existingIndex >= 0) {
            savedMaps[existingIndex] = mapObject;
        } else {
            savedMaps.push(mapObject);
        }

        localStorage.setItem("savedMaps", JSON.stringify(savedMaps));
        alert(`Mapa "${mapName}" byla uložena!`);
        currentMapId = mapIdToSave;
        displaySavedMaps();
    });
}

function initEvents(){
    initSaveFunctionality()
    initBtnsFunctionality()
}

function createMapObject(id, name, state) {
    return {
        id: id,
        name: name,
        state: state.slice(),
    };
}

function generateUUID() {
    return crypto.randomUUID();
}


