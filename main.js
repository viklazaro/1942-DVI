window.addEventListener("load", function() {


    // Set up an instance of the Quintus engine  and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` component.
    var Q = window.Q = Quintus({ audioSupported: ['wav', 'mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({ width: 220, height: 480 })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()
        // Enable sounds.
        .enableSound();

    Q.scene("level1", function(stage) {
        stage.insert(new Q.Player(this));
        stage.insert(new Q.Enemy1(this, 100, 400));
        stage.insert(new Q.Enemy2(this, 220, 50));
        stage.insert(new Q.Enemy3(this, 0, 0));
        stage.insert(new Q.Enemy7(this, 220, 240));
    });

    Q.scene("background", function(stage) {
        stage.insert(new Q.Background(this));

    });

    Q.load("test.png, airplane.png, airplane.json, sprites.json, enemies.png, anim.png, anim.json, boss.png, boss.json", function() {
        Q.compileSheets("airplane.png", "airplane.json");
        Q.compileSheets("enemies.png", "sprites.json");
        Q.compileSheets("anim.png", "anim.json");
        Q.compileSheets("boss.png", "boss.json");

        Q.animations("player_anim", {
            "stand": { frames: [1], rate: 1 / 10, loop: false },
            "loop": { frames: [11, 12, 13, 14, 15, 16, 17, 18, 1], rate: 1 / 10, loop: false }
        });

        Q.animations("enemy1_anim", {
            //"stand": {frames: [0], rate: 1/10, loop: false},
            "up": { frames: [0], rate: 1 / 10, loop: false },
            "loop": { frames: [1, 2, 3, 4, 5, 6, 7], rate: 1 / 10, loop: false }
        });

        Q.animations("enemy2_anim", {
            "left": { frames: [0], rate: 1 / 10, loop: false }
        });

        Q.animations("enemy3_anim", {
            "down": { frames: [0], rate: 1 / 10, loop: false },
            "loop": { frames: [8, 9], rate: 1 / 2, loop: false },
            "up": { frames: [10], rate: 1 / 3, loop: false }
        });

        Q.animations("enemy7_anim", {
            "down_left": {frames: [15, 14, 13], rate: 1, loop: false},
            "left": {frames: [12], rate: 1, loop: false},
            "up_left": {frames: [11, 10, 9], rate: 1, loop: false},
            "up": {frames: [8], rate: 1, loop: false},
            "up_right": {frames: [7, 6, 5], rate: 1, loop: false},
            "right": {frames: [4], rate: 1, loop: false},
            "down_right": {frames: [3, 2, 1], rate: 1, loop: false},
            "down": {frames: [0], rate: 1, loop: false}
        });

        Q.animations("boss_anim", {
            "down": { frames: [0], rate: 1 / 10, loop: false },
            "stand": { frames: [0], rate: 1 / 10, loop: false }
        });

        Q.animations("boss_explosion_anim", {
            "explosion_boss": { frames: [0, 1, 2, 3], rate: 1 / 4, loop: false, trigger: "exploted" }
        });

        Q.animations("explosion_anim", {
            "explosion": { frames: [0, 1, 2, 3, 4, 5], rate: 1 / 3, loop: false, trigger: "exploted" }
        });

        Q.animations("explosion_anim_player", {
            "explosion_jugador": { frames: [0, 1, 2, 3, 4, 5], rate: 1 / 3, loop: false, trigger: "exploted" }
        });

        Q.stageScene("background", 0);
        Q.stageScene("level1", 1);

    });
    Q.SPRITE_NONE = 0;
    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 2;

    Q.Sprite.extend("Background", {
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
        init: function(p) {
            this._super(p, {
                sprite: "player_anim",
                sheet: "player",
                x: 100,
                y: 450,
                gravity: 0,
                speed: 70,
                vida: 3,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_PLAYER
            });

            this.add("2d, animation");
            Q.input.on("fire", this, "shoot");
            this.on("hit", this, "collision");
        },

        step: function(dt) {
            this.stage.collide(this);
            this.play("stand");

            var p = this.p;

            if (this.p.x < 0)
                this.p.x = 0;
            else if (this.p.x > 220)
                this.p.x = 220;

            if (this.p.y < 0)
                this.p.y = 0;
            else if (this.p.y > 480)
                this.p.y = 480;

            if (Q.inputs['left']) {
                p.vx = -p.speed;
            } else if (Q.inputs['right']) {
                p.vx = p.speed;
            } else if (Q.inputs['up']) {
                p.vy = -p.speed;
            } else if (Q.inputs['down']) {
                p.vy = p.speed;
            } else {
                p.vy = 0;
                p.vx = 0;
            }
        },

        shoot: function() {
            this.stage.insert(new Q.Bullet_Player({ x: this.p.x, y: this.p.y - this.p.w / 2, vy: -100 }));
        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Enemy")) {
                col.obj.destroy();
                this.p.vida--;
                if (this.p.vida == 0) {
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 }));
                    this.destroy();
                }
            }
        }

    });

    Q.Sprite.extend("Bullet_Player", {
        init: function(p) {
            this._super(p, {
                sheet: "bullet_player",
                sprite: "bullet_player",
                gravity: 0
            });

            //this.add("2d");
        },
        step: function(dt) {
            this.p.y += this.p.vy * dt;

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }
    });

    Q.Sprite.extend("Bullet_Enemy", {
        init: function(p, dir) {
            this._super(p, {
                sheet: "bullet_enemy",
                sprite: "bullet_enemy",
                gravity: 0,
                direccion: dir
            });

        },

        step: function(dt) {
            if (this.p.direccion == "arriba")
                this.p.y += this.p.vy * dt;
            else if (this.p.direccion == "abajo")
                this.p.y -= this.p.vy * dt;

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }
    });

    Q.Sprite.extend("Enemy1", { //Estos enemigos sueben hacia arriba
        init: function(p, posX, posY) {
            this._super(p, {
                sprite: "enemy1_anim",
                sheet: "enemy1",
                x: posX,
                y: posY,
                vx: 20,
                vy: 20,
                gravity: 0,
                gira: false,
                disparo: false,
                tiempo: 0,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_ENEMY
            });

            this.add("animation");
            this.on("hit", this, "collision");

        },

        step: function(dt) {
            //this.stage.insert(new Q.Bullet_Enemy({x: this.p.x, y: this.p.y- this.p.w/2, vy: -100}));

            this.stage.collide(this);

            this.p.tiempo += dt;

            if (this.p.tiempo > 0.70) {
                this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 2, vy: -100, direccion: "arriba" }));
                this.p.tiempo = 0;
            }


            if (this.p.y < Q.height / 2 && !this.p.gira) {
                this.play("loop");
                this.p.y -= this.p.vy * dt;
                this.p.gira = true;
                this.play("up");
            } else {
                this.play("up");
                this.p.y -= this.p.vy * dt;
            }

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Player")) {
                this.stage.insert(new Q.Explosion({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //ESTO ANTES ESTABA COMENTADO
                this.destroy();
                col.obj.destroy();
            } else if (col.obj.isA("Player")) {
                this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //Hay que llamar a la animacion de la explosión
                this.destroy();
                col.obj.destroy();
            }
        }

    });

    Q.Sprite.extend("Enemy2", { //Estos enemigos se mueven hacia la izquierda
        init: function(p, posX, posY) {
            this._super(p, {
                sprite: "enemy2_anim",
                sheet: "enemy2",
                x: posX,
                y: posY,
                gravity: 0,
                vx: 20,
                vy: 20,
                tiempo: 0,
                type: Q.SPRITE_ENEMY
            });

            this.add("animation");
            this.on("hit", this, "collision");
        },

        step: function(dt) {
            this.stage.collide(this);

            this.p.tiempo += dt;

            this.p.x -= this.p.vx * dt;
            if (this.p.tiempo > 0.70) {
                this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 2, vy: -100, direccion: "abajo" }));
                this.p.tiempo = 0;
            }

            this.play("left");

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Player")) {
                this.stage.insert(new Q.Explosion({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //ESTO ANTES ESTABA COMENTADO
                this.destroy();
                col.obj.destroy();
            } else if (col.obj.isA("Player")) {
                this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //Hay que llamar a la animacion de la explosión
                this.destroy();
                col.obj.destroy();
            }
        }
    });

    Q.Sprite.extend("Enemy3", { //Estos enemigos bajan por la pantalla y en cierto momento cambian su direccion y empiezan a subir por la pantalla
        init: function(p, posX, posY) {
            this._super(p, {
                sprite: "enemy3_anim",
                sheet: "enemy3",
                x: posX,
                y: posY,
                gravity: 0,
                vx: 20,
                vy: 20,
                tiempo: 0,
                type: Q.SPRITE_ENEMY,
                back: false
            });

            this.add("animation");
            this.on("hit", this, "collision");
        },

        step: function(dt) {
            this.stage.collide(this);

            this.p.tiempo += dt;

            if (this.p.y < 300 && !this.p.back) {
                this.play("down");
                if (this.p.tiempo > 0.70) {
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 2, vy: -100, direccion: "abajo" }));
                    this.p.tiempo = 0;
                }
                this.p.x += this.p.vx * dt;
                this.p.y += (this.p.vy * dt) * (this.p.vy * dt) + (this.p.vy * dt) + 1;
            } else if (this.p.y > 300 && this.p.y < 310 && !this.p.back) {
                this.p.back = true;
                this.play("loop");
            } else {
                this.play("up");
                if (this.p.tiempo > 0.70) {
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: this.p.y - this.p.w / 2, vy: -100, direccion: "arriba" }));
                    this.p.tiempo = 0;
                }
                this.p.x += this.p.vx * dt;
                this.p.y -= (this.p.vy * dt) * (this.p.vy * dt) + (this.p.vy * dt) + 1;
            }

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }

        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Player")) {
                this.stage.insert(new Q.Explosion({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //ESTO ANTES ESTABA COMENTADO
                this.destroy();
                col.obj.destroy();
            } else if (col.obj.isA("Player")) {
                this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //Hay que llamar a la animacion de la explosión
                this.destroy();
                col.obj.destroy();
            }
        }

    });

    Q.Sprite.extend("Enemy7", {
        init: function (p, posX, posY) {
            this._super(p, {
                sprite: "enemy7_anim",
                sheet: "enemy7",
                x: posX,
                y: posY,
                gravity: 0,
                type: Q.SPRITE_ENEMY,
                t: 0,
                count: 0,
                down: false
            });

            this.add("animation");
            this.on("hit", this, "collision");
        },

        step: function (dt) {  
            this.stage.collide(this);

            this.p.t += dt;

            if(this.p.count < 7){
                this.p.vx = (-50) * Math.sin(1 * this.p.t + 0);
                this.p.vy = 50 * Math.sin(1 * this.p.t + Math.PI/2);

                this.p.x += this.p.vx * dt;
                this.p.y += this.p.vy * dt;
                if(this.p.y > 240){
                    if(this.p.x < 220 && this.p.x > 180){
                        this.play("down_left");
                    }else if(this.p.x < 180 && this.p.x > 175){
                        this.play("left");
                        this.p.count++;
                    }else if(this.p.x < 175 && this.p.x > 125){
                        this.play("up_left");
                    }else if(this.p.x < 125 && this.p.x > 120){
                        this.play("up");
                    }
                }else{
                    if(this.p.x < 220 && this.p.x > 180){
                        this.play("down_right");
                    }else if(this.p.x < 180 && this.p.x > 175){
                        this.play("right");
                    }else if(this.p.x < 175 && this.p.x > 125){
                        this.play("up_right");
                        this.p.down = true;
                    }else if(this.p.x < 125 && this.p.x > 120 && this.p.down){
                        this.play("down");
                        this.p.down = false;
                    }
                }       
            }else{
                this.p.x += this.p.vx * dt;
            }  

            if(this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0){
                this.destroy();
            }

        },

        collision: function(col){
            if(col.obj.isA("Bullet_Player")){
                this.stage.insert(new Q.Explosion({x: this.p.x, y: this.p.y- this.p.w/2})); //ESTO ANTES ESTABA COMENTADO
                this.destroy();
                col.obj.destroy();
            }
            else if(col.obj.isA("Player")){
                this.stage.insert(new Q.Explosion_P({x: this.p.x, y: this.p.y- this.p.w/2}));//Hay que llamar a la animacion de la explosión
                this.destroy();
                col.obj.destroy();
            }
        }

    });

    Q.Sprite.extend("Boss", {
        init: function(p, posX, posY) {
            this._super(p, {
                sprite: "boss_anim",
                sheet: "boss",
                x: posX,
                y: posY,
                vx: 20,
                vy: 5,
                gravity: 0,
                tiempo: 0,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_ENEMY,
                stand: false,
                health: 30
            });
            this.add("animation");
            this.on("hit", this, "collision");
        },

        step: function(dt) {
            this.stage.collide(this);

            this.p.tiempo += dt;

            if (this.p.tiempo > 0.2) {
                this.stage.insert(new Q.Bullet_Enemy({
                    x: this.p.x,
                    y: this.p.y - this.p.w / 2,
                    vy: -100,
                    direccion: "random" // TODO
                }));
                this.p.tiempo = 0;
            }

            if (this.p.y < 100 && !this.p.stand) {
                this.play("down");
                this.p.x += this.p.vx * dt;
                this.p.y += (this.p.vy * dt) * (this.p.vy * dt) + (this.p.vy * dt) + 1;
            } else {
                this.play("stand");
                this.p.stand = true;
            }
        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Player")) {
                this.p.health--;
                if (this.p.health <= 0) {
                    this.stage.insert(new Q.Explosion_B({
                        x: this.p.x,
                        y: this.p.y - this.p.w / 2
                    }));
                    this.destroy();
                }
            } else if (col.obj.isA("Player")) {
                this.stage.insert(new Q.Explosion_P({
                    x: this.p.x,
                    y: this.p.y - this.p.w / 2
                }));
                col.obj.destroy();
            }
        }
    });

    Q.Sprite.extend("Explosion", {
        init: function(p) {
            this._super(p, {
                sheet: "explosion_enemy",
                sprite: "explosion_anim"
                    //collisionMask: Q.SPRITE_NONE
            });

            //this.add("2d, animation");
            this.add("animation");
            this.play("explosion");
            this.on("exploted", this, function() {
                this.destroy();
            });

        },
        step: function(dt) {

        }
    });

    Q.Sprite.extend("Explosion_P", {
        init: function(p) {
            this._super(p, {
                sheet: "explosion_player",
                sprite: "explosion_anim_player"
            });

            this.add("animation");
            this.play("explosion_jugador");
            this.on("exploted", this, function() {
                this.destroy();
            });
        }
    });

    Q.Sprite.extend("Explosion_B", {
        init: function(p) {
            this._super(p, {
                sheet: "boss",
                sprite: "boss_explosion_anim"
            });

            this.add("animation");
            this.play("explosion_boss");
            this.on("exploted", this, function() {
                this.destroy();
            })
        }
    });

});