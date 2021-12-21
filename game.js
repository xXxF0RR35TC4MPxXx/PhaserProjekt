//tekst w menu
var Enter;                                      //tekst "Enter" w menu
var pressEnterText;                             //tekst "Press       to play" w menu
var timeFromTextBlink = 0;                      //czas od ostatniego "mrygnięcia" tekstu na ekranie startowym
var textBlinkingDelta = 1000;                   //co jaki czas ma mrygać tekst na ekranie startowym
var timeFromTextBlink2 = 0;                     //co jaki czas ma mrygać tekst na ekranie startowym
var canStartGame = true;                        //czy można zacząć grę

//tekst w sklepie
var storePosition1, storePosition2, storePosition3, storePosition4, storePosition5, storePosition6, storePosition7
var stPos1Text, stPos2Text, stPos3Text, stPos4Text, stPos5Text, stPos6Text, stPos7Text
var stPos1CenaText,stPos2CenaText, stPos3CenaText,stPos4CenaText,stPos5CenaText,stPos6CenaText,stPos7CenaText
var scoreText2, returnText2
var coKupionoText                               //nazwa kupionego przedmiotu

//logika do pauzy
var isGamePaused = false;                       //czy gra jest zapauzowana
var pauseTimer = 0;                             //timer, ile czasu od ostatniej pauzy upłynęło
var canPause = true;                            //czy można zapauzować grę

var powrotzesklepu=false    
var isInShop=false                              //zmienna czy jest w sklepie
var levelRestartTimer=0                         //timer, ile czasu po końcu poziomu ma się załadować następny
var respawnTimer = 0
var spawnProtectionTimer=0
var przesunYO = 0
//input
var startButton;                                //przycisk startu gry (tu ENTER)
var pauseButton;                                //przycisk startu gry (tu ENTER)
var cursors;                                    //strzałki na klawiaturze (potrzebne do inputa)
var fireButton;                                 //przycisk odpowiedzialny za strzał (tu SPACJA)
var powerShotButton                             //przycisk aktywacji broni specjalnej (tu lewy CTRL)
var kup1, kup2, kup3, kup4, kup5, kup6, kup7    //przyciski 1-7 na klawiaturze (do kupowania w sklepie)

//obiekty gry / tekstury / teksty
var ship;                                       //statek gracza (sprite)
var background;                                 //tło planszy (to pod spodem)
var pauseBackground;                            //tło planszy (to pod spodem)
var menuBackground;                             //tło w menu
var storeBackground;                            //tło w sklepie
var stars2;                                     //tło planszy (gwiazdy na wierzchu, te szybciej latające)
var scoreText                                   //tekst przechowujący ilość punktów
var livesText2                                  //tekst z ilością żyć
var pauseSceneText                              //tekst podczas pauzy
var gameoverText;
var gameoverText2;
var path                                        //ścieżka / droga po której poruszają się przeciwnicy na danym poziomie
var levelFinishText1, levelFinishText2          //tekst po zakończeniu poziomu
var isAlive=true

//wartości zmiennych statku gracza

var timeFromLastShot = 0;                       //czas od ostatniego strzału
var shotDelta = 200;                            //różnica czasowa między strzałami
var canShoot = true;                            //zmienna po to, żeby jedno kliknięcie strzelało tylko jeden raz, a nie full
var canShootPowerShot = true;                   //zmienna po to, żeby jedno kliknięcie strzelało strzałem specjalnym tylko jeden raz, a nie full
var maxAmmo = 12;                               //primary ammo (default: 2, debug: 12)
var shipVelocity = 500;                         //prędkość poruszania się statku (default: 100, debug: 500)
//wartości podczas rozgrywki (życia, ammo itp.)
var score = 0;                                  //wynik gracza
var lives = 2;                                  //ilość żyć gracza
var level = 1;                                  //numer planszy
var powerShotAmmo = 5;                          //amunicja broni specjalnej
var playerLaserType = 1;                        //typ lasera gracza (Panie Areczku, playerLaserType=3 jest dla developerów. Dla pana jest playerLaserType=1)
var randomDropChance = 2;                       //szansa na drop bonusu z przeciwnika (0-100%)
var scoreForEnemy = 100                         //punkty za zestrzelenie wroga
var enemyLaserType = 1
var maxEnemyShotDelta = 15000
var enemyShotDelta = 0
var minEnemyShotDelta = 10000
var enemyShotTimer = 0
var enemyCanShoot = true
var timeFromTextBlink3 =0 

