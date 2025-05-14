const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
     
       }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
const game = new Phaser.Game(config);


function preload() {
  this.load.image("fondo","fondo.png");
  this.load.spritesheet("personaje","personaje.png", { frameWidth: 18, frameHeight: 28 });
  this.load.image("plataforma","plataforma.png");
  this.load.spritesheet("enemigo","enemigo.png", { frameWidth:193 , frameHeight: 104});
  this.load.image("estrella","estrella.png");
  this.load.image("corazon","corazon.png")
  this.load.image("bandera","bandera.png")
  this.load.audio('musicaFondo', 'AUDIO/musicaFondo.mp3');
  this.load.audio('sonidoMuerte', 'AUDIO/muerte.wav');
  this.load.audio('sonidoCaida', 'AUDIO/Caida.wav');
  this.load.audio('victoria', 'AUDIO/victoria.mp3');
}
var personaje;
var plataforma;
var fondo;
var estrella;
var enemigo;
var enemigos;
var cursors;
var plataformasMoviles;
var p1,p2,p3,p4;
var score =1;
var scoreText;
var vidas=1;
var x;
var bandera;
//creacion texto y fondo
function create() {
    
    this.add.image(400, 320, "fondo").setScale(0.8);
    let texto =this.add.text(80, 60, "Se dice que en lo más alto...", { fontSize: "30px", fill: "#FFF" });
    this.time.delayedCall(3000, () => {
         texto.destroy(); 
        }, [], this);

      // creacion plataformas
    plataforma = this.physics.add.staticGroup();
        
    plataforma.create(60,600,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(400,550,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(350,350,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(600,590,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(700,90,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(100,150,'plataforma').setScale(0.4).refreshBody();
    plataforma.create(650,250,'plataforma').setScale(0.4).refreshBody();
    //plataformas en movimiento 
    plataformasMoviles = this.physics.add.group();
    p1 = plataformasMoviles.create(200,350, 'plataforma').setScale(0.4).refreshBody();
    p2 = plataformasMoviles.create(500,200, 'plataforma').setScale(0.4).refreshBody();
    p3 = plataformasMoviles.create(730,600,'plataforma').setScale(0.4).refreshBody();
    p4 = plataformasMoviles.create(380,200,'plataforma').setScale(0.4).refreshBody();

    p1.body.allowGravity = false;
    p2.body.allowGravity = false;
    p3.body.allowGravity = false;
    p4.body.allowGravity = false;

    p1.setImmovable(true);
    p2.setImmovable(true);
    p3.setImmovable(true);
    p4.setImmovable(true);
    
   this.tweens.add({
        targets: p1,
        y: 500,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    this.tweens.add({
        targets: p2,
        y: 350,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    this.tweens.add({
        targets: p3,
        y: 400,
        duration: 4500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    this.tweens.add({
        targets: p4,
        y:40,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

   
        //creacion personaje
personaje = this.physics.add.sprite(60,450, 'personaje').setScale(1.8);


    this.anims.create({
        key: 'turn',
        frames: [ { key: 'personaje', frame: 0 } ],
        frameRate: 20
    });
   this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });
    
    personaje.body.setGravityY(300)   
      
    this.physics.add.collider(personaje, plataforma);
    this.physics.add.collider(personaje, plataformasMoviles);

    
        
    cursors = this.input.keyboard.createCursorKeys();
    //creacion de recompensa
  
    estrella = this.physics.add.group({
        key: 'estrella',
        repeat: 9,
        setXY: { x: 12, y: 0, stepX: 94.5}
    });
    
    estrella.children.iterate(function (child) { 
        child.setBounceY(0);
        child.setScale(0.10)});
   

    this.physics.add.collider(estrella, plataforma);
    this.physics.add.collider(estrella, plataformasMoviles);
    this.physics.add.overlap(personaje, estrella, collectStar, null, this);
    

// cuenta las recompensas 
this.add.image(55, 35, 'corazon').setScale(0.3); // Imagen de corazon 

score =1;
scoreText = this.add.text(50, 20, '1', { fontSize: '24px', fill: '#fff' });
function collectStar (personaje, estrella) {
    estrella.disableBody(true, true);

    score += 1;
    scoreText.setText(score);
 x =(personaje.x<400)? Phaser.Math.Between(400,800): Phaser.Math.Between(0,400);

}
// crear bandera
 bandera= this.physics.add.staticGroup();
 bandera.create(730,50,'bandera').setScale(0.1).refreshBody();
 this.physics.add.overlap(personaje, bandera, ganarJuego, null, this);

//funcion ganar
function ganarJuego() {
    if(score == 10 ){
    this.physics.pause();
    personaje.anims.play('turn');
    personaje.setTint(0x00ff00);

    this.add.text(250, 300, '¡Has ganado!', {
        fontSize: '32px',
        fill: '#00ff00'
    });

    this.victoria.play();
    this.time.delayedCall(3000, () => {
        this.sound.stopAll();
        this.scene.restart();
        this.musica.play();
        
    });

    }
    
    
} 

//creacion enemigo
this.anims.create({
    key: 'enemigo_volar',
    frames: this.anims.generateFrameNumbers('enemigo', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
});

enemigos = this.physics.add.group();

function crearEnemigoAleatorio() {
    let desdeIzquierda = Phaser.Math.Between(0, 1) === 0;
    let x = desdeIzquierda ? -50 : 850; // Aparece fuera del juego
    let y = Phaser.Math.Between(60, 550); // Altura aleatoria
    let velocidadX = desdeIzquierda ? 100 : -100;

    let enemigo = enemigos.create(x, y, 'enemigo').setScale(0.3);
    enemigo.body.allowGravity = false;
    enemigo.setVelocityX(velocidadX);
    enemigo.setCollideWorldBounds(false);
    enemigo.setBounce(1, 0);
    enemigo.play('enemigo_volar');
    enemigo.setFlipX(velocidadX < 0);
}

this.time.addEvent({
    delay: 3000, // cada 3 segundos
    callback: crearEnemigoAleatorio,
    callbackScope: this,
    loop: true
});

this.physics.add.overlap(personaje,enemigo, tocarEnemigo, null, this);

function tocarEnemigo() {
    this.physics.pause();             // Detiene toda la física del juego
    personaje.setTint(0xff0000);     // Cambia color del personaje (opcional)
    personaje.anims.play('turn');    // Cambia animación
    
}

this.physics.add.overlap(personaje, enemigos, () => perderVida.call(this), null, this);
if (personaje.y > 640 && vidas > 0) {
    perderVida.call(this)}

function perderVida() {
    vidas--; // restar una vida
    score-=1; // restar 1 puntos
    if (score < 0) score =0; // el score no baja de 0
    scoreText.setText(score);

    if (vidas <= 0) {
        this.physics.pause();
        personaje.setTint(0xff0000);
        personaje.anims.play('turn');
        this.add.text(250, 300, '¡Game over!', { fontSize: '32px', fill: '#ff0000' });
        this.musicamuerte.play();
        this.time.delayedCall(3000, () => {
            this.sound.stopAll();
            this.scene.restart();
            this.musica.play();
        });
    } else {
        // Si todavía quedan vidas, reseteamos posición
        personaje.setTint(0xff0000);
        this.time.delayedCall(800, () => {
            personaje.clearTint();
            personaje.setX(100);
            personaje.setY(100);
        });
    }
}


// sonido de fondo 
if (!this.sound.get('musicaFondo')) {
    this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
    this.musicamuerte = this.sound.add('sonidoMuerte', { loop: true, volume: 0.5 });
    this.musicacaida = this.sound.add('sonidoCaida', { loop: true, volume: 0.5 });
    this.victoria = this.sound.add('victoria', { loop: true, volume: 0.5 });
    this.musica.play();
}
 
}



function update(){

    if (personaje.y > 660) { // si cae más abajo del fondo del juego
        this.physics.pause();
        personaje.setTint(0xff0000);
        personaje.anims.play('turn');
        this.add.text(250, 300, '¡Game over!', { fontSize: '32px', fill: '#ff0000' });
        
        this.time.delayedCall(2000, () => {
          //  this.musicamuerte.play();
            this.scene.restart();
            this.musica.play();    
        });
       
    }
    
    
    if (cursors.left.isDown) {
        personaje.setVelocityX(-160);
        personaje.anims.play('left',true);
        personaje.setFlipX(true)

    } else if (cursors.right.isDown) {
        personaje.setVelocityX(160);
        personaje.anims.play('left', true);
        personaje.setFlipX(false)
    } else {
        personaje.setVelocityX(0);
        personaje.anims.play('turn');
 }
    if (cursors.up.isDown && personaje.body.touching.down) {
        personaje.setVelocityY(-450);
      }

      enemigos.children.iterate(function (enemigo) {
        if (enemigo.body.velocity.x > 0) {
            enemigo.setFlipX(true); // Mira a la derecha
        } else {
            enemigo.setFlipX(false); // Mira a la izquierda
        }
     });  

     
}    