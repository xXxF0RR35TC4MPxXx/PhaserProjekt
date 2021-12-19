//tekst w menu
var Enter;                                      //tekst "Enter" w menu
var pressEnterText;                             //tekst "Press       to play" w menu
var timeFromTextBlink = 0;                      //czas od ostatniego "mrygnięcia" tekstu na ekranie startowym
var textBlinkingDelta = 1000;                   //co jaki czas ma mrygać tekst na ekranie startowym
var timeFromTextBlink2 = 0;                     //co jaki czas ma mrygać tekst na ekranie startowym
var canStartGame = true;                        //czy można zacząć grę
var isGamePaused = false;
var pauseTimer = 0;
var canPause = true;
var storePosition1, storePosition2, storePosition3, storePosition4, storePosition5, storePosition6, storePosition7
var stPos1Text, stPos2Text, stPos3Text, stPos4Text, stPos5Text, stPos6Text, stPos7Text
var stPos1CenaText,stPos2CenaText, stPos3CenaText,stPos4CenaText,stPos5CenaText,stPos6CenaText,stPos7CenaText
var scoreText2, returnText2, kupionoText
var powrotzesklepu=false
var isInShop=false
//input
var startButton;                                //przycisk startu gry (tu ENTER)
var pauseButton;                                //przycisk startu gry (tu ENTER)
var cursors;                                    //strzałki na klawiaturze (potrzebne do inputa)
var fireButton;                                 //przycisk odpowiedzialny za strzał (tu SPACJA)
var powerShotButton                             //przycisk aktywacji broni specjalnej (tu lewy CTRL)
var kup1, kup2, kup3, kup4, kup5, kup6, kup7

//obiekty gry / tekstury / teksty
var ship;                                       //statek gracza (sprite)
var background;                                 //tło planszy (to pod spodem)
var pauseBackground;                            //tło planszy (to pod spodem)
var menuBackground;
var storeBackground;
var stars2;                                     //tło planszy (gwiazdy na wierzchu, te szybciej latające)
var scoreText                                   //tekst przechowujący ilość punktów
var livesText2
var pauseSceneText

//wartości zmiennych statku gracza
var shipVelocity = 500;                         //prędkość poruszania się statku (default: 100, debug: 500)
var timeFromLastShot = 0;                       //czas od ostatniego strzału
var shotDelta = 200;                            //różnica czasowa między strzałami
var canShoot = true;                            //zmienna po to, żeby jedno kliknięcie strzelało tylko jeden raz, a nie full
var canShootPowerShot = true;                   //zmienna po to, żeby jedno kliknięcie strzelało strzałem specjalnym tylko jeden raz, a nie full
var maxAmmo = 12;                               //primary ammo (default: 2, debug: 12)

//wartości podczas rozgrywki (życia, ammo itp.)
var score = 0;                                  //wynik gracza
var lives = 2;                                  //ilość żyć gracza
var level = 1;                                  //numer planszy
var powerShotAmmo = 5;                          //amunicja broni specjalnej
var playerLaserType = 3;                        //typ lasera gracza (Panie Areczku, playerLaserType=3 jest dla developerów. Dla pana jest playerLaserType=1)
var randomDropChance = 2;                       //szansa na drop bonusu z przeciwnika (0-100%)


//grupy obiektów w czasie gry
var enemies                                     //zbiór/grupa przeciwników
var bullets                                     //zbiór/grupa strzałów podstawowych gracza
var powerShots                                  //zbiór/grupa strzałów bonusowych
var bonusses                                    //zbiór/grupa bonusów wypadających z przeciwnika
var powerup
var randomDrop

//debug only
var jeden, dwa, trzy;                           //tylko do debugowania, zmiana typu lasera pod przyciskami '1', '2', '3' na klawiaturze.

