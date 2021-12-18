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
var canStartGame = true; //czy można zacząć grę
var timeFromTextBlink = 0; //czas od ostatniego "mrygnięcia" tekstu na ekranie startowym
var textBlinkingDelta = 1000; //co jaki czas ma mrygać tekst na ekranie startowym
var pressEnterText; //mrygający tekst na ekranie startowym
var Enter; //Enter na klawiaturze
var score = 0; //wynik gracza
var lives = 2; //ilość żyć gracza
var level = 1; //numer planszy
var playerLaserType = 3; //typ lasera gracza
var jeden, dwa, trzy; //tylko do debugowania, zmiana typu lasera pod przyciskami '1', '2', '3' na klawiaturze.
var enemies
var bullets
var scoreText 
var bonusses
//klasa pojedynczego pocisku
class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'playerBullet'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire (x, y)
    {
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku
        this.angle =0;
    }
    

    fireWBok (x, y, kierunek) //strzały w bok dla strzału potrójnego
    {
    
        this.body.reset(x, y);
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.setEnable(true)
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
        if(playerLaserType == 1){
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
            }}

        //jeżeli gracz ma podwójny laser
        if(playerLaserType == 2){
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
        if(playerLaserType == 3){
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

class Bonusses extends Phaser.Physics.Arcade.Group{
    constructor (scene)
    {
        super(scene.physics.world, scene);
        this.createMultiple({
            frameQuantity: 15,
            key: 'bonus',
            active: false,
            visible: false,
            classType: Bonus
        });
    }
    dropBonus (x, y, type)
    {
        
        let bonus = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
        
        if (bonus) //jeśli taki istnieje
        {
            
            bonus.type = type;
            if(bonus.type==1){
                bonus.setTexture('singleLaserPowerUp')
            }
            if(bonus.type==2){
                bonus.setTexture('doubleLaserPowerUp')
            }
            if(bonus.type==3){
                bonus.setTexture('tripleLaserPowerUp')
            }
            if(bonus.type==4){
                bonus.setTexture('extraAmmo')
                console.log("Zebrano extraAmmo")
            }
            if(bonus.type==5){
                bonus.setTexture('extraSpeed')
                console.log("Zebrano extraSpeed")
            }
            if(bonus.type==6){
                bonus.setTexture('extraLife')
            }
            bonus.drop(x, y); //to go wystrzel w określonym miejscu
        }  
    }
}

class Bonus extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
            super(scene, x, y, 'singleLaserPowerUp');
    }

    drop(x, y)
    {
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(100); //ustawienie prędkości lotu pocisku
        this.angle =0;
    }
    
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y >= 932) //kiedy pocisk wyleci poza planszę to ustaw na niewidoczny i nieaktywny
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

var livesText2
var powerup
//scena rozgrywki
class GamePlay extends Phaser.Scene 
{
    constructor ()
    {
        super({key: 'GamePlay',});

        this.bullets;
        this.ship;
    }

    //wczytanie tekstur
    preload(){
        //console.log("GamePlay preload()")
        this.load.image('background1', 'assets/8bitbackground.png')             //plik z teksturą tła pod spodem
        this.load.image('background2', 'assets/8bitbackground2.png')            //plik z teksturą tła na wierzchu (dwa tła dla efektu paralaksy)

        this.load.image('alien1', 'assets/alien1.png')                          //plik z teksturą statku przeciwnika
        this.load.image('alien2', 'assets/alien2.png')                          //plik z teksturą statku przeciwnika
        this.load.image('alien3', 'assets/alien3.png')                          //plik z teksturą statku przeciwnika
        this.load.image('alien4', 'assets/alien4.png')                          //plik z teksturą statku przeciwnika

        this.load.image('playerBullet', 'assets/playerBullet.png')              //plik z teksturą pocisku gracza
        this.load.image('enemyBullet', 'assets/enemyBullet.png')                //plik z teksturą pocisku przeciwnika
        this.load.image('playerShip', 'assets/ship.png')                        //plik z teksturą statku gracza

        this.load.image('singleLaserPowerUp', 'assets/singleLaserPowerup.png')  //plik z teksturą powerupa z 1 laserem
        this.load.image('doubleLaserPowerUp', 'assets/doubleLaserPowerup.png')  //plik z teksturą powerupa z 2 laserami
        this.load.image('tripleLaserPowerUp', 'assets/tripleLaserPowerup.png')  //plik z teksturą powerupa z 3 laserami
        this.load.image('extraAmmo', 'assets/MoreBulletsPowerup.png')           //plik z teksturą powerupa extraAmmo
        this.load.image('extraSpeed', 'assets/ExtraSpeedPowerUp.png')           //plik z teksturą powerupa extraSpeed
        this.load.image('extraLife', 'assets/ExtraLifePowerup.png')             //plik z teksturą powerupa extraLife

        this.load.image('heartFont', 'assets/heartFont.png')                    //plik z teksturą napisu z życiami (serduszka jako font)
        //this.load.spritesheet() <- spritesheet dla elementów animowanych
    }

