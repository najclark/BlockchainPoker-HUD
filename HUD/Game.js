class Game {
    static isPreFlop() {
        var element = document.getElementsByClassName("community ng-scope layout-align-center-center layout-row");
        if (element.length > 0) {
            if (element[0].getAttribute("round").toString() === "PREFLOP") {
                return true
            } else {
                return false
            }
        }
        return false
    }

    static getBB() {
        var spans = document.getElementsByTagName("span");
        for (var span of spans) {
            if (span.innerText.includes("blinds")) {
                return formatChips(span.innerText.split(" ")[2]);
            }
        }
    }
}

