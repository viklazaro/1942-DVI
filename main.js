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
        

        stage.insert(new Q.Background(this));
        stage.insert(new Q.Player(this));
        //stage.insert(new Q.Enemy1(this)); //Si descomentas esto da error
        stage.add("viewport").follow(Q("Player").first());

    });

    Q.load("test.png, airplane.png, airplane.json, sprites.json, enemies.png, anim.png", function() {
        Q.compileSheets("airplane.png", "airplane.json");
        Q.compileSheets("enemies.png", "sprites.json");
        Q.compileSheets("anim.png", "sprites.json");

        Q.animations("player_anim", {
            "stand": { frames: [1], rate: 1 / 10, loop: false },
            "loop": { frames: [11, 12, 13, 14, 15, 16, 17, 18, 1], rate: 1 / 10, loop: false }
        });

        Q.animations("enemy1_anim", {
            "stand": {frames: [1], rate: 1/10, loop: false}
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
                x: 110,
                y: 0,
                gravity: 0,
                speed:55
            });

            this.add("2d, animation");
            Q.input.on("fire",this,"shoot");
        },

        step: function(dt){
            this.play("stand");

            var p = this.p;
                    
            if (Q.inputs['left']) {
                p.vx = -p.speed;
            }else if (Q.inputs['right']) {
                p.vx = p.speed;
            }else if(Q.inputs['up']){
                p.vy = -p.speed;
            }else if(Q.inputs['down']){
                p.vy = p.speed;
            }
        },

        shoot: function(){
            this.stage.insert(new Q.Bullet_Player({x: this.p.x, y: this.p.y- this.p.w/2, vy: -100}));
        }

    });

    Q.Sprite.extend("Bullet_Player", {
        init: function(p){
            this._super(p, {
                sheet: "bullet_player",
                sprite: "bullet_player",
                gravity: 0
            });
            
            this.add("2d");
        },
        step: function(dt){
            this.p.y += this.p.vy * dt;
        },
        sensor: function(collision){

        }
    });

    Q.Sprite.extend("Enemy1", {
        init: function (p) {
            this._super(p, {
                sprite: "enem1_anim",
                sheet: "enemy1",
                x: 110,
                y: 0,
                gravity: 0
            });

            this.add("2d, animation");
        },

        step: function (dt) {
            this.play("stand");

        }
    });

   
});

