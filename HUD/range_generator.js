function generateRange(range, canvas) {
    var width = 280;
    chrome.storage.sync.get(['range_size'], function(result) {
        if(typeof result.range_size !== "undefined") {
            width = range_size;
        }
    });
    var cardRank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    var ctx = canvas.getContext("2d");
    var grid_size = width/14;
    ctx.moveTo(0,0);
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    var fullrange = expandRange(range.split(', '));
    // console.log(fullrange);
    for(var hand of fullrange) {
        highlightHand(hand);
    }

    var i;
    var offset = width/14;
    for(i = cardRank.length-1; i >= 0; i--) {
        ctx.font = "14px Arial";
        ctx.strokeText(cardRank[i], offset*1.5, grid_size/2);
        ctx.strokeText(cardRank[i], grid_size/2, offset*1.5);
        ctx.strokeRect(offset, offset, grid_size, grid_size);
        ctx.font = "9px Arial";
        ctx.strokeText(cardRank[i] + cardRank[i], offset+grid_size/2, offset+grid_size/2);
        for(let xoffset = offset+grid_size; xoffset < width; xoffset += grid_size) {
            ctx.strokeRect(xoffset, offset, grid_size, grid_size);
            ctx.strokeText(cardRank[i] + cardRank[cardRank.length - xoffset/grid_size] + 's', xoffset+grid_size/2, offset+grid_size/2);
        }
        for(let yoffset = offset+grid_size; yoffset < width; yoffset += grid_size) {
            ctx.strokeRect(offset, yoffset, grid_size, grid_size);
            ctx.strokeText(cardRank[i] + cardRank[cardRank.length - yoffset/grid_size] + 'o', offset+grid_size/2, yoffset+grid_size/2);
        }
        offset = offset + grid_size;
    }
    ctx.stroke();
    return canvas;

    function expandRange(range) {
        var fullrange = [];
        var i;
        for(i = 0; i < range.length; i++) {
            var hole1 = range[i].substring(0, 1);
            var hole2 = range[i].substring(1, 2);
            if(range[i].includes('s') || range[i].includes('o')) {
                var suitedness = (range[i].includes('s')) ? 's' : 'o';
                var baseIdx = cardRank.indexOf(hole2);
                for(let _ = 0; baseIdx < cardRank.indexOf(hole1); baseIdx++) {
                    fullrange.push(hole1 + cardRank[baseIdx] + suitedness);
                }
            } else {
                if(range[i].includes('+')) {
                    var baseIdx = cardRank.indexOf(hole1)
                    for(let _ = 0; baseIdx < cardRank.length; baseIdx++) {
                        fullrange.push(cardRank[baseIdx] + cardRank[baseIdx]);
                    }
                } else {
                    fullrange.push(range[i]);
                }
            }
        }
        return fullrange;
    }

    function highlightHand(hand) {
        ctx.fillStyle = '#2ecc71';
        ctx.globalAlpha = 0.5;
        var hole1 = hand.substring(0, 1);
        var hole2 = hand.substring(1, 2);
        var x = 0;
        var y = 0;
        if(hand.includes('s')) {
            x = (cardRank.length - cardRank.indexOf(hole2) - 1)* grid_size + grid_size
            y = (cardRank.length - cardRank.indexOf(hole1) - 1)* grid_size + grid_size
        } else if(hand.includes('o')) {
            x = (cardRank.length - cardRank.indexOf(hole1) - 1)* grid_size + grid_size
            y = (cardRank.length - cardRank.indexOf(hole2) - 1)* grid_size + grid_size
        } else {
            x = (cardRank.length - cardRank.indexOf(hole1) - 1)* grid_size + grid_size
            y = (cardRank.length - cardRank.indexOf(hole2) - 1)* grid_size + grid_size
        }
        ctx.fillRect(x, y, grid_size, grid_size);
        ctx.globalAlpha = 1.0;
        // console.log(`${hand}: (${x}, ${y})`);
    }
}
