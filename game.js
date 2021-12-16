var ship; //statek gracza
var background; //tło planszy (to pod spodem)
var stars2; //tło planszy (gwiazdy na wierzchu, te szybciej latające)
var cursors; //strzałki na klawiaturze (potrzebne do inputa)
var fireButton; //przycisk odpowiedzialny za strzał (tu SPACJA)
var shipVelocity = 250; //prędkość poruszania się statku
var timeFromLastShot=0; //czas od ostatniego strzału
var shotDelta = 100; //różnica czasowa między strzałami
var canShoot = true;
class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'laserBlue'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire (x, y)
    {
        
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x, y)
    {
        console.log('szczelom')
        timeFromLastShot = 0;
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y);
        }
    }
}

class GamePlay extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.bullets;
        this.ship;
    }

    preload(){
        this.load.image('background1', 'assets/8bitbackground.png')
        this.load.image('background2', 'assets/8bitbackground2.png')
        this.load.image('alien1', 'assets/alien1.png')
        this.load.image('laserBlue', 'assets/laserBlue05.png')
        this.load.image('laserRed', 'assets/laserRed05.png')
        this.load.image('playerShip', 'assets/ship.png')
        //this.load.spritesheet()
    }

    create() {
        background=this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background1');
        stars2 = this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background2').setScale(0.75)
        ship = this.physics.add.sprite(config.width/2, config.height/1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);
        
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        this.bullets = new Bullets(this);
    }
    
    
    update(time, delta) {
        timeFromLastShot += delta;
        background.tilePositionY -= 0.1;
        stars2.tilePositionY -= 0.4;
        ship.body.velocity.x=0;
        if(cursors.left.isDown){
            ship.body.velocity.x = -shipVelocity;
        }else if(cursors.right.isDown){
            ship.body.velocity.x = shipVelocity;
        }
        //console.log("timeFromLastShot = " + timeFromLastShot)
        //console.log("shotDelta = " + shotDelta)
        if (fireButton.isDown && timeFromLastShot >= shotDelta && canShoot) {
            this.bullets.fireBullet(ship.x, ship.y*0.95);
            canShoot = false;
        }
        if(!fireButton.isDown){ canShoot = true}
    }
}


var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    backgroundColor: "48a",
    
    physics: {
        default: 'arcade',
        },
        
    scene: GamePlay
    }
var game = new Phaser.Game(config);

