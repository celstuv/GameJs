var canvas = document.getElementById('myCanvas');
//la variable ctx pour stocker le contexte de rendu 2D — l'outil réel que nous pouvons utiliser pour peindre sur Canvas.
var ctx = canvas.getContext("2d");

//Nous allons définir une variable appelée ballRadius qui contiendra le rayon du cercle dessiné et sera utilisée pour les calculs.
var ballRadius = 10;

//Déplacer la balle
//placement au milieu de l'axe des abscisses du canvas
var x = canvas.width/2;
 //30px du bord bas du canvas
var y = canvas.height-30;

//nous voulons ajouter une valeur à x et y après que chaque image ait été dessinée afin de faire croire que la balle bouge.
var dx = 2;
var dy = -2;

//Dessiner une palette pour controler la balle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

/*Les boutons enfoncés peuvent être définis et initialisés avec des variables booléennes
La valeur par défaut pour les deux est falseparce qu'au début les boutons de commande ne sont pas enfoncés.*/
var rightPressed = false;
var leftPressed = false;

/*Créations des briques
nous avons défini le nombre de lignes et de colonnes de briques,
leur largeur et hauteur, le rembourrage entre les briques pour
qu'elles ne se touchent pas et un décalage en haut et à gauche pour
qu'elles ne commencent pas à être dessinées à droite du bord de la toile.*/
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++){
      //Faire disparaître les briques après avoir été frappées
      bricks[c][r] = { x: 0 , y: 0, status:1 };
    }
}

var score = 0;
var lives = 3;

//Ecouter les pressions sur les touches, nous allons configurer deux écouteurs d'événements.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Écouter les mouvements de la souris
document.addEventListener("mousemove", mouseMoveHandler, false);

//Ancrer le mouvement de la palette au mouvement de la souris
function mouseMoveHandler(e) {
  //la distance entre le bord gauche du canevas et le pointeur de la souris
  var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX =  relativeX - paddleWidth/2;
    }
}




/*Lorsque l' keydown événement est déclenché sur l'une des touches de votre clavier
(lorsqu'elles sont enfoncées), la keyDownHandler()fonction est exécutée.
Le même schéma est vrai pour le deuxième auditeur: les keyupévénements déclencheront
la keyUpHandler()fonction (lorsque les touches cesseront d'être enfoncées).
  Pour Inforamtion : La plupart des navigateurs utilisent ArrowRight et ArrowLeftpour
   les touches de curseur gauche / droite, mais nous devons également inclure Rightet
   Leftvérifier la prise en charge des navigateurs IE / Edge. */
function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed =  true;
  }
}

function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//fonction de détection de collision
/*Si le centre de la balle est à l'intérieur des coordonnées de l'une de nos briques,
nous changerons la direction de la balle. Pour que le centre de la balle soit à l'intérieur
de la brique, les quatre affirmations suivantes doivent être vraies:
La position x de la balle est supérieure à la position x de la brique.
La position x de la balle est inférieure à la position x de la brique plus sa largeur.
La position y de la balle est supérieure à la position y de la brique.
La position y de la balle est inférieure à la position y de la brique plus sa hauteur.*/
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
              if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                      alert("YOU WIN, CONGRATULATIONS !");
                      document.location.reload();
                      //clearInterval(interval);//Needed for chrome to end game
                    }
              }
            }
        }
    }
}
/*Dessiner du texte sur un canevas est similaire au dessin d'une forme.
La définition de police ressemble exactement à celle de CSS -
vous pouvez définir la taille et le type de police dans la font()méthode.
Ensuite, utilisez fillStyle()pour définir la couleur de la police et fillText()
pour définir le texte réel qui sera placé sur le canevas, et où il sera placé.
Le premier paramètre est le texte lui-même - le code ci-dessus montre le nombre
actuel de points - et les deux derniers paramètres sont les coordonnées où le
texte sera placé sur le canevas.*/
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score : " +score, 8, 20);
}

//Compteur de vie
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives : " +lives, canvas.width-65, 20);
}

