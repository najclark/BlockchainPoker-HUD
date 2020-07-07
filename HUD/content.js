var players = []

var past_action = [];
var hand_actions = [];

let loop = setInterval(function(){

    var ctx = setupCanvas();

    players = populatePlayers();

    if(Game.isPreFlop()) {

        var actions = document.getElementsByClassName("md-body-2 ng-binding ng-scope");
        for (var action of actions) {
            if(!searchForElement(past_action, action)) {
                
                past_action.push(action);
                var name_element = action.parentNode.querySelector(".logged-player");
                //not the review hand button
                if(name_element != null) {

                    var name = name_element.innerText;
                    var msg = action.innerText;
                    hand_actions.push(`${name} ${msg.trim()}`);

                    if(msg.includes("fold")) {

                        var player = getPlayerByName(players, name);
                        player.dealtHand();

                    } else if (msg.includes("bet")) {

                        var msg_array = msg.split(" ");
                        var bet_idx = msg_array.indexOf("bet");
                        var amount = formatChips(msg_array[bet_idx + 1]);

                        var player = getPlayerByName(players, name);
                        player.lost(amount);

                    } else if (msg.includes("call")) {

                        var msg_array = msg.split(" ");
                        var bet_idx = msg_array.indexOf("call");
                        var amount = formatChips(msg_array[bet_idx + 1]);

                        var player = getPlayerByName(players, name);
                        player.lost(amount);

                    } else if (msg.includes("won")) {
                        
                        console.log(hand_actions);
                        hand_actions = [];

                    }
                }
            }

        }

    }


    // chrome.storage.sync.get(['utg_orc_range'], function(result) {
    //     if(typeof result.utg_orc_range !== "undefined") {

    //     }
    // });
}, 4000);

function getPlayerByName(players, name) {
    for(var player of players) {
        if(player.getName() === name) {
            return player;
        }
    }
    return null;
}

function searchForElement(array, element) {
    for(var el of array) {
        if(el.isSameNode(element)) {
            return true;
        }
    }
    return false;
}

function populatePlayers() {
    var players = [];

    var player_boxes = document.querySelectorAll(".seat");
    for (var player_box of player_boxes) {
        var info_card = player_box.querySelector("md-card");

        if (info_card != null) { //player_box has a player sitting
            var name = info_card.getAttribute("name");
            var player = null;

            for (p of players) {
                if (p.getName() === name) {
                    player = p;
                }
            }

            if (player == null) {
                //TODO: get starting stack
                player = new PlayerDetails(name, 0, getPosition(player_box));
                players.push(player);
            }
        }
    }
    return players;
}

function setupCanvas() {
    var gameBody = document.querySelectorAll(".main-container")[0];

    var canvas = document.querySelectorAll(".blockchain-hud")[0];
    if (typeof canvas == "undefined") {
        canvas = document.createElement("canvas");
        canvas.classList.add("blockchain-hud");
        canvas.setAttribute("width", gameBody.clientWidth);
        canvas.setAttribute("height", gameBody.clientHeight);
        canvas.style.position = "fixed";
        canvas.style.left = `${gameBody.offsetLeft}px`;
        canvas.style.zIndex = 10;
        canvas.style.pointerEvents = "none";
        gameBody.parentNode.append(canvas);

    } else if (canvas.clientWidth != gameBody.clientWidth ||
        canvas.clientHeight != gameBody.clientHeight ||
        canvas.style.left != `${gameBody.offsetLeft}px`) {
        canvas.setAttribute("width", gameBody.clientWidth);
        canvas.setAttribute("height", gameBody.clientHeight);
        canvas.style.left = `${gameBody.offsetLeft}px`;
    }

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.font = "36px Arial";

    ctx.strokeText("Blockchain.poker HUD DEMO", canvas.width / 2, canvas.height / 2);

    return ctx;
}
