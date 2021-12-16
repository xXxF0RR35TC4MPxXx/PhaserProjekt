var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    backgroundColor: "48a",
    scene: {
        preload: preload,
        create: create,
        update: update
        },
    physics: {
        default: 'arcade',
        },
    };

var game = new Phaser.Game(config);

function preload(){
    this.load.image('background1', 'assets/8bitbackground.png')
    this.load.image('background2', 'assets/8bitbackground2.png')
    this.load.image('alien1', 'assets/alien1.png')
    this.load.image('laserBlue', 'assets/laserBlue05.png')
    this.load.image('laserRed', 'assets/laserRed05.png')
    this.load.image('playerShip', 'assets/ship.png')
    //this.load.spritesheet()
}

var ship;
var background;
var stars2;
var cursors;
var shipVelocity = 250;
function create() {
    background=this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background1');
    stars2 = this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background2').setScale(0.75);;
    ship = this.physics.add.sprite(config.width/2, config.height/1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);
    cursors = this.input.keyboard.createCursorKeys();    
}


function  update() {
    background.tilePositionY -= 0.1;
    stars2.tilePositionY -= 0.4;
    ship.body.velocity.x=0;
    if(cursors.left.isDown){
        ship.body.velocity.x = -shipVelocity;
    }else if(cursors.right.isDown){
        ship.body.velocity.x = shipVelocity;
    }
}