    create() {

        enemies = null;
        //dodanie sprite'ów tła i statków
        background=this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background1');
        stars2 = this.add.tileSprite(config.width/2, config.height/2, 0, 0, 'background2').setScale(0.75)
        ship = this.physics.add.sprite(config.width/2, config.height/1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);
        
        
        var newFont = new FontFace("PressStart2P", `url(${"assets/PressStart2P.ttf"})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
        
        //tekst wyniku
        scoreText = this.add.text(config.width/2, config.height*0.025, '', { font: '24px PressStart2P', fill: '#ffffff' });
        scoreText.setOrigin(0.5);
        scoreText.setText('Score: ' + score);

        //tekst z numerem poziomu
        var levelText = this.add.text(config.width*0.005, config.height*0.965, '', { font: '24px PressStart2P', fill: '#00ff00' });
        levelText.setOrigin(0);
        levelText.setText('LVL: ' + level);

        //wczytanie fontu z serduszkami
        const heartFontConfig = {
            image: 'heartFont', //nazwa fontu
            width: 73, //szerokość pojedynczego znaku w foncie
            height: 13, //wysokość pojedynczego znaku w foncie
            chars: Phaser.GameObjects.RetroFont.TEXT_SET12,
            charsPerRow: 1, //ilość znaków w jednym rzędzie w pliku
            spacing: {y: 1 } // określenie odstępu między początkiem a końcem dwóch znaków
        };

        //wypisanie ilości żyć na ekran
        this.cache.bitmapFont.add('heartFont', Phaser.GameObjects.RetroFont.Parse(this, heartFontConfig));
        livesText2 = this.add.bitmapText(config.width*0.995, config.height*0.995, 'heartFont', lives).setScale(2.25);
        livesText2.setOrigin(1);



        //ALIEN
        if(level%4==1)
        {
        enemies = this.physics.add.staticGroup({
            key: 'alien1', quantity: 25,
            gridAlign: { width: 7, height: 4,
            cellWidth: 110, cellHeight: 100,
            x: 140, y: 140,
            }
            });
            
        }
        
        if(level%4==2)
        {
        enemies = this.physics.add.staticGroup({
            key: 'alien2', quantity: 28,
            gridAlign: { width: 7, height: 4,
                cellWidth: 110, cellHeight: 100,
                x: 140, y: 140,
            }
            });
        }
        if(level%4==3)
        {
        enemies = this.physics.add.staticGroup({
            key: 'alien3', quantity: 28,
            gridAlign: { width: 7, height: 4,
                cellWidth: 100, cellHeight: 100,
                x: 140, y: 140,
            }
            });
        }
        if(level%4==0)
        {
        enemies = this.physics.add.staticGroup({
            key: 'alien4', quantity: 28,
            gridAlign: { width: 7, height: 4,
                cellWidth: 100, cellHeight: 100,
                x: 140, y: 140,
            }
            });
        }
        //przypisanie przycisków
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        jeden = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        dwa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        trzy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        bullets = new Bullets(this);
        bonusses = new Bonusses(this);
        // game.debugShowBody(bullets)
        // game.debugShowBody(enemies)
        this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        this.physics.add.overlap(ship, bonusses, shipCollectsBonus, null, this);
    }

    update(time, delta) {
        timeFromLastShot += delta;

        if(enemies.countActive() == 0)
        {
            level++;
            this.scene.restart();
        }
        background.tilePositionY -= 0.1;
        stars2.tilePositionY -= 0.4;
        ship.body.velocity.x=0;

        if(cursors.left.isDown && ship.body.x >= 0){
            ship.body.velocity.x = -shipVelocity;
        }else if(cursors.right.isDown && ship.body.x < config.width-ship.body.width){
            ship.body.velocity.x = shipVelocity;
        }
        

        //DEBUG DO TESTOWANIA POCISKÓW

        //if(jeden.isDown){playerLaserType=1}
        //if(dwa.isDown){playerLaserType=2}
        //if(trzy.isDown){playerLaserType=3}
        //console.log("timeFromLastShot = " + timeFromLastShot)
        //console.log("shotDelta = " + shotDelta)

        if (fireButton.isDown && timeFromLastShot >= shotDelta && canShoot) {
            bullets.fireBullet(ship.x, ship.y*0.95);
            canShoot = false;
        }
        if(!fireButton.isDown){ canShoot = true}
    }

}
var randomDrop;
function shipCollectsBonus(ship, bonus){

    if(bonus.type==1){
        playerLaserType = 1;
    }
    if(bonus.type==2){
        playerLaserType = 2;
    }
    if(bonus.type==3){
        playerLaserType = 3;
    }
    if(bonus.type==4){
        console.log("Zebrano extraAmmo")
    }
    if(bonus.type==5){
        console.log("Zebrano extraSpeed")
    }
    if(bonus.type==6){
        if(lives<5) 
            lives++;
        livesText2.setText(lives);
    }
    bonusses.killAndHide(bonus)
    bonus.body.setEnable(false);
}


function bulletHitsEnemy(bullet, enemy) {
    
    bullets.killAndHide(bullet)
    bullet.body.setEnable(false)
    
    let tempX, tempY;
    tempX = enemy.x
    tempY = enemy.y

    enemy.body.enable = false;
    enemies.killAndHide(enemy)
    
    //  Increase the score
    score += 20;
    scoreText.setText('Score: ' + score);
    
    randomDrop = Math.random() * 100;
    if(randomDrop < 2){ //ustawiam ~1% szans na drop bonusu z przeciwnika
        
        randomDrop = Math.ceil(Math.random() * 6)
        if(randomDrop==1)
        {console.log("Tutaj dropnij pojedyczny laser w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 1)}

        if(randomDrop==2)
        {console.log("Tutaj dropnij podwójny laser w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 2)}

        if(randomDrop==3)
        {console.log("Tutaj dropnij potrójny laser w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 3)}

        if(randomDrop==4)
        {console.log("Tutaj dropnij extra ammo w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 4)}

        if(randomDrop==5)
        {console.log("Tutaj dropnij extra speed w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 5)}

        if(randomDrop==6)
        {console.log("Tutaj dropnij extra life w miejscu: " + tempX + " " + tempY)
        bonusses.dropBonus(tempX, tempY, 6)}
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
        arcade:{debug: true}
        },
    backgroundColor: "48a",
    pixelArt: true,
    scene: [MainMenu, GamePlay]
    }
var game = new Phaser.Game(config);