//klasa pojedynczego pocisku
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerBullet'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire(x, y) {
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku
        this.angle = 0;
    }


    fireWBok(x, y, kierunek) //strzały w bok dla strzału potrójnego
    {

        this.body.reset(x, y);
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.setEnable(true)
        if (kierunek == 0) //strzał w lewo
        {
            this.angle = -33; //zmiana kąta nachylenia sprite'a o 33 stopnie w lewo
            this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku w pionie
            this.setVelocityX(-550); //ustawienie prędkości lotu pocisku w poziomie
        }
        if (kierunek == 1) //strzał w prawo
        {
            this.angle = 33; //zmiana kąta nachylenia sprite'a o 33 stopnie w prawo
            this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku w pionie
            this.setVelocityX(+550); //ustawienie prędkości lotu pocisku w poziomie
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= -32) //kiedy pocisk wyleci poza planszę to ustaw na niewidoczny i nieaktywny
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
//klasa kolekcji pocisków gracza
class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: maxAmmo,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }


    fireBullet(x, y) {
        timeFromLastShot = 0; //czas od ostatniego strzału = 0

        //jeżeli gracz ma pojedynczy laser
        if (playerLaserType == 1) {
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
            }
        }

        //jeżeli gracz ma podwójny laser
        if (playerLaserType == 2) {
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x - 20, y); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x + 20, y); //to go wystrzel w określonym miejscu
            }
        }

        //jeżeli gracz ma potrójny laser
        if (playerLaserType == 3) {
            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fireWBok(x + 20, y, 1); //to go wystrzel w określonym miejscu
            }
            bullet = this.getFirstDead(false);
            if (bullet) //jeśli taki istnieje
            {
                bullet.fireWBok(x - 20, y, 0); //to go wystrzel w określonym miejscu
            }
        }
    }
}

//klasa kolekcji bonusów
class Bonusses extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.createMultiple({
            frameQuantity: 15,
            key: 'bonus',
            active: false,
            visible: false,
            classType: Bonus
        });
    }
    dropBonus(x, y, type) {

        let bonus = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk

        if (bonus) //jeśli taki istnieje
        {

            bonus.type = type;
            if (bonus.type == 1) {
                bonus.setTexture('singleLaserPowerUp')
            }
            if (bonus.type == 2) {
                bonus.setTexture('doubleLaserPowerUp')
            }
            if (bonus.type == 3) {
                bonus.setTexture('tripleLaserPowerUp')
            }
            if (bonus.type == 4) {
                bonus.setTexture('extraAmmo')
            }
            if (bonus.type == 5) {
                bonus.setTexture('extraSpeed')
            }
            if (bonus.type == 6) {
                bonus.setTexture('extraLife')
            }
            if (bonus.type == 7) {
                bonus.setTexture('powerShotPowerUp')
            }
            bonus.drop(x, y); //to go wystrzel w określonym miejscu
        }
    }
}

//klasa pojedynczego bonusu
class Bonus extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'singleLaserPowerUp');
    }

    drop(x, y) {
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(100); //ustawienie prędkości lotu pocisku
        this.angle = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y >= 932) //kiedy pocisk wyleci poza planszę to ustaw na niewidoczny i nieaktywny
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

/////////extra strzały//////////
class PowerShots extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.createMultiple({
            frameQuantity: 5,
            key: 'powerShotjee',
            active: false,
            visible: false,
            classType: PowerShot
        });
    }
    getPowerShot(x, y) {
        if (powerShotAmmo > 0) {
            let powerShot = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk

            if (powerShot) //jeśli taki istnieje
            {
                powerShot.shoot(x, y); //to go wystrzel w określonym miejscu
            }
        }
    }
}

class PowerShot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'powerShotjee');
    }

    shoot(x, y) {
        this.anims.play('powerShotjeeAnim')
        this.setActive(true); //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(-1000); //ustawienie prędkości lotu pocisku
        this.angle = 0;
        powerShotAmmo--;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= -32) //kiedy pocisk wyleci poza planszę to ustaw na niewidoczny i nieaktywny
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class PauseScene extends Phaser.Scene{
    constructor() {
        super({ key: 'PauseScene', });
    }

    preload(){
        
    }
    create(){
        pauseBackground = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background1');
        pauseSceneText = this.add.text(game.config.width / 2, game.config.height / 2, 'Press "P" to continue!', { font: "30px PressStart2P" }).setOrigin(0.5);;
    }
    update(time, delta){
        //console.log("Update: isGamePaused: " + isGamePaused)
        timeFromTextBlink2 += delta;
        pauseBackground.tilePositionY -= 0.1;
        if (timeFromTextBlink2 >= textBlinkingDelta) {
            timeFromTextBlink2 = 0;
            pauseSceneText.setVisible(!pauseSceneText.visible);
            //console.log("pauseSceneText.visible == " + pauseSceneText.visible)
        }
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey('P'), 50) && isGamePaused)
        {
            
            pauseTimer = 0;
            isGamePaused=false;
            //console.log("isGamePaused: " + isGamePaused)
            this.scene.stop("PauseScene")
            this.scene.resume("GamePlay");
            isGamePaused=false;
        }
    }
}

