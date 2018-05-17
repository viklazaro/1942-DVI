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
        stage.insert(new Q.Player(this));
        stage.insert(new Q.Enemy1(this, 100, 400));
    });

    Q.scene("background",function(stage) {
        stage.insert(new Q.Background(this));

    });

    Q.load("test.png, airplane.png, airplane.json, sprites.json, enemies.png, anim.png, anim.json", function() {
        Q.compileSheets("airplane.png", "airplane.json");
        Q.compileSheets("enemies.png", "sprites.json");
        Q.compileSheets("anim.png", "anim.json");

        Q.animations("player_anim", {
            "stand": { frames: [1], rate: 1 / 10, loop: false },
            "loop": { frames: [11, 12, 13, 14, 15, 16, 17, 18, 1], rate: 1 / 10, loop: false }
        });

        Q.animations("enemy1_anim", {
            "stand": {frames: [1], rate: 1/10, loop: false}
        });

        Q.stageScene("background", 0);
        Q.stageScene("level1", 1);

    });

    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 1;

    Q.Sprite.extend("Background",{
        init: function(p) {

            this._super(p, {
                asset: "test.png",
                x: 110,
                y: -240,
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
                x: 100,
                y: 450,
                gravity: 0,
                speed: 70,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_PLAYER
            });

            this.add("2d, animation");
            Q.input.on("fire",this,"shoot");
        },

        step: function(dt){
            this.play("stand");

            var p = this.p;

            if(this.p.x < 0)
                this.p.x = 0;
            else if(this.p.x > 220)
                this.p.x = 220;

            if(this.p.y < 0)
                this.p.y = 0;
            else if(this.p.y > 480)
                this.p.y = 480;
                    
            if (Q.inputs['left']) {
                p.vx = -p.speed;
            }else if (Q.inputs['right']) {
                p.vx = p.speed;
            }else if(Q.inputs['up']){
                p.vy = -p.speed;
            }else if(Q.inputs['down']){
                p.vy = p.speed;
            }else{
                p.vy = 0;
                p.vx = 0;
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
        }
    });

    Q.Sprite.extend("Enemy1", {
        init: function (p, posX, posY) {
            this._super(p, {
                sprite: "enemy1_anim",
                sheet: "enemy1",
                x: posX,
                y: posY,
                gravity: 0,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_ENEMY
            });

            this.add("2d, animation");
            this.on("bump.left,bump.right,bump.bottom",function(collision) {
                if(collision.obj.isA("Bullet_Player")){
                    this.destroy();
                    collision.obj.destroy();
                }
                else if(collision.obj.isA("Player")){
                    //Hay que llamar a la animacion de la explosión
                    this.destroy();
                    collision.obj.destroy();
                }
            });
        },

        step: function (dt) {
            this.play("stand");
        }

    });


   
});

