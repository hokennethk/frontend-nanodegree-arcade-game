// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Initialize Enemy Location
    // start from left side of screen (1-2 cells before canvas)
    this.x = -101 * (Math.floor(Math.random()*2)+1);
    // random row btwn 1-3)
    this.y = (Math.floor(Math.random() * 3) + 2) * 83;
    // Set Enemy Speed
    this.speed = (Math.floor(Math.random() * 4) + 1) * 50;   // arbitary speed, play with this
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Update Enemy Location (moving on x-axis)
    this.x = Math.round((this.x + (this.speed * dt)));
    // reaching end, reset enemy with new speed
    if (this.x >= ctx.canvas.width) {
        var index = allEnemies.indexOf(this);
        allEnemies[index] = new Enemy();
    }
    // Handles Collision with Player
    if (this.y === player.y) {
        if (this.x-35 < player.x && this.x+55 > player.x) {
            player.reset();
        }
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // -20 offset for y (cosmetic purposes)
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-20);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Initialize location
    this.x = 2 * 101;
    this.y = 5 * 83;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(direction) {
    // direction argument is an array with x and y displacement
    if (direction != undefined) {

        this.x += direction[0];
        this.y += direction[1];
        // limit range to canvas area
        this.x = Math.max(0,Math.min(this.x, ctx.canvas.cellWidth*4));
        this.y = Math.max(0,Math.min(this.y, ctx.canvas.cellHeight*5));

        // handle reaching river
        if (this.y === 0) this.reset();

        // handle rock collisions (cannot move into rocks)
        rocks.forEach(function(rock) {
            if (rock.x === this.x && rock.y === this.y) {
                this.x -= direction[0];
                this.y -= direction[1];
            }
        }, this); // bind this to player object
    }
}

Player.prototype.render = function() {
    // -40 offset for y position
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-40);
}

Player.prototype.handleInput = function(input) {
    switch(input) {
        case 'left':
            this.update([-ctx.canvas.cellWidth, 0]);
            break;
        case 'right':
            this.update([ctx.canvas.cellWidth, 0]);
            break;
        case 'up':
            this.update([0, -ctx.canvas.cellHeight]);
            break;
        case 'down':
            this.update([0, ctx.canvas.cellHeight]);
            break;
        default:
            break;
    }
}

// reset player
Player.prototype.reset = function() {
    player = new Player();
}

// Rock object: Player cannot walk into rock object
var Rock = function() {
    this.x = Math.floor(Math.random()*5) * 101;
    this.y = 83;
    this.sprite = 'images/Rock.png';
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-40);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place two rocks in last grass row
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()]
var player = new Player();
var rocks = [new Rock(), new Rock()]

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