var gameOver = false                            //grupy obiektów w czasie gry
var enemies                                     //zbiór/grupa przeciwników
var enemyBullets
var bullets                                     //zbiór/grupa strzałów podstawowych gracza
var powerShots                                  //zbiór/grupa strzałów bonusowych
var bonusses                                    //zbiór/grupa bonusów wypadających z przeciwnika
var powerup                                     //pojedynczy powerup
var randomDrop                                  //losowy drop

//debug only
var jeden, dwa, trzy;                           //tylko do debugowania, zmiana typu lasera pod przyciskami '1', '2', '3' na klawiaturze.

//klasa pojedynczego pocisku
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerBullet'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire(x, y) {
        this.setActive(true);       //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(-1000);   //ustawienie prędkości lotu pocisku
        this.angle = 0;             //ustawienie pochylenia pocisku na 0 stopni
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

//klasa pojedynczego pocisku
class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemyBullet'); //konstruktor ze współrzędnymi i teksturą strzału
    }

    fire(x, y) {
        this.setActive(true);       //ustawienie pocisku na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(500);   //ustawienie prędkości lotu pocisku
        this.angle = 0;             //ustawienie pochylenia pocisku na 0 stopni
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

//klasa kolekcji pocisków gracza
class EnemyBullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 70,
            key: 'enemyBullet',
            active: false,
            visible: false,
            classType: EnemyBullet
        });
    }


    fireBullet(x, y) {
        enemyShotTimer = 0; //czas od ostatniego strzału = 0

        //jeżeli gracz ma pojedynczy laser

            let bullet = this.getFirstDead(false); //pobierz pierwszy wolny (nie będący na planszy / niewystrzelony) pocisk
            if (bullet) //jeśli taki istnieje
            {
                bullet.fire(x, y); //to go wystrzel w określonym miejscu
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
            //ustawianie tekstury w zależności od typu power'upu
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
        super(scene, x, y, 'singleLaserPowerUp'); //singleLaser to tekstura domyślna, podmieniana przy dropnięciu itemu
    }

    drop(x, y) {
        this.setActive(true); //ustawienie bonusu na aktywny i widoczny
        this.setVisible(true);
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setVelocityY(100); //ustawienie prędkości lotu bonusu
        this.angle = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y >= 932) //kiedy bonus wyleci poza planszę to ustaw na niewidoczny i nieaktywny
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
            this.body.setEnable(false);
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
        pauseBackground.tilePositionY += przesunYO
    }
    update(time, delta)
    {
        timeFromTextBlink2 += delta;
        pauseBackground.tilePositionY -= 0.1; //przesuwanie tła do dołu
        background.tilePositionY -= 0.1;
        przesunYO = pauseBackground.tilePositionY
        //mryganie napisu
        if (timeFromTextBlink2 >= textBlinkingDelta) {
            timeFromTextBlink2 = 0;
            pauseSceneText.setVisible(!pauseSceneText.visible);
        }

        //wyjście z pauzy / odpauzowanie po wciśnięciu "P"
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey('P'), 50) && isGamePaused)
        {
            pauseTimer = 0;
            isGamePaused=false;
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
        storeBackground.tilePositionY += przesunYO
        //item nr 1 w sklepie
        storePosition1 = this.add.tileSprite(100, 110, 0, 0, 'singleLaserPowerUp');                                                     //ustawienie miniaturki
        stPos1Text = this.add.text(200, 100, "Kup Single Laser", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0)           //ustawienie nazwy
        stPos1CenaText = this.add.text(800, 125, "1000", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(1)                   //ustawienie ceny

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

        //tekst tego co kupiono
        coKupionoText = this.add.text(config.width/2, 800, "", { font: '24px PressStart2P', fill: '#ffffff' }).setOrigin(0.5)

        //wypisanie licznika punktów na górze ekranu
        scoreText2 = this.add.text(config.width / 2, config.height * 0.025, '', { font: '24px PressStart2P', fill: '#ffffff' });
        scoreText2.setOrigin(0.5);
        scoreText2.setText('Score: ' + score);
        
        //wypisanie instrukcji powrotu do gry na dole ekranu
        returnText2 = this.add.text(config.width / 2, config.height * 0.95, '', { font: '24px PressStart2P', fill: '#ffffff' });
        returnText2.setOrigin(0.5);
        returnText2.setText("Press ESCAPE to continue!");

        //przypisanie przycisków 1-7 do zmiennych
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
        background.tilePositionY -= 0.1;
        przesunYO = storeBackground.tilePositionY
        //logika zakupów i ich wpływ na statek
        if(this.input.keyboard.checkDown(kup1, 100) && isInShop && score >= 1000)
        {
            if (playerLaserType == 1) {
                maxAmmo++;
            }
            else playerLaserType = 1;
            score-=1000
            coKupionoText.setText('Kupiono Single Laser');
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
        }
        if(this.input.keyboard.checkDown(kup2, 100) && isInShop&& score >= 2500)
        {
            playerLaserType = 2;
            score-=2500
            coKupionoText.setText('Kupiono Double Laser');
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
        }
        if(this.input.keyboard.checkDown(kup3, 100) && isInShop&& score >= 5000)
        {
            playerLaserType = 3;
            
            score-=5000
            coKupionoText.setText('Kupiono Triple Laser');
            scoreText.setText("Score: " + score)
            scoreText2.setText("Score: " + score)
        }
        if(this.input.keyboard.checkDown(kup4, 100) && isInShop&& score >= 2000)
        {
            if (maxAmmo < 97)
            {
                maxAmmo += playerLaserType;
                score-=2000
                coKupionoText.setText('Kupiono Extra Ammo');
                scoreText.setText("Score: " + score)
                scoreText2.setText("Score: " + score)
            }
        }
        if(this.input.keyboard.checkDown(kup5, 100) && isInShop&& score >= 2000)
        {
            if (shipVelocity <= 980)
            {
                shipVelocity += 20;
                score -= 2000
                coKupionoText.setText('Kupiono Extra Speed');
                scoreText.setText("Score: " + score)
                scoreText2.setText('Score: ' + score);
            }
        }
        if(this.input.keyboard.checkDown(kup6, 100) && isInShop&& score >= 10000)
        {
            if (lives < 5)
            {
                lives++;
                score-=10000
                coKupionoText.setText('Kupiono Extra Life');
                scoreText2.setText("Score: " + score)
                scoreText.setText("Score: " + score)
            livesText2.setText(lives);}
        }
        if(this.input.keyboard.checkDown(kup7, 100) && isInShop&& score >= 3000)
        {
            if (powerShotAmmo < 10) {
                {
                    powerShotAmmo++;
                    score-=3000
                    coKupionoText.setText('Kupiono PowerShot Ammo');
                    scoreText.setText("Score: " + score)
                    scoreText2.setText("Score: " + score)
                }
            }
        }
        //wyjście ze sklepu po wciśnięciu "ESCAPE"
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
var shipStartX = 450
var speed = 50
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

        this.load.spritesheet('playerExplosion', 'assets/playerExplosions.png', {
            frameWidth: 110,
            frameHeight: 110
        });
        this.load.spritesheet('powerShotjee', 'assets/powerShot.png', {
            frameWidth: 65,
            frameHeight: 65
        });
        //this.load.spritesheet() <- spritesheet dla elementów animowanych
    }

    create() {
        gameOver = false
        enemies = null;
        powrotzesklepu=false;
        isInShop=false
        //dodanie sprite'ów tła i statków
        background = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background1');
        stars2 = this.add.tileSprite(config.width / 2, config.height / 2, 0, 0, 'background2').setScale(0.75)
        ship = this.physics.add.sprite(shipStartX, config.height / 1.1, 'playerShip').setOrigin(0.5, 0.5).setScale(0.8);


        


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
            repeat: 0,
            origin: 0.5
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

        gameoverText = this.add.text(config.width/2, config.height/2.5,
            'GAME OVER',
            {
            font: "40px PressStart2P",
            fill: "#ffffff",
            align: "center"
            });
            gameoverText.setOrigin(0.5);
            gameoverText.visible = false;

            gameoverText2 = this.add.text(config.width/2, config.height*0.95,
                'Press ENTER to start again!',
                {
                font: "24px PressStart2P",
                fill: "#ffffff",
                align: "center"
                });
                gameoverText2.setOrigin(0.5);
                gameoverText2.visible = false;
        //tekst wyniku
        scoreText = this.add.text(config.width / 2, config.height * 0.025, '', { font: '24px PressStart2P', fill: '#ffffff' });
        scoreText.setOrigin(0.5);
        scoreText.setText('Score: ' + score);

        //tekst z numerem poziomu
        var levelText = this.add.text(config.width * 0.005, config.height * 0.965, '', { font: '24px PressStart2P', fill: '#00ff00' });
        levelText.setOrigin(0);
        levelText.setText('LVL: ' + level);
        background.tilePositionY += przesunYO
        //wczytanie fontu z serduszkami
        const heartFontConfig = {
            image: 'heartFont', //nazwa fontu
            width: 73, //szerokość pojedynczego znaku w foncie
            height: 13, //wysokość pojedynczego znaku w foncie
            chars: Phaser.GameObjects.RetroFont.TEXT_SET12,
            charsPerRow: 1, //ilość znaków w jednym rzędzie w pliku
            spacing: { y: 1 } // określenie odstępu między początkiem a końcem dwóch znaków
        };

        //dobry path do poziomu %3 [3, 7, 11...]
        if(level%4==3)
        {
            path = new Phaser.Curves.Path(450, -150);
            path.lineTo(450, 50);
            var max = 16;
            var h = 850 / max;
            for (var i = 0; i < max-2; i++)
            {
                if(i==13){
                    path.lineTo(450,800)
                }
                if(i==14){
                    path.lineTo(450, 900)
                }
                if (i % 2 === 0&&i!=14)
                {
                    path.lineTo(800, 50 + h * (i + 1));
                }
                if(i%2!=0 && i!=13)
                {
                    path.lineTo(100, 50 + h * (i + 1));
                }
            }
            path.lineTo(450, 950);
        }

        //dobry path do poziomu %0 [4, 8, 12...]
        if(level%4==0){
            path = new Phaser.Curves.Path(450, -150);
            path.lineTo(450,450);
            path.lineTo(500, 450)
            path.lineTo(500, 600)
            path.lineTo(350,600)
            path.lineTo(350, 300)
            path.lineTo(600, 300)
            path.lineTo(600, 800)
            path.lineTo(200, 800)
            path.lineTo(200, 100)
            path.lineTo(750, 100)
            path.lineTo(750, 932)
        }

        //dobry path do poziomu %1 [1, 5, 9...]
        if(level%4==1){
                path = new Phaser.Curves.Path(config.width/2, config.height/16);
                path.circleTo(300, true, 270);
            
        }

        //wypisanie ilości żyć na ekran
        this.cache.bitmapFont.add('heartFont', Phaser.GameObjects.RetroFont.Parse(this, heartFontConfig));
        livesText2 = this.add.bitmapText(config.width * 0.995, config.height * 0.995, 'heartFont', lives).setScale(2.25);
        livesText2.setOrigin(1);

        //generowanie przeciwników na poziomach [1, 5, 9...]
        if (level % 4 == 1)
        {
            //tworzenie grupy
            enemies = this.physics.add.group();
            enemies.enableBody = true
            enemies.physicsBodyType = Phaser.Physics.ARCADE;

            for (var i = 1; i < 49; i++) //49 to liczba przeciwników + 1
                {
                    var alien = enemies.create(config.width/2, config.height/16, 'alien1png'); //stworzenie przeciwnika we wskazanym miejscu i o zadanej teksturze
                    alien.vector=new Phaser.Math.Vector2(); //tworzenie wektora ruchu kosmity
                    this.tweens.add({                       //fizyczny syf potrzebny do ruchu kosmity po wyznaczonej ścieżce
                        targets: alien,                         //kto ma to robić
                        z: 1,                                   //typ ruchu (w dokumentacji więcej)
                        ease: 'Linear',
                        duration: 12000,                        //czas trwania
                        repeat: -1,                             //ile razy powtarzać (-1 = w nieskończoność)
                        delay: i * 250                          //opóźnienie w generowaniu kolejnych przeciwników
                    });
                }
                enemies.children.iterate(alien => {
                    alien.anims.play('alien1anim')              //niech każdy alien w grupie zacznie odgrywać animację o wskazanej nazwie
                    
                })
        }
        //generowanie przeciwników na poziomach [2, 6, 10...]
        if (level % 4 == 2)
        {
        enemies = this.physics.add.group();
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 1; i < 31; i++)
            {
                if(i>=1 && i <8)
                var alien = enemies.create(100*(i%7)+140, 140, 'alien2png');
                if(i>=8 && i <15)
                var alien = enemies.create(100*(i%7)+140, 240, 'alien2png');
                if(i>=16 && i <23)
                var alien =  enemies.create(100*(i%7)+140, 340, 'alien2png');
                if(i>=24 && i <31)
                var alien = enemies.create(100*(i%7)+140, 440, 'alien2png');
            }
            enemies.children.iterate(alien => {
                alien.anims.play('alien2anim')
            })
        }

        //generowanie przeciwników na poziomach [3, 7, 11...]
        if (level % 4 == 3)
        {
        enemies = this.physics.add.group();
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 1; i < 80; i++)
            {
                var alien = enemies.create(config.width/2, -50, 'alien3png');
                alien.vector=new Phaser.Math.Vector2();
                this.tweens.add({
                    targets: alien,
                    z: 1,
                    ease: 'Linear',
                    duration: 12000,
                    repeat: -1,
                    delay: i * 100
                });
            }
            enemies.children.iterate(alien => {
                alien.anims.play('alien3anim')
                
            })
        }
        
        //generowanie przeciwników na poziomach [4, 8, 12...]
        if (level % 4 == 0)
        {
            enemies = this.physics.add.group();
            enemies.enableBody = true
            enemies.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 1; i < 50; i++)
                {
                    var alien = enemies.create(config.width/2, -50, 'alien4png');
                    alien.vector=new Phaser.Math.Vector2();
                    this.tweens.add({
                        targets: alien,
                        z: 1,
                        ease: 'Linear',
                        duration: 12000,
                        repeat: -1,
                        delay: i * 100
                    });
                }
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

        //inicjowanie grup/zbiorów/kolekcji itemów
        bullets = new Bullets(this);
        enemyBullets = new EnemyBullets(this);
        bonusses = new Bonusses(this);
        powerShots = new PowerShots(this);
        
        // game.debugShowBody(bullets)
        // game.debugShowBody(enemies)

        //implementacja kolizji
        this.physics.add.overlap(ship, enemyBullets, bulletHitsPlayer, null, this);
        this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        this.physics.add.overlap(powerShots, enemies, powerShotHitsEnemy, null, this);
        this.physics.add.overlap(ship, bonusses, shipCollectsBonus, null, this);
        
    }

    update(time, delta) {


        timeFromTextBlink3 +=delta
        timeFromLastShot += delta;
        pauseTimer += delta;
        
        isGamePaused = false;
        if(pauseTimer >= 1500){
            canPause=true;
        }
        
        //jeżeli na planszy [2, 6, 10...] jest dużo wrogów to niech przesuwają się w bok (w prawo)
        if(enemies.countActive()>=14 && level%4==2){
            enemies.children.each(function(enemy) {
                enemy.body.setVelocity(speed, 0);
                if(enemy.x>=932){               //jak wyjdą za daleko w bok
                    enemy.x=-32                 //to niech się wrócą z drugiej stronę
                }
            }, this);
        }

        //logika podążania kosmitów za ścieżką
        if(enemies.countActive() >= 0 && (level%4==3 || level%4==0 || level%4==1) ){
            var el = enemies.getChildren()
            for (var i = 0; i < el.length; i++)
            {
                var t = el[i].z;
                var vec = el[i].vector;
        
                path.getPoint(t, vec);
                el[i].setPosition(vec.x, vec.y);
                el[i].setDepth(el[i].y);
            }
        }

        //logika podążania kosmitów za graczem
        if(enemies.countActive() < 14 && level%4!=3 && level%4!=0 && level%4!=1)
        {
            enemies.children.each(function(enemy) {
                const dx = ship.x - enemy.x;
                const dy = ship.y - enemy.y;
                if(enemy.y<450) //kosmita podąża za graczem do pewnej wysokości, potem trzyma kurs
                {
                    const angle = Math.atan2(dy, dx);
                    enemy.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * 200);
                }
                if(enemy.y>932)
                {
                    enemy.y=-32 // kiedy wyleci poza mapę na dole to wraca na górze
                }
            }, this);
        }

        //kiedy poziom się zakończy
        if (enemies.countActive() == 0) {
            levelRestartTimer+=delta
            levelFinishText1 = this.add.text(config.width / 2, config.height / 2, '', { font: '24px PressStart2P', fill: '#ffffff' });
            levelFinishText1.setOrigin(0.5);
            levelFinishText1.setText("Level " + level + " complete!");
            var tempLvl = 1+level
            if(levelRestartTimer>2000)
            {
                levelFinishText2 = this.add.text(config.width / 2, config.height / 2 + 50, '', { font: '24px PressStart2P', fill: '#ffffff' });
                levelFinishText2.setOrigin(0.5);
                levelFinishText2.setText("Level " + tempLvl + "! Get ready!");
            }
            if(levelRestartTimer>3500)
            {level++
                levelFinishText1.setText("")
                levelRestartTimer=0
                if(!powrotzesklepu)
                {
                    shipStartX = ship.x
                    this.scene.restart();}
                if(level%4==1 && level!=1 && !isInShop){ //do sklepu co czwarty poziom
                    
                    this.scene.pause("GamePlay");
                    this.scene.launch("StoreScene");
                }
            }
            
        }

        //przesuwanie tła i zerowanie prędkości statku gracza kiedy nie ma inputa
        background.tilePositionY -= 0.1;
        przesunYO = background.tilePositionY
        stars2.tilePositionY -= 0.4;
        ship.body.velocity.x = 0;

        //czytanie inputa i sterowanie statkiem
        if (cursors.left.isDown && ship.body.x >= 0) {
            ship.body.velocity.x = -shipVelocity;
        } else if (cursors.right.isDown && ship.body.x < config.width - ship.body.width) {
            ship.body.velocity.x = shipVelocity;
        }

        //pauza gry po wciśnięciu "P"
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey('P'), 100) && isGamePaused==false && pauseTimer >= 1500 && canPause == true)
        {
            pauseTimer = 0;
            isGamePaused = true;
            //console.log("isGamePaused: " + isGamePaused)
            this.scene.pause("GamePlay");
            this.scene.launch("PauseScene");
        }
        if (!pauseButton.isDown) {canPause = false}

        //strzał główny
        if (fireButton.isDown && timeFromLastShot >= shotDelta && canShoot && isAlive && !gameOver) {
            console.log("STRZAŁ")
            bullets.fireBullet(ship.x, ship.y * 0.95);
            canShoot = false;
        }
        if (!fireButton.isDown) { canShoot = true }

        //powerShot (strzał alternatywny)
        if (powerShotButton.isDown && canShootPowerShot && isAlive && !gameOver) {
            powerShots.getPowerShot(ship.x, ship.y * 0.95);
            canShootPowerShot = false;
        }
        if (!powerShotButton.isDown) { canShootPowerShot = true }

        enemies.children.each(function(enemy)
        {
            enemyShotTimer += delta;
            enemyShotDelta = Math.random()*maxEnemyShotDelta+minEnemyShotDelta
        //     //strzał przeciwników
            if (enemyShotTimer >= enemyShotDelta && enemyCanShoot) 
            {
                enemyShotTimer = 0
                if(enemy.x != 450 && level%4!=0 && enemy.active)
                {
                    enemyBullets.fireBullet(enemy.x, enemy.y * 1.05);
                }
                else if(level%4==0 && enemy.active)
                {
                    enemyBullets.fireBullet(enemy.x, enemy.y * 1.05);
                }
                enemyCanShoot = false;
            }
            if (enemyShotTimer >= enemyShotDelta) 
                { enemyCanShoot = true }
        }, this);
        //console.log("spawnProtectionTimer" + spawnProtectionTimer)
        if(isAlive==true && spawnProtectionTimer > 0 && !gameOver){
            spawnProtectionTimer-=delta
            ship.body.setEnable(true)
            ship.body.active = true
            ship.visible=true
        }
        if(isAlive==true && spawnProtectionTimer == 0){
        }
        if(isAlive == false && respawnTimer < 1500){
            respawnTimer+=delta
            
        }
        if(isAlive == false && respawnTimer >= 1500){
            respawnTimer=0
            isAlive = true
        }
        if(lives<0){
            gameOver = true
            gameoverText.visible=true
            if(timeFromTextBlink3 > textBlinkingDelta)
            {
                timeFromTextBlink3=0
                gameoverText2.visible = !gameoverText2.visible
            }
            if(this.input.keyboard.checkDown(this.input.keyboard.addKey('ENTER'), 100)){
                //reset parametrów gry do wartości domyślnych
                timeFromLastShot = 0;                       //czas od ostatniego strzału
                shotDelta = 200;                            //różnica czasowa między strzałami
                canShoot = true;                            //zmienna po to, żeby jedno kliknięcie strzelało tylko jeden raz, a nie full
                canShootPowerShot = true;                   //zmienna po to, żeby jedno kliknięcie strzelało strzałem specjalnym tylko jeden raz, a nie full
                maxAmmo = 12;                               //primary ammo (default: 2, debug: 12)
                shipVelocity = 500;                         //prędkość poruszania się statku (default: 100, debug: 500)
                score = 0;                                  //wynik gracza
                lives = 2;                                  //ilość żyć gracza
                level = 1;                                  //numer planszy
                powerShotAmmo = 5;                          //amunicja broni specjalnej
                playerLaserType = 1;                        //typ lasera gracza (Panie Areczku, playerLaserType=3 jest dla developerów. Dla pana jest playerLaserType=1)
                randomDropChance = 2;                       //szansa na drop bonusu z przeciwnika (0-100%)
                scoreForEnemy = 100                         //punkty za zestrzelenie wroga
                enemyLaserType = 1
                maxEnemyShotDelta = 15000
                enemyShotDelta = 0
                minEnemyShotDelta = 10000
                //i restart gry
                this.scene.restart()
            }
        }
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

