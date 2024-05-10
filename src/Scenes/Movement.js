class GroupBullet extends Phaser.Scene {
    constructor() {
        super("groupBullet");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.maxBullets = 10;
        this.myScore = 0;
        this.my.sprite.smallenemy = [];
        this.playerHealth = 3;
        this.my.sprite.enemyBullets = [];
        this.maxEnemyBullets = 20000;
        


        this.update = this.update.bind(this);
        
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "ship_0001.png");
        this.load.image("playerbullet", "tile_0000.png");
        this.load.image("enemybullet", "tile_0003.png");
        this.load.image("smallenemy", "ship_0019.png")
        this.load.image("bigenemy", "ship_0002.png")
        this.load.image("explosion1", "tile_0007.png");
        this.load.image("explosion2", "tile_0008.png");
        this.load.audio("shoot", "footstep_carpet_000.ogg");
        this.load.audio("boom", "footstep_carpet_001.ogg");
        this.load.image("Red5image", "tiles_packed.png");    
        this.load.tilemapTiledJSON("map", "Red5.json");  
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");                 
    }

    create() {
        let my = this.my;
        this.init_game();
        this.map = this.add.tilemap("map", 16, 16, 50, 38);
        

        this.tileset = this.map.addTilesetImage("Red5", "Red5image");

        this.grassLayer = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(1.5);
        

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        

        this.anims.create({
            key: "explosion",
            frames: [
                { key: "explosion1" },
                { key: "explosion2" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 10;
        this.bulletSpeed = 20;

        let path1 = [[-10, -10], [300, 350], [830, 337]];
        let path2 = [[26,34],[38,52],[68,70],[89,74],[146,70],[186,46],[227,38],[304,75],[333,113],[335,156],[311,216],[257,267],[173,268],[121,250],[108,204],[153,135],[199,119],[248,109],[295,102],[343,78],[382,62],[442,54],[488,60],[529,75],[556,99],[598,165],[625,225],[612,266],[561,292],[507,290],[456,259],[446,211],[478,161],[520,139],[560,130],[605,97],[653,75],[769,88],[819,108],[880,162],[861,245],[822,287],[743,302],[706,269],[742,193],[782,159],[825,143],[862,121],[884,104],[954,161],[1000,159],]
        let path3 = [[830, 337], [300, 350], [-10, -10]];

        this.time.addEvent({
            delay: 2000, 
            callback: () => this.spawnEnemy(path1, 2000, 'smallenemy', 0.5, -1, false, true, -90, 400, 1),
            callbackScope: this,
            loop: true
        });
            
        this.time.addEvent({
                delay: 10000, 
                callback: () => this.spawnEnemy(path2, 2000, 'bigenemy', 0.5, -1, false, true, -90, 400, 3),
                allbackScope: this,
                loop: true
            }); 
            

        this.time.addEvent({
            delay: 3000, 
            callback: () => this.spawnEnemy(path3, 2000, 'smallenemy', 0.5, -1, false, true, -90, 400, 1),
            callbackScope: this,
            loop: true
        });

        document.getElementById('description').innerHTML = '<h2>Game Object Group Bullet.js</h2><br>A: left // D: right // Space: fire'

        my.text.score = this.add.bitmapText(530, 0, "rocketSquare", "Score " + this.myScore);
        my.text.health = this.add.bitmapText(10, 20, "rocketSquare", "Health: " + this.playerHealth);


    }

    spawnEnemy(pathPoints, duration, spriteKey, scale, repeat, yoyo, rotateToPath, rotationOffset,shootingInterval, health) {
        let my = this.my; // Ensure you have access to the `my` scope if it's defined elsewhere
       
       let curve = new Phaser.Curves.Spline(pathPoints);
   
       let smallenemy = this.add.follower(curve, curve.points[0].x, curve.points[0].y, spriteKey);
       smallenemy.setScale(2);
       smallenemy.visible = true;
       smallenemy.scorePoints = 25;
       smallenemy.health = health;

       smallenemy.lastShotTime = 0; // Initialize last shot time
       smallenemy.shootingInterval = shootingInterval; // Milliseconds between shots
   
       smallenemy.startFollow({
           duration: 10000,
           ease: 'Sine.easeInOut',
           repeat: repeat,
           yoyo: yoyo,
           rotateToPath: rotateToPath,
           rotationOffset: rotationOffset,
           onStart: () => {
            this.shootBulletFromEnemy(smallenemy); // Shoot immediately as it starts following the path
            this.scheduleShooting(smallenemy); 
           },
           onComplete: () => {
               smallenemy.destroy();
           }
       });
   
       this.my.sprite.smallenemy.push(smallenemy);
    }

    scheduleShooting(enemy) {
        console.log ("FUCKKK");
        this.time.addEvent({
            delay: smallenemy.shootingInterval,
            callback: () => {
                if (enemy.active) { 
                    this.shootBulletFromEnemy(enemy);
                    this.scheduleShooting(enemy); // Reschedule the next shot
                }
            },
            callbackScope: this
        });
    }

    shootBulletFromEnemy(enemy) {
    let currentTime = this.time.now; // Get current time
    if (this.my.sprite.enemyBullets.length < this.maxEnemyBullets && currentTime - enemy.lastShotTime > enemy.shootingInterval) {
        let bullet = this.add.sprite(enemy.x, enemy.y, "enemybullet");
        bullet.isActive = true;
        this.my.sprite.enemyBullets.push(bullet);
        enemy.lastShotTime = currentTime; // Update the last shot time
    }
    }


    update() {
        let my = this.my;
        this.bulletCooldownCounter--;

        my.text.health.setText("Health: " + this.playerHealth);
        this.my.sprite.enemyBullets.forEach(bullet => {
            if (this.collides(bullet, this.my.sprite.player)) {
                this.playerHealth -= 1; // Damage the player
                bullet.isActive = false; // Mark bullet as not active for removal
                bullet.destroy();
        
                if (this.playerHealth <= 0) {
                    this.scene.start("EndScreen");
                }
            }
        });

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                let newBullet = this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y - (my.sprite.player.displayHeight / 2), "playerbullet");
                my.sprite.bullet.push(newBullet);  
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
        


        // Check for collisions between bullets and enemies
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.smallenemy) {
                if (enemy && bullet && this.collides(enemy, bullet)) {
                    enemy.health--; // Reduce enemy health
                    if (enemy.health <= 0) {
                        // Start explosion animation
                        this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion2").setScale(1).play("explosion");
                        enemy.destroy();
                        // Clear out bullet -- put y offscreen, will get reaped next update
                        bullet.y = -100;
                        this.myScore += enemy.scorePoints;
                        this.updateScore();
                        this.sound.play("boom", {
                            volume: 1
                        });
                        this.my.sprite.smallenemy = this.my.sprite.smallenemy.filter(a => a !== enemy);
                    }
                    else {
                        bullet.y = -100; // Move bullet offscreen
                    }
                }
            }
        }

        this.my.sprite.smallenemy = this.my.sprite.smallenemy.filter(smallenemy => {
            if (smallenemy.x <= -50 && smallenemy.y === 742) {
                smallenemy.destroy(); 
                return false; 
            }
    
            if (smallenemy.x <= 1100 && smallenemy.y === 631) {
                smallenemy.destroy(); 
                return false; 
            }
            return true; 
        });


        this.my.sprite.smallenemy.forEach(enemy => {
            if (Math.random() < 0.01) {  // Random chance to shoot
                this.shootBulletFromEnemy(enemy);

            }
        });


        // Move enemy bullets
        this.my.sprite.enemyBullets.forEach(bullet => {
            bullet.y += 5;  // Adjust speed as necessary
        });

        // Check for collisions between enemy bullets and player
        this.my.sprite.enemyBullets.forEach(bullet => {
            if (this.collides(bullet, this.my.sprite.player)) {
                // Handle collision, e.g., reduce player health, show explosion
                bullet.destroy();  // Remove the bullet
                // Additional effects (e.g., player damage or explosion)
                this.sound.play("shoot", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
            }
        });
        this.my.sprite.enemyBullets = this.my.sprite.enemyBullets.filter(bullet => bullet.isActive);


        if (this.myScore > 2000)
            {
                this.scene.start("WinScreen");
            }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }


    init_game() {
        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullets = [];
        this.my.sprite.smallenemy = [];
        this.myScore = 0;
        this.playerHealth = 3;  // Reset player health to initial value
    }
}