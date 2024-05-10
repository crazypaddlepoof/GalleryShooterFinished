class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
        this.my = {sprite: {}};
        this.update = this.update.bind(this);
    }   
    
    
    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("S");


        this.add.text(325, 200, "Red5", {
            fontFamily: 'Times, serif',
            fontSize: 60,
            wordWrap: {
                width: 60
            }
        });

        this.add.text(320, 350, "Press S to Play", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 300
            }
        });


        this.add.text(300, 400, "Use A and D to move and space to Shoot", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 250
            }
        });


    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("groupBullet");
        }

    }


 }    

 