//logika trafienia powerShotem w przeciwnika
function powerShotHitsEnemy(powerShot, enemy) {

    const temp = this.add.sprite(enemy.x, enemy.y)
    temp.anims.play('kill');

    let tempX, tempY;
    tempX = enemy.x
    tempY = enemy.y

    enemy.body.enable = false;
    enemies.killAndHide(enemy)

    //  Increase the score
    score += scoreForEnemy;
    scoreText.setText('Score: ' + score);

    dropRandomBonus(tempX, tempY)
}

//logika losowych dropów
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

//logika trafienia przeciwnika zwykłym pociskiem
function bulletHitsEnemy(bullet, enemy) {
    
    //console.log("HIT")
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
    score += scoreForEnemy;
    scoreText.setText('Score: ' + score);

    dropRandomBonus(tempX, tempY)

}

//logika trafienia gracza pociskiem
function bulletHitsPlayer(xd, enemyBullet) {
    if(spawnProtectionTimer <= 0)
    {
        //console.log("HIT")
        //ship.body.setVisible(false);
        //ship.body.setActive(false);
        //ship.body.setEnable(false);
        ship.body.setEnable(false)
        ship.body.active = false
        ship.visible=false
        console.log("ship.body.visible: " + ship.visible)
        const temp = this.add.sprite(ship.x, ship.y)
        temp.anims.play('playerKill');
        
        enemyBullet.body.setEnable(false)
        // enemyBullet.body.setVisible(false)
        enemyBullets.killAndHide(enemyBullet)

        if(playerLaserType>1)
        {
            playerLaserType--
            bullets = new Bullets(this)
            this.physics.add.overlap(bullets, enemies, bulletHitsEnemy, null, this);
        }

        let tempX, tempY;
        tempX = ship.x
        tempY = ship.y

        isAlive = false;

        //  Increase the score
        lives--;
        if(lives>-1)
            livesText2.setText(lives);
        else {//tutaj end game screen
            isAlive=false
        }
        spawnProtectionTimer = 3000
    }
        
        
    
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