class StoreScene extends Phaser.Scene{
    constructor(){
        super({ key: 'StoreScene', });
    }

    preload(){
        
    }
    create(){
        storeBackground = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background1');
        isInShop=true
        storePosition1 = this.add.tileSprite(100, 110, 0, 0, 'singleLaserPowerUp');
        stPos1Text = this.add.text(200, 100, "Kup Single Laser", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos1CenaText = this.add.text(800, 125, "1000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition2 = this.add.tileSprite(100, 210, 0, 0, 'doubleLaserPowerUp');
        stPos2Text = this.add.text(200, 200, "Kup Double Laser", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos2CenaText = this.add.text(800, 225, "2500", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition3 = this.add.tileSprite(100, 310, 0, 0, 'tripleLaserPowerUp');
        stPos3Text = this.add.text(200, 300, "Kup Triple Laser", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos3CenaText = this.add.text(800, 325, "5000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition4 = this.add.tileSprite(100, 410, 0, 0, 'extraAmmo');
        stPos4Text = this.add.text(200, 400, "Kup Extra Ammo", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos4CenaText = this.add.text(800, 425, "2000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition5 = this.add.tileSprite(100, 510, 0, 0, 'extraSpeed');
        stPos5Text = this.add.text(200, 500, "Kup Extra Speed", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos5CenaText = this.add.text(800, 525, "2000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition6 = this.add.tileSprite(100, 610, 0, 0, 'extraLife');
        stPos6Text = this.add.text(200, 600, "Kup Extra Life", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos6CenaText = this.add.text(800, 625, "10000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        storePosition7 = this.add.tileSprite(100, 710, 0, 0, 'powerShotPowerUp');
        stPos7Text = this.add.text(200, 700, "Kup PowerShot Ammo", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)
        stPos7CenaText = this.add.text(800, 725, "3000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)

        scoreText2 = this.add.text(config.width / 2, config.height * 0.025, '', { font: '24px PressStart2P', fill: '#ffffff' });
        scoreText2.setOrigin(0.5);
        scoreText2.setText('Score: ' + score);

        returnText2 = this.add.text(config.width / 2, config.height * 0.95, '', { font: '24px PressStart2P', fill: '#ffffff' });
        returnText2.setOrigin(0.5);
        returnText2.setText("Press ESCAPE to continue!");

        kup1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        kup2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        kup3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        kup4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        kup5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        kup6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        kup7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
    }
    update(time, delta){
        storeBackground.tilePositionY -= 0.1;
        if(this.input.keyboard.checkDown(kup1, 100) && isInShop)
        {
            if (playerLaserType == 1) {
                maxAmmo++;
            }
            else playerLaserType = 1;
            // bullets = new Bullets(GamePlay)
            // GamePlay.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
            score-=1000
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
        }
        if(this.input.keyboard.checkDown(kup2, 100) && isInShop)
        {
            playerLaserType = 2;
            score-=2500
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
            // bullets = new Bullets(GamePlay)
            // GamePlay.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        }
        if(this.input.keyboard.checkDown(kup3, 100) && isInShop)
        {
            playerLaserType = 3;
            
            score-=5000
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
            // bullets = new Bullets(GamePlay)
            // GamePlay.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        }
        if(this.input.keyboard.checkDown(kup4, 100) && isInShop)
        {
            if (maxAmmo < 97)
            {
                maxAmmo += playerLaserType;
                // bullets = new Bullets(GamePlay)
                // GamePlay.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
                score-=2000
                scoreText.setText("Score: " + score)
                scoreText2.setText("Score: " + score)
            }
        }
        if(this.input.keyboard.checkDown(kup5, 100) && isInShop)
        {
            if (shipVelocity <= 980)
            {
                shipVelocity += 20;
                score -= 2000
                scoreText.setText("Score: " + score)
                scoreText2.setText('Score: ' + score);
            }
        }
        if(this.input.keyboard.checkDown(kup6, 100) && isInShop)
        {
            if (lives < 5)
            {
                lives++;
                score-=10000
                scoreText2.setText("Score: " + score)
                scoreText.setText("Score: " + score)
            livesText2.setText(lives);}
        }
        if(this.input.keyboard.checkDown(kup7, 100) && isInShop)
        {
            if (powerShotAmmo < 10) {
                {
                    powerShotAmmo++;
                    score-=3000
                    scoreText.setText("Score: " + score)
                    scoreText2.setText("Score: " + score)
                }
            }
        }
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC), 100))
        {
            //console.log("isGamePaused: " + isGamePaused)
            level--;
            powrotzesklepu=true;
            isInShop=false
            this.scene.stop("StoreScene");
            this.scene.resume("GamePlay");
            level++
            powrotzesklepu=false;
            isInShop=false
        }
    }

}

//scena rozgrywki
class GamePlay extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlay', });

        this.bullets;
        this.ship;
    }

    //wczytanie tekstur
    preload() {
        //console.log("GamePlay preload()")
        this.load.image('background1', 'assets/8bitbackground.png')             //plik z teksturą tła pod spodem
        this.load.image('background2', 'assets/8bitbackground2.png')            //plik z teksturą tła na wierzchu (dwa tła dla efektu paralaksy)

        this.load.image('playerBullet', 'assets/playerBullet.png')              //plik z teksturą pocisku gracza
        this.load.image('enemyBullet', 'assets/enemyBullet.png')                //plik z teksturą pocisku przeciwnika
        this.load.image('playerShip', 'assets/ship.png')                        //plik z teksturą statku gracza

        this.load.image('singleLaserPowerUp', 'assets/singleLaserPowerup.png')  //plik z teksturą powerupa z 1 laserem
        this.load.image('doubleLaserPowerUp', 'assets/doubleLaserPowerup.png')  //plik z teksturą powerupa z 2 laserami
        this.load.image('tripleLaserPowerUp', 'assets/tripleLaserPowerup.png')  //plik z teksturą powerupa z 3 laserami
        this.load.image('extraAmmo', 'assets/MoreBulletsPowerup.png')           //plik z teksturą powerupa extraAmmo
        this.load.image('extraSpeed', 'assets/ExtraSpeedPowerUp.png')           //plik z teksturą powerupa extraSpeed
        this.load.image('extraLife', 'assets/ExtraLifePowerup.png')             //plik z teksturą powerupa extraLife
        this.load.image('powerShotPowerUp', 'assets/powerShotPowerUp.png')      //plik z teksturą powerupa powerShot

        this.load.image('heartFont', 'assets/heartFont.png')                    //plik z teksturą napisu z życiami (serduszka jako font)

        this.load.spritesheet('alien1png', 'assets/alien1xd.png', {
            frameWidth: 49,
            frameHeight: 42,
        });
        this.load.spritesheet('alien2png', 'assets/alien2xd.png', {
            frameWidth: 49,
            frameHeight: 42,
        });
        this.load.spritesheet('alien3png', 'assets/alien3xd.png', {
            frameWidth: 49,
            frameHeight: 42,
        });
        this.load.spritesheet('alien4png', 'assets/alien4xd.png', {
            frameWidth: 49,
            frameHeight: 42,
        });
        this.load.spritesheet('exploooosion', 'assets/explosion.png', {
            frameWidth: 34,
            frameHeight: 34,
        });

        this.load.spritesheet('playerExplosion', 'assets/playerExplosion.png', {
            frameWidth: 34,
            frameHeight: 34
        });
        this.load.spritesheet('powerShotjee', 'assets/powerShot.png', {
            frameWidth: 65,
            frameHeight: 65
        });
        //this.load.spritesheet() <- spritesheet dla elementów animowanych
    }

    create() {
        enemies = null;
        powrotzesklepu=false;
        isInShop=false
        //dodanie sprite'ów tła i statków
        background = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background1');
        stars2 = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background2').setScale(0.75)
        ship = this.physics.add.sprite(config.width / 2, config.height / 1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);

        //dodanie animacji ze spritesheet'ów
        this.anims.create({
            key: 'kill',
            frames: this.anims.generateFrameNumbers(
                'exploooosion', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 10,
            repeat: 0,
        });

        //na razie nie ma implementacji trafienia gracza przez pocisk, ale jak będzie
        //to odpalić tą animację w momencie trafienia
        this.anims.create({
            key: 'playerKill',
            frames: this.anims.generateFrameNumbers(
                'playerExplosion', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'alien1anim',
            frames: this.anims.generateFrameNumbers(
                'alien1png', { frames: [0, 1] }),
            frameRate: 0.75,
            repeat: -1
        });
        this.anims.create({
            key: 'alien2anim',
            frames: this.anims.generateFrameNumbers(
                'alien2png', { frames: [0, 1] }),
            frameRate: 0.75,
            repeat: -1
        });
        this.anims.create({
            key: 'alien3anim',
            frames: this.anims.generateFrameNumbers(
                'alien3png', { frames: [0, 1] }),
            frameRate: 0.75,
            repeat: -1
        });
        this.anims.create({
            key: 'alien4anim',
            frames: this.anims.generateFrameNumbers(
                'alien4png', { frames: [0, 1] }),
            frameRate: 0.75,
            repeat: -1
        });
        this.anims.create({
            key: 'powerShotjeeAnim',
            frames: this.anims.generateFrameNumbers(
                'powerShotjee', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 6,
            repeat: -1
        });

        //dodanie fontu z pliku
        var newFont = new FontFace("PressStart2P", `url(${"assets/PressStart2P.ttf"})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });

        //tekst wyniku
        scoreText = this.add.text(config.width / 2, config.height * 0.025, '', { font: '24px PressStart2P', fill: '#ffffff' });
        scoreText.setOrigin(0.5);
        scoreText.setText('Score: ' + score);

        //tekst z numerem poziomu
        var levelText = this.add.text(config.width * 0.005, config.height * 0.965, '', { font: '24px PressStart2P', fill: '#00ff00' });
        levelText.setOrigin(0);
        levelText.setText('LVL: ' + level);

        //wczytanie fontu z serduszkami
        const heartFontConfig = {
            image: 'heartFont', //nazwa fontu
            width: 73, //szerokość pojedynczego znaku w foncie
            height: 13, //wysokość pojedynczego znaku w foncie
            chars: Phaser.GameObjects.RetroFont.TEXT_SET12,
            charsPerRow: 1, //ilość znaków w jednym rzędzie w pliku
            spacing: { y: 1 } // określenie odstępu między początkiem a końcem dwóch znaków
        };

        //wypisanie ilości żyć na ekran
        this.cache.bitmapFont.add('heartFont', Phaser.GameObjects.RetroFont.Parse(this, heartFontConfig));
        livesText2 = this.add.bitmapText(config.width * 0.995, config.height * 0.995, 'heartFont', lives).setScale(2.25);
        livesText2.setOrigin(1);



        //tworzenie grup przeciwników
        if (level % 4 == 1) {
            enemies = this.physics.add.staticGroup({
                key: 'alien1png', quantity: 28,
                gridAlign: {
                    width: 7, height: 4,
                    cellWidth: 110, cellHeight: 100,
                    x: 140, y: 140,
                }
            });
            enemies.children.iterate(alien => {
                alien.anims.play('alien1anim')
            })
        }
        if (level % 4 == 2) {
            enemies = this.physics.add.staticGroup({
                key: 'alien2png', quantity: 28,
                gridAlign: {
                    width: 7, height: 4,
                    cellWidth: 110, cellHeight: 100,
                    x: 140, y: 140,
                }
            });
            enemies.children.iterate(alien => {
                alien.anims.play('alien2anim')
            })
        }
        if (level % 4 == 3) {
            enemies = this.physics.add.staticGroup({
                key: 'alien3png', quantity: 28,
                gridAlign: {
                    width: 7, height: 4,
                    cellWidth: 100, cellHeight: 100,
                    x: 140, y: 140,
                }
            });
            enemies.children.iterate(alien => {
                alien.anims.play('alien3anim')
            })
        }
        if (level % 4 == 0) {
            enemies = this.physics.add.staticGroup({
                key: 'alien4png', quantity: 28,
                gridAlign: {
                    width: 7, height: 4,
                    cellWidth: 100, cellHeight: 100,
                    x: 140, y: 140,
                }
            });
            enemies.children.iterate(alien => {
                alien.anims.play('alien4anim')
            })
        }

        //przypisanie przycisków
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        jeden = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        dwa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        trzy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        powerShotButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
        pauseButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)

        bullets = new Bullets(this);
        bonusses = new Bonusses(this);
        powerShots = new PowerShots(this);
        // game.debugShowBody(bullets)
        // game.debugShowBody(enemies)

        //implementacja kolizji
        this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        this.physics.add.overlap(powerShots, enemies, powerShotHitsEnemy, null, this);
        this.physics.add.overlap(ship, bonusses, shipCollectsBonus, null, this);
    }

    update(time, delta) {
        
        timeFromLastShot += delta;
        pauseTimer += delta;
        isGamePaused = false;
        if(pauseTimer >= 1500){
            canPause=true;
        }
        //jeśli na planszy nie ma przeciwników to przejdź do następnego poziomu
        if (enemies.countActive() == 0) {
            //console.log("Przejście z poziomu: " + level)
            level++;
            if(!powrotzesklepu)
            {
                this.scene.restart();}
            if(level%4==1 && level!=1 && !isInShop){ //lub do sklepu co czwarty poziom
                
                this.scene.pause("GamePlay");
                this.scene.launch("StoreScene");
            }
            //console.log("Przejście na poziom: " + level)
            


        }
        background.tilePositionY -= 0.1;
        //console.log("background.tilePositionY = " + background.tilePositionY)
        stars2.tilePositionY -= 0.4;
        ship.body.velocity.x = 0;

        if (cursors.left.isDown && ship.body.x >= 0) {
            ship.body.velocity.x = -shipVelocity;
        } else if (cursors.right.isDown && ship.body.x < config.width - ship.body.width) {
            ship.body.velocity.x = shipVelocity;
        }

        //console.log("isGamePaused = " + isGamePaused)
        //console.log("pauseTimer = " + pauseTimer)
        //console.log("canPause = " + canPause)
        
        //console.log("pauseButton.isDown = " + pauseButton.isDown)
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey('P'), 100) && isGamePaused==false && pauseTimer >= 1500 && canPause == true)
        {
            pauseTimer = 0;
            isGamePaused = true;
            //console.log("isGamePaused: " + isGamePaused)
            this.scene.pause("GamePlay");
            this.scene.launch("PauseScene");
        }
        if (!pauseButton.isDown) {canPause = false}
        //DEBUG DO TESTOWANIA POCISKÓW

        //if(jeden.isDown){playerLaserType=1}
        //if(dwa.isDown){playerLaserType=2}
        //if(trzy.isDown){playerLaserType=3}
        //console.log("timeFromLastShot = " + timeFromLastShot)
        //console.log("shotDelta = " + shotDelta)

        if (fireButton.isDown && timeFromLastShot >= shotDelta && canShoot) {
            bullets.fireBullet(ship.x, ship.y * 0.95);
            canShoot = false;
        }
        if (!fireButton.isDown) { canShoot = true }

        if (powerShotButton.isDown && canShootPowerShot) {
            powerShots.getPowerShot(ship.x, ship.y * 0.95);
            canShootPowerShot = false;
        }
        if (!powerShotButton.isDown) { canShootPowerShot = true }
    }

}

//logika zebrania bonusu przez statek gracza
function shipCollectsBonus(ship, bonus) {

    if (bonus.type == 1) {
        if (playerLaserType == 1) {
            maxAmmo++;
            bullets = new Bullets(this)
            this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        }
        else playerLaserType = 1;
    }
    if (bonus.type == 2) {
        if (playerLaserType == 2) {
            if (maxAmmo % 2 == 0)
                maxAmmo += 2
            else {
                while (maxAmmo % 2 != 0)
                    maxAmmo++;
            }
        }
        else {
            playerLaserType = 2;
            while (maxAmmo % 2 != 0)
                maxAmmo++;
        }

        bullets = new Bullets(this)
        this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
    }
    if (bonus.type == 3) {
        if (playerLaserType == 3) {
            if (maxAmmo % 3 == 0)
                maxAmmo += 3
            else {
                while (maxAmmo % 3 != 0)
                    maxAmmo++;
            }

        }
        else {
            playerLaserType = 3;
            while (maxAmmo % 3 != 0)
                maxAmmo++;
        }
        bullets = new Bullets(this)
        this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
    }
    if (bonus.type == 4) {
        if (maxAmmo >= 97 && maxAmmo <= 99) {
            score += 10000
            scoreText.setText('Score: ' + score);
        }
        else {
            maxAmmo += playerLaserType;
            bullets = new Bullets(this)
            this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        }
    }
    if (bonus.type == 5) {
        if (shipVelocity <= 980)
            shipVelocity += 20;
        else {
            score += 1000
            scoreText.setText('Score: ' + score);
        }
    }
    if (bonus.type == 6) {
        if (lives < 5)
            lives++;
        else {
            score += 1000
            scoreText.setText('Score: ' + score);
        }
        livesText2.setText(lives);
    }
    if (bonus.type == 7) {
        if (powerShotAmmo < 10) {
            powerShotAmmo++;
        }
        else {
            score += 1000
            scoreText.setText('Score: ' + score);
        }
    }
    bonusses.killAndHide(bonus)
    bonus.body.setEnable(false);
}

function powerShotHitsEnemy(powerShot, enemy) {

    const temp = this.add.sprite(enemy.x, enemy.y)
    temp.anims.play('kill');

    let tempX, tempY;
    tempX = enemy.x
    tempY = enemy.y

    enemy.body.enable = false;
    enemies.killAndHide(enemy)

    //  Increase the score
    score += 20;
    scoreText.setText('Score: ' + score);

    dropRandomBonus(tempX, tempY)
}

function dropRandomBonus(tempX, tempY) {
    randomDrop = Math.random() * 100;
    if (randomDrop < randomDropChance) { //ustawiam ~1% szans na drop bonusu z przeciwnika

        randomDrop = Math.ceil(Math.random() * 7)
        if (randomDrop == 1) {
            //console.log("Tutaj dropnij pojedyczny laser w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 1)
        }

        if (randomDrop == 2) {
            //console.log("Tutaj dropnij podwójny laser w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 2)
        }

        if (randomDrop == 3) {
            //console.log("Tutaj dropnij potrójny laser w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 3)
        }

        if (randomDrop == 4) {
            //console.log("Tutaj dropnij extra ammo w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 4)
        }

        if (randomDrop == 5) {
            //console.log("Tutaj dropnij extra speed w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 5)
        }

        if (randomDrop == 6) {
            //console.log("Tutaj dropnij extra life w miejscu: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 6)
        }

        if (randomDrop == 7) {
            //console.log("PowerShotAmmo: " + tempX + " " + tempY)
            bonusses.dropBonus(tempX, tempY, 7)
        }
    }
}

function bulletHitsEnemy(bullet, enemy) {

    const temp = this.add.sprite(enemy.x, enemy.y)
    temp.anims.play('kill');
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

    dropRandomBonus(tempX, tempY)

}
//scena głównego menu
class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu', });
    }

    preload() {

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

        menuBackground = this.add.tileSprite(game.config.width / 2, game.config.height / 2, 0, 0, 'background1'); //dodanie tła

        //wczytanie retro-fontu do ekranu startowego
        var newFont = new FontFace("PressStart2P", `url(${"assets/PressStart2P.ttf"})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });

        //dodanie napisu z tytułem gry z tym fajnym fontem z pliku .png
        this.cache.bitmapFont.add('titleFont', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
        const text = this.add.bitmapText(game.config.width / 2, game.config.height / 5, 'titleFont', 'SPACE SHOOTER').setScale(1.25);
        text.setOrigin(0.5);

        //określenie przycisku startu gry
        startButton = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER);

        //tekst mówiący, żeby wcisnąć "Enter", żeby zacząć grę. Niestety musiałem rozbić na dwa teksty, gdzie drugi z nich ma zmieniony styl. Wytłumaczenie niżej.
        pressEnterText = this.add.text(game.config.width / 2, game.config.height / 2, 'Press       To Play!', { font: "30px PressStart2P" }).setOrigin(0.5);;
        Enter = this.add.text(game.config.width / 2, game.config.height / 2, '      ENTER         ', { font: "30px PressStart2P" }).setOrigin(0.5);;

        Enter.setTint(0xff0000) //ustawienie koloru tekstu Enter

        //w Phaser 2 można było zmienić kolor wybranych liter za pomocą prostej funkcji, ale oczywiście w Phaser 3 zabrali tą opcję...
        //pressEnterText.addColor('#ff0000', 6);
        //pressEnterText.addColor('#ffffff', 10);
    }


    update(time, delta) {
        timeFromTextBlink += delta;
        menuBackground.tilePositionY -= 0.1;
        if (timeFromTextBlink >= textBlinkingDelta) {
            timeFromTextBlink = 0;
            Enter.setVisible(!Enter.visible);
            pressEnterText.setVisible(!pressEnterText.visible);
        }
        if (startButton.isDown && canStartGame) {
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
        arcade: { debug: false }
    },
    backgroundColor: "48a",
    pixelArt: true,
    scene: [MainMenu, GamePlay, PauseScene, StoreScene]
}
var game = new Phaser.Game(config);

