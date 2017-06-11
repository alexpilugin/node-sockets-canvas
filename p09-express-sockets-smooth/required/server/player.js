const Player = function (id, startX=0, startY=0) {
    var self = {
        id: id,
        x: startX,
        y: startY,
        dx: 0,
        dy: 0,
        speed: 2,
        color: "black"
    }
    self.update = function () {
        self.x += self.dx;
        self.y += self.dy;
    }
    self.setColor = function (c) {
        self.color = c;
    }
    self.dx = parseFloat(parseFloat(Math.random(self.speed) * (Math.random() < 0.5 ? -1 : 1)).toFixed(2));
    self.dy = parseFloat(parseFloat(Math.random(self.speed) * (Math.random() < 0.5 ? -1 : 1)).toFixed(2));

    return self;
}

exports.Player = Player;