//Dessiner la ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
//Dessiner la palette
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
//Une fonction pour parcourir toutes les briques du tableau et les dessiner à l'écran.
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      /*chaque brique peut être placée à sa place dans la rangée et la colonne,
      avec un rembourrage entre chaque brique, dessinée à un décalage par rapport aux bords gauche et supérieur de la toile.
      Si status = 1, alors dessinez la brique, mais si c'est le status = 0,
      alors la brique a été touchée par la balle et nous ne voulons plus qu'elle apparaisse à l'écran.*/
      if(bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}




  //Définir une boucle de dessin
document.getElementById("clickMe").onclick = function draw() {
  /* Il existe un moyen d'effacer le contenu du canevas : clearRect().
  Cette méthode prend en compte quatre paramètres: les coordonnées x et y
  du coin supérieur gauche d'un rectangle et les coordonnées x et y du coin
  inférieur droit d'un rectangle. Toute la zone couverte par ce rectangle sera effacée. */
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
    /*Rebondir en haut et en bas
    if(y + dy < 0) {
        dy = -dy;
    }
    */
      //Rebondir à gauche et à droite
      /*Lorsque la balle frappe un mur, elle s'y enfonce légèrement avant de changer de direction
      La balle devrait rebondir juste après avoir touché le mur, et non pas
      lorsqu'elle est déjà à mi-chemin dans le mur, alors ajustons un peu nos déclarations pour inclure cela.
      Rajoutons - ballRadius*/
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    /*Nous devons, à chaque rafraichissement du canvas, regarder si la balle touche le bord du haut.
    nous devons inverser la direction de la balle pour créer un effet de limite de zone de jeu. et ensuite
    faire de même avec le bord inférieur*/
    if(y + dy < ballRadius) {
      dy = -dy;
      /*créer une sorte de détection de collision entre la balle et la raquette, afin qu'elle puisse rebondir et revenir dans l'aire de jeu.
      La chose la plus simple à faire est de vérifier si le centre de la balle est entre les bords gauche et droit de la raquette.*/
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else { //Implémentation de game over
          /*Au lieu de terminer le jeu immédiatement, nous diminuerons le nombre de vies jusqu'à ce qu'elles ne soient plus disponibles
           et réinitialisons la balle et les positions de la pagaie lorsque le joueur commence sa prochaine vie*/
          lives--;
            if(!lives) {
              alert('GAME OVER');
              document.location.reload();
              //clearInterval(interval); //Needed for chrome to end game
            }
            else {
              x = canvas.width/2;
              y = canvas.height-30;
              dx = 2;
              dy = -2;
              paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    /*Si le curseur gauche est enfoncé, la palette se déplacera de sept pixels vers la gauche,
    et si le curseur droit est enfoncé, la palette se déplacera de sept pixels vers la droite.
    La paddleXposition que nous utilisons se déplacera entre 0le côté gauche du canevas et canvas.width-paddleWidthle côté droit*/
    if(rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width){
          paddleX = canvas.width - paddleWidth;
      }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if(paddleX <0){
          paddleX = 0
        }
    }
    /*Lorsque la distance entre le centre de la balle et le bord du mur est exactement
    la même que le rayon de la balle, cela change la direction du mouvement. Soustraire le rayon
    de la largeur d'un bord et l'ajouter à l'autre nous donne l'impression d'une détection de collision correcte —
    la balle rebondit sur les murs comme elle devrait le faire.*/

    //La balle sera peinte dans la nouvelle position à chaque nouvelle image.
    x += dx;
    y += dy;

  /*La draw()fonction est maintenant exécutée encore et encore dans une requestAnimationFrame()boucle,
  mais au lieu de la fréquence d'images fixe de 10 millisecondes, nous redonnons le contrôle
  du framerate au navigateur. Il synchronisera le framerate en conséquence et restituera les formes
  uniquement lorsque cela sera nécessaire. Cela produit une boucle d'animation plus efficace et plus
  fluide que l'ancienne setInterval()méthode*/
  requestAnimationFrame(draw);
}

//la fonction draw() sera appelée toutes les 10 millisecondes
//var interval = setInterval(draw, 10);

//Amélioration du rendu avec requestAnimationFrame ()
draw();

//Bouton stop
// document.getElementById("clickStop").onclick = function stop() {
//   console.log(document.getElementById("clickStop"));
//
// }
document.getElementById("clickStop").addEventListener("click", function draw() {
    return;
});
