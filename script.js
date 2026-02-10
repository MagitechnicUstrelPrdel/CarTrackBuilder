const tileTypes = ["tile-grass", "tile-road", "tile-water"]
const map = generateMap();
document.body.append(map);

initEvents();
function generateMap(){

    const map = document.createElement('div');
    map.classList.add('map-grid');

    for (i = 0; i < 400; i++){
        map.append(generateTile());
    }
    return map;
}

function generateTile(){

    const tile = document.createElement('div');

    tile.classList.add('tile');
    tile.classList.add(tileTypes[0]);

    return tile;
}

function changeTileType(tile){

    let currentClass = tileTypes.find(cls =>
        tile.classList.contains(cls)
    );

    let nextClass = tileTypes[0];

    if(currentClass){
        let nextIndex = (tileTypes.indexOf(currentClass) + 1) % tileTypes.length
        nextClass = tileTypes[nextIndex];
        tile.classList.remove(currentClass);
    }
    console.log(nextClass);

    tile.classList.add(nextClass);
}

function initEvents(){
    const mapTiles= document.querySelectorAll('.tile');

    mapTiles.forEach(tile => {
        tile.addEventListener('click', () =>{
            changeTileType(tile);
        });
    });
}