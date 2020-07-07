var loop = 0

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request.type)
    if (request.type === "startBot") {
        letsGo()
        loop = setInterval(function(){
            if (isMaster()) {
                // makeNewTable()
                sitDownIfPossible()
                sitInIfPossible()
                if(yourTurn()) {
                    if (!isFlop()) {
                        console.log("Master Call PreFlop")
                        call()
                    } else {
                        console.log("Master Bet Min PostFlop")
                        bet()
                    }
                }
            } else {
                gotIt()
                sitInIfPossible()
                if(getInPlay() < 20) {
                    clickFaucetIfPossible()
                    stand()
                }
                if(getBalance() > 50) {
                    sitDownIfPossible()
                }
                // topUp()
                if(yourTurn()) {
                    if (!isFlop()) {
                        if(isShortStack()) {
                            console.log("Cow bet PreFlop")
                            betSimplified(getInPlay()-10)
                        } else {
                            console.log("Cow call PreFlop")
                            call()
                        }
                    } else {
                        console.log("Cow fold PostFlop")
                        fold(0)
                        clearInterval(loop)
                        newUser()
                        setTimeout(function() {
                            chrome.tabs.sendMessage(tab.id, {type: "startBot"});
                        }, 10000)
                    }
                }
            }
        }, 4000);
    } else if (request.type === "stopBot") {
        clearInterval(loop)
    } else if (request.type === "test") {
        betSimplified(getInPlay()-10)
    }
  }
);

//STATUS: Working
function makeNewTable() {
    stand()
    var newRoomName = Math.random().toString(36).substring(2, 15)
    // var chat = document.getElementsByClassName("ng-pristine ng-valid md-input ng-empty ng-valid-maxlength ng-touched")[0]
    // chat.value = newRoomName
    var chats = document.getElementsByTagName('textarea');
    for(var i=0; i< chats.length; i++) {
        if (chats[i].getAttribute('ng-model') === "chat") {
            chats[i].click()
            chats[i].value = newRoomName
        }
    }
    //send chat
    document.getElementsByClassName("md-icon-button chat-button md-button md-dance-theme md-ink-ripple")[0].click()
    console.log('sending chat')
    //open lobby
    document.getElementsByClassName("md-default hide-xs md-button ng-scope md-dance-theme md-ink-ripple")[0].click()
    console.log('opening lobby')
    setTimeout(function(){
        //click create table
        document.getElementsByClassName("md-primary md-raised md-button md-dance-theme md-ink-ripple layout-align-center-center layout-row")[0].click()
        console.log('making a new table')
        setTimeout(function(){
            //input newRoomName into Room Name field
            // document.getElementsByClassName("ng-valid md-input ng-valid-maxlength ng-dirty ng-touched ng-empty")[0].click()
            var all_input = document.getElementsByTagName("input")
            for(var i=0; i< all_input.length; i++) {
                if (all_input[i].getAttribute('name') === "Table Name") {
                    all_input[i].click()
                    all_input[i].value = newRoomName
                }
            }
            console.log('entering new name')
            //click private checkbox
            var all_check = document.getElementsByTagName("md-checkbox")
            for(var i=0; i< all_check.length; i++) {
                if (all_check[i].getAttribute('ng-model') === "isPrivate") {
                    all_check[i].click()
                }
            }
            console.log('clicking private checkbox')
            setTimeout(function(){
                //input universal password into password input
                all_input = document.getElementsByTagName("input")
                for(var i=0; i< all_input.length; i++) {
                    if (all_input[i].getAttribute('name') === "Tournament Password") {
                        all_input[i].click()
                        all_input[i].value = "nick"
                    }
                }
                console.log('entering password')
                setTimeout(function(){
                    //click create new room
                    document.getElementsByClassName("md-primary md-raised md-button md-dance-theme md-ink-ripple")[0].click()
                    console.log('creating the new room')
                }, 1000);
            }, 1000);
        }, 5000);
    }, 5000);

}

