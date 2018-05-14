window.addEventListener("load",function() {


// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` component.
    var Q = window.Q = Quintus({audioSupported: ['wav', 'mp3', 'ogg']})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({width: 220, height: 480})
        // And turn on default input controls and touch input (for UI)
        .controls().touch()
        // Enable sounds.
        .enableSound();

    Q.scene("level1",function(stage) {
        
        //var player = stage.insert(new Q.Player());
        stage.insert(new Q.Background(this));
        stage.insert(new Q.Player(this));
        //stage.insert(new Q.Repeater({ asset: "test.png"}));
        //stage.add("viewport").follow(player);
    });

    Q.load("test.png, airplane.png, airplane.json", function() {
        Q.compileSheets("airplane.png", "airplane.json");


        Q.animations("player_anim", {
            "stand": { frames: [1], rate: 1 / 10, loop: false },
            "loop": { frames: [11, 12, 13, 14, 15, 16, 17, 18, 1], rate: 1 / 10, loop: false }
        });

        Q.stageScene("level1");
    });

    Q.Sprite.extend("Background",{
        init: function(p) {

            this._super(p, {
                asset: "test.png",
                x: 110,
                y: -300,
                vy: 10
            });
        },
        step: function(dt) {
            this.p.y += this.p.vy * dt;
        }
    });

    Q.Sprite.extend("Player", {
        init: function(p){
            this._super(p, {
                sprite: "player_anim",
                sheet: "player",
                x: 200,
                y: 0
            });

            this.add("2d, platformerControls, animation");
        },

        step: function(dt){
                this.play("stand");
        }

    });

    /*Q.animations("player_anim", {
        "stand": { frames: [1], rate: 1 / 10, loop: false },
        "loop": { frames: [11, 12, 13, 14, 15, 16, 17, 18, 1], rate: 1 / 10, loop: false }
    });*/
});

