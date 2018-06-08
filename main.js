window.addEventListener("load", function() {


    // Set up an instance of the Quintus engine  and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` component.
    var Q = window.Q = Quintus({ audioSupported: ['mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({ width: 220, height: 480 })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()
        // Enable sounds.
        .enableSound();

    Q.scene("level1", function(stage) {
        Q.audio.play("intro_sound.mp3");
        stage.insert(new Q.Player_Ini(this));

        /*
        stage.insert(new Q.Enemy1(this, 100, 400));
        stage.insert(new Q.Enemy2(this, 220, 50));
        stage.insert(new Q.Enemy3(this, 0, 0));
        //stage.insert(new Q.Enemy7(this, 0, 240, true)); //Hacia la derecha
        stage.insert(new Q.Enemy7(this, 220, 240, false)); //Hacia la izquierda
        */
    });

    var level1 = [
        // Start,   End, Gap,  Type,   Override
        //[0, 500, 500, 'Boss', {x: 0, y:200}]
        [3500, 5500, 500, 'Enemy3', { x: 0, y: 0 }],
        [6000, 13000, 1200, 'Enemy2', { x: 220, y: 50 }],
        [10000, 13000, 1200, 'Enemy1', { x: 70, y: 470 }],
        [14000, 17000, 1200, 'Enemy1', { x: 140, y: 470 }],
        [17800, 20000, 500, 'Enemy7', { x: 220, y: 240, dir: false }],
        [18200, 20000, 500, 'Enemy3', { x: 0, y: 0 }],
        [22000, 25000, 400, 'Enemy3', { x: 0, y: 0 }],
        [29000, 29500, 500, 'Boss', { x: 0, y: 200 }]
    ];

    Q.scene("level", function(stage) {
        this.levelData = [];
        for (var i = 0; i < level1.length; i++) {
            this.levelData.push(Object.create(level1[i]));
        }
        this.t = 0;
        //this.callback = callback;
        stage.on("step", this, function(dt) {
            var idx = 0,
                remove = [],
                currentWave = null;

            // Update the current time offset
            this.t += dt * 1000;

            //   Start, End,  Gap, Type,   Override
            // [ 0,     4000, 500, 'Enemy3', { x: 0, y: 0 } ]
            while ((currentWave = level1[idx]) &&
                (currentWave[0] < this.t + 2000)) {
                // Check if we've passed the end time
                if (this.t > currentWave[1]) {
                    remove.push(currentWave);
                } else if (currentWave[0] < this.t) {
                    // Add an enemy from the current wave
                    stage.loadAssets([
                        [currentWave[3], currentWave[4]]
                    ]);
                    // Increment the start time by the gap
                    currentWave[0] += currentWave[2];
                }
                idx++;
            }

            // Remove any objects from the levelData that have passed
            for (var i = 0, len = remove.length; i < len; i++) {
                var remIdx = this.levelData.indexOf(remove[i]);
                if (remIdx != -1) this.levelData.splice(remIdx, 1);
            }

            // If there are no more enemies on the board or in
            // levelData, this level is done
            /*if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
                if(this.callback) this.callback();
            }*/


        });

        Q.audio.stop();
        Q.audio.play("intro_sound.mp3");
        stage.insert(new Q.Player_Ini(this));
    });

    Q.scene("background", function(stage) {
        stage.insert(new Q.Background(this));
    });

    Q.load("levelCompleto.png, airplane.png, airplane.json, sprites.json, enemies.png, anim.png, anim.json, boss.png, boss.json, " +
        "music_main.mp3, shot_effect.mp3, explosion_effect.mp3, intro_sound.mp3, 1942.png",
        function() {
            Q.compileSheets("airplane.png", "airplane.json");
            Q.compileSheets("enemies.png", "sprites.json");
            Q.compileSheets("anim.png", "anim.json");
            Q.compileSheets("boss.png", "boss.json");

            Q.animations("player_anim", {
                "stand": { frames: [0], rate: 1 / 10, loop: false },
                "loop": { frames: [9, 10, 11, 15, 16], rate: 1 / 2, loop: false },
                "up": { frames: [10, 11], rate: 2, loop: false },
                "back": { frames: [12], rate: 1, loop: false },
                "down": { frames: [13, 16], rate: 1, loop: false },
                "up2": { frames: [10, 16], rate: 1, loop: false }
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
                "down_left_1": { frames: [15, 14, 13], rate: 1, loop: false },
                "left": { frames: [12], rate: 1, loop: false },
                "up_left_1": { frames: [11, 10, 9], rate: 1, loop: false },
                "up": { frames: [8], rate: 1, loop: false },
                "up_right_1": { frames: [7, 6, 5], rate: 1, loop: false },
                "right": { frames: [4], rate: 1, loop: false },
                "down_right_1": { frames: [3, 2, 1], rate: 1, loop: false },
                "down": { frames: [0], rate: 1, loop: false },
                "down_right_2": { frames: [1, 2, 3], rate: 1, loop: false },
                "up_right_2": { frames: [5, 6, 7], rate: 1, loop: false },
                "up_left_2": { frames: [9, 10, 11], rate: 1, loop: false },
                "down_left_2": { frames: [13, 14, 15], rate: 1, loop: false }
            });

            Q.animations("pow_anim", {
                "P1": { frames: [0], rate: 1 / 2, loop: false },
                "P2": { frames: [1], rate: 1 / 3, loop: false },
                "P3": { frames: [2], rate: 1 / 2, loop: false },
                "P4": { frames: [3], rate: 1 / 2, loop: false }
            })

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

            Q.stageScene("mainTitle");

        });

    Q.SPRITE_NONE = 0;
    Q.SPRITE_PLAYER = 1;
    Q.SPRITE_ENEMY = 2;

    Q.Sprite.extend("Background", {
        init: function(p) {

            this._super(p, {
                asset: "levelCompleto.png",
                x: 110,
                y: -750,
                vy: 20
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
                x: 125,
                y: 435,
                gravity: 0,
                speed: 80,
                vida: 3,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_PLAYER,
                fireTime: 0,
                canFire: true,
                isLooping: false,
                pow: 0,
                loopTime: 0,
                lifes: 2
            });

            this.add("2d, animation");
            Q.input.on("fire", this, "shoot");
            this.on("hit", this, "collision");
            Q.input.on("action", this, "dodge");
        },

        step: function(dt) {
            this.stage.collide(this);

            if (!this.p.isLooping)
                this.play("stand");
            else {
                this.p.loopTime += dt;
                if (this.p.loopTime > 1.2) {
                    this.p.isLooping = false;
                    this.p.loopTime = 0;
                }
            }

            var p = this.p;

            if (!this.p.canFire) {
                this.p.fireTime += dt;
                if (this.p.fireTime >= 0.1) {
                    this.p.canFire = true;
                    this.p.fireTime = 0;
                }
            }

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
            if (this.p.canFire) {
                this.p.canFire = false;

                if (this.p.pow < 1) {
                    this.stage.insert(new Q.Simple_Bullet_Player({ x: this.p.x, y: this.p.y - this.p.h, vy: -100 }));
                } else {
                    this.stage.insert(new Q.Bullet_Player({ x: this.p.x, y: this.p.y - this.p.h, vy: -100 }));
                }

                Q.audio.play("shot_effect.mp3");
            }
        },

        dodge: function() {
            if (!this.p.isLooping) {
                this.p.isLooping = true;
                this.play("loop");
            }
        },



        collision: function(col) {
            if (!this.p.isLooping && col.obj.isA("Bullet_Enemy")) {
                col.obj.destroy();
                this.p.vida--;
                if (this.p.vida == 0) {
                    this.p.lifes--;
                    Q.audio.play("explosion_effect.mp3");
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 }));
                    this.destroy();

                    if (this.p.lifes > 0) {
                        Q.clearStages();
                        Q.stageScene("background", 0);
                        Q.stageScene("level", 1);
                        Q.stageScene("HUD", 2);
                        Q.state.inc("lifes", -1);
                    }
                }
            } else if (col.obj.isA("Pow")) {
                col.obj.destroy();
                this.p.pow++;
            }
        }

    });

    Q.Sprite.extend("Player_Ini", {
        init: function(p) {
            this._super(p, {
                sprite: "player_anim",
                sheet: "player",
                x: 125,
                y: 435,
                gravity: 0,
                vy: 70,
                back: 2
            });

            this.add("animation");
        },
        step: function(dt) {
            if (this.p.back !== 0) {
                this.play("stand");

                this.p.y -= this.p.vy * dt;

                if (this.p.back !== 1) {
                    if (this.p.y > 345 && this.p.y < 355) {
                        this.play("up");
                    } else if (this.p.y < 345) {
                        this.p.back = 0;
                    }
                } else {
                    if (this.p.y > 410 && this.p.y < 405) {
                        this.play("up2");
                    } else if (this.p.y < 270 && this.p.y > 265) {
                        Q.audio.play("music_main.mp3", { loop: true });
                        this.stage.insert(new Q.Player({ x: this.p.x, y: this.p.y }));
                        this.destroy();
                    }
                }
            } else {
                this.play("back");
                this.p.y += this.p.vy * dt;

                if (this.p.y > 355 && this.p.y < 365) {
                    this.play("back");
                } else if (this.p.y > 410 && this.p.y < 415) {
                    this.play("down");
                    this.p.back = 1;
                }
            }
        }
    });

    Q.Sprite.extend("Pow", {
        init: function(p) {
            this._super(p, {
                sheet: "pow",
                sprite: "pow_anim",
                gravity: 0
            });

            this.add("animation");
        },
        step: function(dt) {
            this.play("P1");
        }
    });

    Q.Sprite.extend("Bullet_Player", {
        init: function(p) {
            this._super(p, {
                sheet: "bullet_player",
                sprite: "bullet_player",
                gravity: 0
            });
        },
        step: function(dt) {
            this.p.vy -= 3;
            this.p.y += this.p.vy * dt;

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
            }
        }
    });

    Q.Sprite.extend("Simple_Bullet_Player", {
        init: function(p) {
            this._super(p, {
                sheet: "simple_bullet_player",
                sprite: "simple_bullet_player",
                gravity: 0
            });
        },
        step: function(dt) {
            this.p.vy -= 3;
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
            this.p.vy -= 1;
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

            this.add("animation, defaultEnemy");
            this.onCollission();

        },

        step: function(dt) {
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

            this.add("animation, defaultEnemy");
            this.onCollission();
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

            this.add("animation, defaultEnemy");
            this.onCollission();
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

        }

    });

    Q.Sprite.extend("Enemy7", {
        init: function(p, posX, posY, dirR) {
            this._super(p, {
                sprite: "enemy7_anim",
                sheet: "enemy7",
                x: posX,
                y: posY,
                gravity: 0,
                type: Q.SPRITE_ENEMY,
                t: 0,
                count: 0,
                down: false,
                dir: dirR
            });

            this.add("animation, defaultEnemy");
            this.onCollission();
        },

        step: function(dt) {
            this.stage.collide(this);

            this.p.t += dt;

            if (this.p.count < 7) {
                if (!this.p.dir) {
                    this.p.vx = (-50) * Math.sin(1 * this.p.t + 0);
                    this.p.vy = 50 * Math.sin(1 * this.p.t + Math.PI / 2);
                } else {
                    this.p.vx = 50 * Math.sin(1 * this.p.t + 0);
                    this.p.vy = (-50) * Math.sin(1 * this.p.t - Math.PI / 2);
                }


                this.p.x += this.p.vx * dt;
                this.p.y += this.p.vy * dt;

                if (!this.p.dir) {
                    if (this.p.y > 240) {
                        if (this.p.x < 220 && this.p.x > 180) {
                            this.play("down_left_1");
                        } else if (this.p.x < 180 && this.p.x > 175) {
                            this.play("left");
                            this.p.count++;
                        } else if (this.p.x < 175 && this.p.x > 125) {
                            this.play("up_left_1");
                        } else if (this.p.x < 125 && this.p.x > 120) {
                            this.play("up");
                        }
                    } else {
                        if (this.p.x < 220 && this.p.x > 180) {
                            this.play("down_right_1");
                        } else if (this.p.x < 180 && this.p.x > 175) {
                            this.play("right");
                        } else if (this.p.x < 175 && this.p.x > 125) {
                            this.play("up_right_1");
                            this.p.down = true;
                        } else if (this.p.x < 125 && this.p.x > 120 && this.p.down) {
                            this.play("down");
                            this.p.down = false;
                        }
                    }
                } else {
                    if (this.p.y > 240) {
                        if (this.p.x < 40 && this.p.x > 0) {
                            this.play("down_right_2");
                        } else if (this.p.x < 45 && this.p.x > 40) {
                            this.play("right");
                            console.log(this.p.x);
                            this.p.count++;
                        } else if (this.p.x < 95 && this.p.x > 45) {
                            this.play("up_right_2");
                        } else if (this.p.x < 100 && this.p.x > 95) {
                            this.play("up");
                        }
                    } else {
                        if (this.p.x < 100 && this.p.x > 60) {
                            this.play("up_left_2");
                        } else if (this.p.x < 55 && this.p.x > 60) {
                            this.play("left");
                        } else if (this.p.x < 55 && this.p.x > 5) {
                            this.play("down_left_2");
                        } else if (this.p.x < 5 && this.p.x > 0) {
                            this.play("down");
                        }
                    }
                }
            } else {
                this.p.x += this.p.vx * dt;
            }

            if (this.p.y > Q.height || this.p.y < 0 || this.p.x > Q.width || this.p.x < 0) {
                this.destroy();
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
                tiempoDisparo: 0,
                contador: 0,
                inmune: true,
                collisionMask: Q.SPRITE_DEFAULT,
                type: Q.SPRITE_ENEMY,
                stand: false,
                health: 60
            });
            this.add("animation");
            this.on("hit", this, "collision");

        },

        step: function(dt) {
            this.stage.collide(this);

            this.p.tiempo += dt;
            this.p.tiempoDisparo += dt;

            if (this.p.tiempo < 5 && this.p.inmune) {
                this.p.x += this.p.vx * dt;
            } else {
                this.p.inmune = false;
                if (this.p.tiempoDisparo > 0.5) {

                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x, y: 200, vy: -100, direccion: "abajo" }));
                    let r1 = Math.floor((Math.random() * 120) + 1) - 59;
                    let r2 = Math.floor((Math.random() * 120) + 1) - 59;
                    // if (this.p.tiempo < 2) {
                    //     this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x - 40, y: 200, vy: -100, direccion: "abajo" }));
                    //     this.p.contador++;
                    // } else {
                    //     this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x + 40, y: 200, vy: -100, direccion: "abajo" }));
                    // }
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x + r1, y: 200, vy: -100, direccion: "abajo" }));
                    this.stage.insert(new Q.Bullet_Enemy({ x: this.p.x + r2, y: 200, vy: -100, direccion: "abajo" }));

                    if (this.p.tiempo > 4)
                        this.p.contador++;

                    if (this.p.contador >= 4) {
                        this.p.tiempo = 0;
                        this.p.contador = 0;
                    }
                    this.p.tiempoDisparo = 0;

                }

            }
        },

        collision: function(col) {
            if (col.obj.isA("Bullet_Player")) {
                if (!this.p.inmune)
                    this.p.health -= 10;
                if (this.p.health <= 0) {
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: (this.p.y - this.p.w / 2) + 80 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: (this.p.y - this.p.w / 2) + 80 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: (this.p.y - this.p.w / 2) + 80 }));

                    this.destroy();
                }
                col.obj.destroy();
            } else if (col.obj.isA("Player")) {
                this.stage.insert(new Q.Explosion_P({
                    x: this.p.x,
                    y: this.p.y - this.p.w / 2
                }));
                col.obj.destroy();
            } else if (col.obj.isA("Simple_Bullet_Player")) {
                if (!this.p.inmune)
                    this.p.health -= 5;
                if (this.p.health <= 0) {
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: 200 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: (this.p.y - this.p.w / 2) + 40 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: (this.p.y - this.p.w / 2) + 80 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x + 40, y: (this.p.y - this.p.w / 2) + 80 }));
                    this.stage.insert(new Q.Explosion_P({ x: this.p.x - 40, y: (this.p.y - this.p.w / 2) + 80 }));

                    this.destroy();
                }
                col.obj.destroy();
            }
        }
    });

    Q.component("defaultEnemy", {
        extend: {
            onCollission: function() {
                this.on("hit", function(col) {
                    if (col.obj.isA("Bullet_Player") || col.obj.isA("Simple_Bullet_Player")) {
                        this.stage.insert(new Q.Explosion({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //ESTO ANTES ESTABA COMENTADO
                        Q.state.inc("score", 50);

                        if (Q.state.get("score") === 500) {
                            this.stage.insert(new Q.Pow({ x: this.p.x, y: this.p.y - this.p.w / 2 }));
                        }

                        this.destroy();
                        col.obj.destroy();
                    } else if (col.obj.isA("Player")) {
                        Q.audio.play("explosion_effect.mp3");
                        this.stage.insert(new Q.Explosion_P({ x: this.p.x, y: this.p.y - this.p.w / 2 })); //Hay que llamar a la animacion de la explosión
                        this.destroy();
                        col.obj.destroy();
                        if (Q.state.get("lifes") > 0) {
                            Q.clearStages();
                            Q.stageScene("background", 0);
                            Q.stageScene("level", 1);
                            Q.stageScene("HUD", 2);
                            Q.state.inc("lifes", -1);
                        }
                    }
                });
            }
        }
    })

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

    Q.UI.Text.extend("Score", {
        init: function(p) {
            this._super({
                label: "Score: 0",
                align: "left",
                x: 0,
                y: 0,
                color: "white",
                family: "ARCADECLASSIC"
            });

            Q.state.on("change.score", this, "score");
        },

        score: function(score) {
            this.p.label = "Score: " + score;
        }
    });

    Q.UI.Text.extend("Life", {
        init: function(p) {
            this._super({
                label: "R: " + Q.state.get("lifes"),
                align: "right",
                x: 200,
                y: 0,
                color: "white",
                family: "ARCADECLASSIC"
            });

            Q.state.on("change.lifes", this, "life");
        },

        life: function(lifes) {
            this.p.label = "R: " + lifes;
        }
    });

    Q.scene("HUD", function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: 10,
            y: 0
        }));
        stage.insert(new Q.Score(), container);
        stage.insert(new Q.Life(), container);
        container.fit(20);
    }, { stage: 2 });

    Q.scene("mainTitle", function(stage) {
        var container = stage.insert(new Q.UI.Container({ x: Q.width, y: Q.height }));
        var button = container.insert(new Q.UI.Button({ x: -Q.width / 2, y: -Q.height / 2, fill: "#CCCCCC", asset: "1942.png" }));
        var label = stage.insert(new Q.UI.Text({ x: 110, y: 260, label: "Click  to  start", size: 15, color: "white", family: "ARCADECLASSIC" }));
        Q.audio.play("music_main.mp3", { loop: true });

        button.on("click", function() {
            Q.clearStages();
            Q.state.reset({
                score: 0,
                lifes: 2
            });
            Q.stageScene("background", 0);
            Q.stageScene("level", 1);
            Q.stageScene("HUD", 2);

        });
        container.fit(20);
    });

});