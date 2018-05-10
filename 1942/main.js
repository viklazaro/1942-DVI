window.addEventListener("load",function() {


// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` component.
    var Q = window.Q = Quintus({audioSupported: ['wav', 'mp3', 'ogg']})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({width: 220})
        // And turn on default input controls and touch input (for UI)
        .controls(true).touch()
        // Enable sounds.
        .enableSound();

    Q.scene("level1",function(stage) {
        stage.insert(new Q.Background(this));
        //stage.insert(new Q.Repeater({ asset: "test.png"}));
        //stage.add("viewport");
    });

    Q.load("test.png", function() {
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
});

