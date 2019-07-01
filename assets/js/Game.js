'use strict'

function Game(canvas) {
  this.player = null;
  this.enemies = [];
  this.isGameOver = false;
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.onGameOver = null;
}

Game.prototype.startGame = function() {
  // Initialize player & enemies
  this.player = new Player(this.canvas);
  // al emprar l'arrow function ens petem el conflicte de contextos que es genera en una f() convencional ---> perquè les arrow f() no creen cap context nou d'execució, ho executen en el mateix Stack (== abans no trobava la referència del this (era undefined) perquè de fet no s'ha executat, amb arrow f() no va a cercar aquest this en un altre context)
  var loop = () => { 
    if (Math.random() > 0.97) {
      var randomY = Math.random() * this.canvas.height - 10;
      var newEnemy = new Enemy(this.canvas, randomY);
      this.enemies.push(newEnemy);
    }

    this.update();
    this.clear();
    this.draw();
    this.checkCollisions();
    if (!this.isGameOver) {
      requestAnimationFrame(loop);
    } else {
      this.onGameOver();
    }
  };
  loop();
}

Game.prototype.update = function() {
  //console.log('ieepaa update is called');
  this.player.move();
  this.enemies.forEach(function(enemy) {
    enemy.move();
  })
};

Game.prototype.clear = function() {
  //console.log('ieeeeeeek clear is called');
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.draw = function() {
  //console.log('aaaaaarrrrg draw is called');
  this.player.draw();
  this.enemies.forEach(function(enemy) {
    enemy.draw();
  })
};

Game.prototype.checkCollisions = function() {
  this.enemies.forEach((enemy, index) => {
    var rightLeft = this.player.x + this.player.width >= enemy.x; //ca
    var leftRight = this.player.x <= enemy.x + enemy.width; // ac
    var bottomTop = this.player.y + this.player.height >= enemy.y; //db
    var topBottom = this.player.y <= enemy.y + enemy.height; // bd
    
    if (rightLeft && leftRight && bottomTop && topBottom) {
      this.enemies.splice(index, 1);
      this.player.lives --;
      if (this.player.lives === 0) {
        this.isGameOver = true;
      }
    }
  })
}

Game.prototype.gameOverCallback = function(callback) {
  this.onGameOver = callback;
}