//STATUS: Working
function newUser() {
    stand()
    searchClickIf('md-icon', 'md-svg-icon', 'navigation:menu')

    setTimeout(function() {
        searchClickIf('button', 'ng-click', 'switchUser()')

        setTimeout(function() {
            searchClickIf('button', 'ng-click', 'newUser()')

            setTimeout(function() {
                defaultCowSettings()
            }, 5000)
        }, 1000)
    }, 500)
}

//STATUS: Working
function searchClickIf(tagname, attribute, condition) {
    var options = document.getElementsByTagName(tagname);
    for(var i=0; i< options.length; i++) {
        if (options[i].getAttribute(attribute) === condition) {
            options[i].click()
            return true
        }
    }
    return false
}

//STATUS: Working
function defaultCowSettings() {
    searchClickIf('md-icon', 'md-svg-icon', 'navigation:menu')

    setTimeout(function() {
        searchClickIf('button', 'ng-click', 'showProfile( you.name )')

        setTimeout(function() {
            searchClickIf('button', 'ng-click', 'showSettings()')

            setTimeout(function() {
                searchClickIf('md-select', 'ng-model', 'betInterface')

                setTimeout(function() {
                    searchClickIf('md-option', 'value', 'SIMPLIFIED')

                    setTimeout(function() {
                        searchClickIf('button', 'ng-click', 'closeDialog()')
                    }, 500)
                }, 500)
            }, 500)
        }, 500)
    }, 500)
}

//STATUS: Working
function isShortStack() {
    //stack md-caption ng-binding
    var stacks = document.getElementsByClassName("stack md-caption ng-binding");
    var smallest = 1000
    var i;
    for (i = 0; i < stacks.length; i++) {
        if (parseInt(stacks[i].innerHTML.split('<')[0]) < smallest) {
            smallest = parseInt(stacks[i].innerHTML.split('<')[0])
        }
    }
    //account for 1/2 blinds
    return getInPlay() - smallest < 3
}

//STATUS: Working
function letsGo() {
    var element = document.getElementsByClassName("md-primary md-raised md-button md-dance-theme md-ink-ripple");
    if(element.length > 0) {
        element[0].click()
    }
}

//STATUS: Working
function gotIt(){
    var element = document.getElementsByClassName("ng-scope");
    var i;
    for (i = 0; i < element.length; i++) {
        if (element[i].innerHTML.toString() === "GOT IT") {
            console.log('found GOT IT ' + i.toString() + element[i].innerHTML.toString())
            element[i].click()
            return 0
        }
    }
}

//STATUS: Working
function isMaster() {
    sitDownIfPossible()
    var element = document.getElementsByClassName("player ng-scope _md md-dance-theme flex");
    var i;
    for (i = 0; i < element.length; i++) {
        if (element[i].getAttribute('name').toString() === "Slave Master") {
            if (element[i].getAttribute('is-you').toString() === "true") {
                return true
            } else {
                return false
            }
        }
    }
    return false
}

//STATUS: Working
function clickFaucetIfPossible() {
    var element = document.getElementsByClassName("md-icon-button animated infinite pulse faucet md-button ng-scope md-dance-theme md-ink-ripple");
    if(element.length > 0) {
        element[0].click()
    }
}

//STATUS: Working
function topUp() {
    var element = document.getElementsByClassName("md-raised md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(element.length > 0) {
        element[0].click()
    }
}

//STATUS: Working
function stand() {
    var e1 = document.getElementsByClassName("md-accent md-fab md-mini md-raised seat-action hide-gt-xs md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(e1.length > 0) {
        e1[0].click()
        return 0
    }
    var element = document.getElementsByClassName("seat-action md-button ng-scope md-dance-theme md-ink-ripple hide-gt-xs layout-align-center-center layout-row");
    if(element.length > 0) {
        element[0].click()
        return 0
    }
}

//STATUS: Working
function sitInIfPossible() {
    // ngscopeClick("Sit In")
    var simplified = document.getElementsByClassName("md-fab md-raised sitin-button md-accent md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(simplified.length > 0) {
        simplified[0].click()
        return 0
    }
    var traditional = document.getElementsByClassName("md-raised sitin-button md-accent md-button md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(traditional.length > 0) {
        traditional[0].click()
        return 0
    }
}

