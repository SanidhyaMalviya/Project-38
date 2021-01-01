//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var flag;
var dist;

var gameOver,restart;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  backgroundImg = loadImage("background.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addImage("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  ground2 = createSprite(200,180,400,20);
  ground2.addImage("ground",groundImage);
  ground2.x = ground.width + ground.width/2;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(290,90);
  restart = createSprite(300,120);
  
  gameOver.addImage("gameOver",gameOverImg);
  gameOver.scale = 0.5;
  
  restart.addImage("restart",restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  score = 0;
  dist = ground.width;
  flag = 0;
}

function draw() {
  camera.x = trex.x+100;
  gameOver.position.x = restart.position.x = camera.x;

  background(backgroundImg);
  
  textSize(20);
  fill("white")
  stroke("black")
  strokeWeight(3) 
  text("Score: "+ score, camera.x+180,40);
  
  //console.log(trex.x);

  if(gameState === PLAY) {
    trex.velocityX = 4+2*score/100;
    invisibleGround.velocityX = 4+2*score/100;
    //ground.velocityX = -4;

    if(keyDown("space") && trex.y>=150) {
      trex.velocityY = -15;
    }
  
    //adding gravity
    trex.velocityY = trex.velocityY + 0.8
    
    //Scoring
    score = score + Math.round(getFrameRate()/60);

    //resetting ground
    if (trex.x >= dist-displayWidth){
      if(flag == 0){
        ground2.x = dist+ground.width/2;
        //invisibleGround2.x = ground2.x;
        flag = 1;
      }
      else{
        ground.x = dist+ground.width/2;
        //invisibleGround.x = ground.x;
        flag=0;
      }
      dist+=ground.width;
    }

    //calling function for cloud and obstacles
    spawnClouds();
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  }  
    else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    invisibleGround.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
      
    if(mousePressedOver(restart)) {
      reset();
    }  
  }

  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  trex.velocityX = 4+2*score/100;
  invisibleGround.velocityX = 4+2*score/100;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(camera.x+width/2,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -(3+2*score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    //obstacle.velocityX = -(4+2*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}