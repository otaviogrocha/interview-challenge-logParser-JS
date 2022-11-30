const readline = require('readline')
const fs = require('fs')
const readable = fs.createReadStream('Quake.txt')

const rl = readline.createInterface({
    input: readable
})


parsedLog = []
currentGame = 1;

rl.on('line', (line) => {
    let spaceline = line.trimStart().split(' ')
    // console.log(spaceline[3])

    if (spaceline[1] == "InitGame:") {
        gameStart(currentGame);
        console.log(`O jogo ${currentGame} iniciou.`)
    }
    if (spaceline[1] == "ShutdownGame:") {
        currentGame++;
        shutDown();
        console.log('O jogo acabou.')
    }
    if (spaceline[1] == "ClientUserinfoChanged:") {
        for (let index = 0; index < parsedLog[currentGame].status.players.length; index++) {
            if (parsedLog[currentGame].status.players[index].id == spaceline[2]) {
                updatePlayer(currentGame, [spaceline [3], spaceline [4], spaceline [5]], index)
                return;
            }
        }

        // updatePlayer(currentGame, spaceline[2], [spaceline[3], spaceline[4], spaceline[5]]);
        addPlayer(currentGame, spaceline[2], [spaceline[3], spaceline[4], spaceline[5]]);

    }
    if (spaceline[1] == "Kill:") {
        countKill(currentGame, parseInt(spaceline[2]), spaceline[3])
    }
})


function gameStart(id) {
    parsedLog[id] = {
        "game": id,
        "status": {
            "total_kills": 0,
            "players": []
        }
    }
}



function addPlayer(id, idPlayer, namePlayer) {
    parsedLog[id].status.players.push({
        "id": parseInt(idPlayer),
        "nome": formatNamePlayer(namePlayer[0], namePlayer[1], namePlayer[2]),
        "kills": 0,
        "oldnames": []
    })
}


function updatePlayer(id, namePlayer, indexPlayer) {
    let namePlayerFormatted = formatNamePlayer(namePlayer[0], namePlayer[1], namePlayer[2]);

    if (namePlayerFormatted != parsedLog[id].status.players[indexPlayer].nome) {
        parsedLog[id].status.players[indexPlayer].oldnames.push(parsedLog[id].status.players[indexPlayer].nome);
        parsedLog[id].status.players[indexPlayer].nome = namePlayerFormatted;
    }
}



// function updatePlayer(id, idPlayer, namePlayer) {

//     let nameFormatted = formatNamePlayer(namePlayer[0], namePlayer[1], namePlayer[2]);

//     for (let index = 0; index < parsedLog[id].status.players.length; index++) {
//         if (parsedLog[id].status.players[index].id == idPlayer) {
//             if (nameFormatted != parsedLog[id].status.players[index].nome) {
//                 parsedLog[id].status.players[index].oldnames.push(parsedLog[id].status.players[index].nome);
//                 parsedLog[id].status.players[index].nome = nameFormatted;
//             }

//         }
//     }
// }





function formatNamePlayer(string, string1, string2 = "") {
    if (string2 != "") {
        return `${string.substring(2)} ${string1} ${string2.substring(0, string2.indexOf('\\', 0))}`;
    }
    else if (string1 != "" && string1 != undefined) {
        return `${string.substring(2)} ${string1?.substring(0, string1.indexOf('\\', 2))}`;
    }
    else {
        return string.substring(2, string.indexOf('\\', 2));
    }
}

function countKill(id, Killer, Killed) {

    let killWorld = parseInt(Killer)
    if (Killer == 1022) killWorld = true
    else killWorld = false

    for (let index = 0; index < parsedLog[id].status.players.length; index++) {
        if (killWorld) {
            if (parsedLog[id].status.players[index].id == parseInt(Killed)) {
                if (killWorld) {
                    parsedLog[id].status.players[index].kills--;
                } else {
                    parsedLog[id].status.players[index].kills++;
                }
                parsedLog[id].status.total_kills++;
                return;
            }
        } else {
            if (parsedLog[id].status.players[index].id == parseInt(Killer)) {
                if (killWorld) {
                    parsedLog[id].status.players[index].kills--;
                } else {
                    parsedLog[id].status.players[index].kills++;
                }
                parsedLog[id].status.total_kills++;
                return;
            }
        }
    }
}



function shutDown() {
    fs.truncate('parsedQuake.json', 0, () => { });
    fs.appendFile('parsedQuake.json', JSON.stringify(parsedLog, null, 2), (err) => {
        if (err) {
            throw err;
        }
    })
}














