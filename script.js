const tileTypes = ["tile-grass", "tile-road", "tile-water"]
const mapState = Array(400).fill(tileTypes[0]);

const map = generateMap();

document.body.append(map);

initEvents();
function generateMap(){

    const map = document.createElement('div');
    map.classList.add('map-grid');

    for (let i = 0; i < mapState.length; i++){
        map.append(generateTile(mapState[i], i));
    }
    return map;
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
    console.log(nextClass);

    tile.classList.add(nextClass);
    mapState[index] = nextClass;
}

function initEvents(){
    const mapTiles= document.querySelectorAll('.tile');

    mapTiles.forEach(tile => {
        tile.addEventListener('click', () =>{
            const index = parseInt(tile.dataset.index);
            changeTileType(tile, index);
        });
    });
}