//STATUS: Working
function sitDownIfPossible() {
    var element = document.getElementsByClassName("md-fab seat-button md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(element.length > 0) {
        element[0].click()
    }
}

function bet() {
    var element = document.getElementsByClassName("md-fab md-raised md-mini bet-modifier md-fab-action-item md-button ng-scope md-dance-theme md-ink-ripple");
    if(element.length > 0) {
        element[0].click()
        raise()
    }
}

//STATUS: Not Working
function betSimplified(size) {
    //click plus button size/2 times
    var i = 0;
    while (i < size/2) {
        searchClickIf('button', 'ng-click', 'incrementBet()')
        i++
    }
}

//STATUS: Not Working
function getStack() {
    var element = document.getElementsByClassName("stack md-caption ng-binding");
    if(element.length > 0) {
        return parseInt(element[0].innerHTML.substring(0,2))
    }
}

//STATUS: Working
function getBalance() {
    var element = document.getElementsByClassName("balance-amount ng-binding");
    if(element.length > 0) {
        return parseInt(element[0].innerHTML)
    }
}

//STATUS: Working
function getInPlay() {
    var element = document.getElementsByClassName("in-play-amount ng-binding");
    if(element.length > 0) {
        return parseInt(element[0].innerHTML)
    }
    return 0
}

//STATUS: Working
function yourTurn() {
    var element = document.getElementsByClassName("actions ng-scope layout-align-xs-space-between-end layout-align-gt-xs-center-end layout-row flex-xs-100");
    if(element.length > 0) {
        return true;
    }
    return false;
}

//STATUS: Working
function raise() {
    var element = document.getElementsByClassName("md-raised action-button md-button md-dance-theme md-ink-ripple md-accent layout-align-center-center layout-row");
    if(element.length > 0) {
        element[0].click()
    }
}

//STATUS: Working
function fold(iter) {
    //simplified
    var e1 = document.getElementsByClassName("md-fab md-raised action-button fold md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    e1[0].click()
    // ng-scope
    // var element = document.getElementsByClassName("ng-scope");
    // var i;
    // for (i = 0; i < element.length; i++) {
    //     if (element[i].innerHTML.toString() === "Fold") {
    //         console.log('found fold ' + i.toString() + "/" + element.length.toString())
    //         element[i].click()
    //         return 0
    //     }
    // }
    // console.log("Can't find fold " + element.length.toString() + "/" + element.length.toString() + " retrying " + (5-iter).toString() + " times.")
    // // e1[0].click()
    // if(5-iter > 0) {
    //     fold(iter + 1)
    // }
}

//STATUS: Working
function call() {
    //simplified
    var e1 = document.getElementsByClassName("md-fab md-raised action-button md-button md-dance-theme md-ink-ripple md-accent layout-align-center-center layout-row");
    if(e1.length > 0) {
        e1[0].click()
        return 0
    }
    //traditional
    var element = document.getElementsByClassName("md-raised action-button call md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
    if(element.length > 0) {
        element[0].click()
        return 0
    }
    //md-raised action-button call md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row
}

//STATUS: Working
function isFlop() {
    var element = document.getElementsByClassName("community ng-scope layout-align-center-center layout-row");
    if(element.length > 0) {
        if(element[0].getAttribute("round").toString() === "PREFLOP") {
            return false
        } else {
            return true
        }
    }
    return false
}

function ngscopeClick(match) {
    var element = document.getElementsByClassName("ng-scope");
    var i;
    for (i = 0; i < element.length; i++) {
        if (element[i].innerHTML.toString() === match) {
            element[i].click()
            return true
        }
    }
    return false
}
//md-raised action-button check md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row
// function check() {
//     var element = document.getElementsByClassName("md-raised action-button check md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row");
//     if(element.length > 0) {
//         element[0].click()
//     }
//     //md-raised action-button call md-button ng-scope md-dance-theme md-ink-ripple layout-align-center-center layout-row
// }
//call any
//md-raised md-button ng-scope md-dance-theme md-ink-ripple
