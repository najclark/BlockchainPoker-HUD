function generateDetails(canvas, player) {
    var width = canvas.offsetWidth;
    var height = canvas.offsetHeight;

    var ctx = canvas.getContext("2d");
    ctx.moveTo(0, 0);
    // ctx.textAlign = "center";
    // ctx.textBaseline = 'middle';
    ctx.font = "14px Arial";
    ctx.strokeText(player.getName(), 0, 0);
    ctx.stroke();
    return canvas;
}
