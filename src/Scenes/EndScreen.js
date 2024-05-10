class EndScreen extends Phaser.Scene {
    constructor() {
        super("EndScreen");
        this.my = {sprite: {}};
        this.update = this.update.bind(this);
        
    }   
    
    
    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("S");


        this.add.text(370, 200, "Red5", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        this.add.text(350, 300, "You lost! Press S to Try Again", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 100
            }
        });


    }

    update() {


        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("groupBullet");
        }

    }


 }    