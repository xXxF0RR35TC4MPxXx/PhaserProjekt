var ship; //statek gracza
var background; //tło planszy (to pod spodem)
var menuBackground;
var stars2; //tło planszy (gwiazdy na wierzchu, te szybciej latające)
var cursors; //strzałki na klawiaturze (potrzebne do inputa)
var fireButton; //przycisk odpowiedzialny za strzał (tu SPACJA)
var shipVelocity = 250; //prędkość poruszania się statku
var timeFromLastShot=0; //czas od ostatniego strzału
var shotDelta = 100; //różnica czasowa między strzałami
var canShoot = true; //zmienna po to, żeby jedno kliknięcie strzelało tylko jeden raz, a nie full
var startButton; //przycisk startu gry
var canStartGame = true;
var timeFromTextBlink = 0;
var textBlinkingDelta = 1000;
var pressEnterText;
var Enter;
var score = 0;
var bulletCount = 1;
var jeden, dwa, trzy;


//klasa pojedynczego pocisku
class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'playerBullet'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire (x, y)
    {
        
        this.body.reset(x, y);
        this.angle =0;
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);

        this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku
    }

    fireWBok (x, y, kierunek) //strzały w bok dla strzału potrójnego
    {
    
        this.body.reset(x, y);
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);

        if(kierunek==0) //strzał w lewo
        {
            this.angle = -33; //zmiana kąta nachylenia sprite'a o 33 stopnie w lewo
            this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku w pionie
            this.setVelocityX(-550); //ustawienie prędkości lotu pocisku w poziomie
        }
        if(kierunek==1) //strzał w prawo
        {
            this.angle = 33; //zmiana kąta nachylenia sprite'a o 33 stopnie w prawo
            this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku w pionie
            this.setVelocityX(+550); //ustawienie prędkości lotu pocisku w poziomie
        }
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -32) //kiedy pocisk wyleci poza planszę to ustaw na niewidoczny i nieaktywny
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
//klasa kolekcji pocisków gracza
class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 99,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }


    fireBullet (x, y)
    {
        timeFromLastShot = 0; //czas od ostatniego strzału = 0

        //jeżeli gracz ma pojedynczy laser
        if(bulletCount == 1){
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
            }}

        //jeżeli gracz ma podwójny laser
        if(bulletCount == 2){
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x-20, y); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x+20, y); //to go wystrzel w określonym miejscu
            }
        }

        //jeżeli gracz ma potrójny laser
        if(bulletCount == 3){
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fireWBok(x+20, y, 1); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false);
            if (bullet) //jeśli taki istnieje
            {
                bullet.fireWBok(x-20, y, 0); //to go wystrzel w określonym miejscu
            }
        }    
    }
}

//scena rozgrywki
class GamePlay extends Phaser.Scene 
{
    constructor ()
    {
        super({key: 'GamePlay',});

        this.bullets;
        this.ship;
    }

    preload(){
        console.log("GamePlay preload()")
        this.load.image('background1', 'assets/8bitbackground.png')
        this.load.image('background2', 'assets/8bitbackground2.png')
        this.load.image('alien1', 'assets/alien1.png')
        this.load.image('playerBullet', 'assets/playerBullet.png')
        //this.load.image('playerBulletWBok', 'assets/playerBulletWBok.png')
        this.load.image('enemyBullet', 'assets/enemyBullet.png')
        this.load.image('playerShip', 'assets/ship.png')
        //this.load.spritesheet()
    }

    create() {
        //dodanie sprite'ów tła i statków
        background=this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background1');
        stars2 = this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background2').setScale(0.75)
        ship = this.physics.add.sprite(config.width/2, config.height/1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);
        
        //przypisanie przycisków
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        jeden = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        dwa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        trzy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

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
        

        //DEBUG DO TESTOWANIA POCISKÓW

        //if(jeden.isDown){bulletCount=1}
        //if(dwa.isDown){bulletCount=2}
        //if(trzy.isDown){bulletCount=3}
        //console.log("timeFromLastShot = " + timeFromLastShot)
        //console.log("shotDelta = " + shotDelta)

        if (fireButton.isDown && timeFromLastShot >= shotDelta && canShoot) {
            this.bullets.fireBullet(ship.x, ship.y*0.95);
            canShoot = false;
        }
        if(!fireButton.isDown){ canShoot = true}
    }
}

//scena głównego menu
class MainMenu extends Phaser.Scene 
{
    constructor ()
    {
        super({key: 'MainMenu',});
    }
    
    preload(){
        
        this.load.image('titleFont', 'assets/titleFont.png') //plik z teksturą napisu
        this.load.image('background1', 'assets/8bitbackground.png') //plik z teksturą tła
    }


    create() {
        const fontConfig = {
            image: 'titleFont', //nazwa fontu
            width: 47, //szerokość pojedynczego znaku w foncie
            height: 49, //wysokość pojedynczego znaku w foncie
            chars: Phaser.GameObjects.RetroFont.TEXT_SET3, //określenie typu font_setu (do znalezienia w dokumentacji)
            charsPerRow: 6, //ilość znaków w jednym rzędzie w pliku
            spacing: { x: 1, y: 1 } // określenie odstępu między początkiem a końcem dwóch znaków
        };

        menuBackground=this.add.tileSprite(game.config.width/2, game.config.height/2, 0, 0, 'background1'); //dodanie tła
        
        //wczytanie retro-fontu do ekranu startowego
        var newFont = new FontFace("PressStart2P", `url(${"assets/PressStart2P.ttf"})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });

        //dodanie napisu z tytułem gry z tym fajnym fontem z pliku .png
        this.cache.bitmapFont.add('titleFont', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
        const text = this.add.bitmapText(game.config.width/2, game.config.height/5, 'titleFont', 'SPACE SHOOTER').setScale(1.25);
        text.setOrigin(0.5);

        //określenie przycisku startu gry
        startButton = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        //tekst mówiący, żeby wcisnąć "Enter", żeby zacząć grę. Niestety musiałem rozbić na dwa teksty, gdzie drugi z nich ma zmieniony styl. Wytłumaczenie niżej.
        pressEnterText = this.add.text(game.config.width/2, game.config.height/2, 'Press       To Play!', { font: "30px PressStart2P"}).setOrigin(0.5);;
        Enter = this.add.text(game.config.width/2, game.config.height/2, '      ENTER         ', { font: "30px PressStart2P"}).setOrigin(0.5);;
 
        Enter.setTint(0xff0000) //ustawienie koloru tekstu Enter
        
        //w Phaser 2 można było zmienić kolor wybranych liter za pomocą prostej funkcji, ale oczywiście w Phaser 3 zabrali tą opcję...
        //pressEnterText.addColor('#ff0000', 6);
        //pressEnterText.addColor('#ffffff', 10);
    }
    
    
    update(time, delta) {
        timeFromTextBlink += delta;
        menuBackground.tilePositionY -= 0.1;
        if(timeFromTextBlink >= textBlinkingDelta){
            timeFromTextBlink = 0;
            Enter.setVisible(!Enter.visible);
            pressEnterText.setVisible(!pressEnterText.visible);
        }
        if(startButton.isDown && canStartGame){
            canStartGame = false;
            game.scene.start('GamePlay');
        }
    }
}

var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    physics: {
        default: 'arcade',
        },
    backgroundColor: "48a",
    pixelArt: true,
    scene: [MainMenu, GamePlay]
    }
var game = new Phaser.Game(config);

