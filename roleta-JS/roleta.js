let colors = ["#F7C210",
              "#AC1D15",
              "#215B29",
              "#42215A",
              "#3E66AE"];

let produtos = ["30% DESCONTO BUFFET",
                "1 CAFE MOKACCINO",
                "1 PEDAÇO DE PIZZA",
                "1 CAFE COADO",
                "1 SALGADO",
                "1 SUCO DE LARANJA 300ML.",
                "1 TAPIOCA MANTEIGA",
                "1 MISTO QUENTE",
                "1 ESFIHA TURCA DE CARNE",
                "1 EMPADA DE FRANGO"];


let arc = Math.PI / (produtos.length/2);

// angulo inicial e final + 5 voltas  roleta
let startAngle = 0
let targetAngle = arc*(produtos.length)*2;
let spinTimeout = null;

// Desenhar a Roleta
function draw() {

  let canvas = document.getElementById("wheelcanvas");

  let padding = window.innerWidth * 0.95

  canvas.width = padding ;
  canvas.height = padding;
  
  let ctx;

  // coordenadas do centro do canvas
  let px = ((canvas.width) / 2);
  let py = ((canvas.height) / 2);

  // tamanho do raio da roleta
  let insideRadius = 0;
  let outsideRadius = (canvas.width / 2) - 10;

  // distacia do texto para borda
  let textRadius = (outsideRadius / 2) + 10;

  // propriedades do canvas
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,(px*2),(py*2));
  ctx.strokeStyle = "silver";
  ctx.lineWidth = 0;
  
  // contagem para colorir os seguimentos da roleta
  let count_colors = 0;

  // desenhando seguimentos da roleta
  for(let i = 0; i < produtos.length; i++) {

    if (count_colors == colors.length) {
      count_colors = 0
    }
    let angle = startAngle + i * arc;
    ctx.fillStyle = colors[count_colors];
    ctx.beginPath();
    ctx.arc(px, py, outsideRadius, angle, angle + arc);
    ctx.arc(px, py, insideRadius, angle + arc, angle);
    ctx.stroke();
    ctx.fill();

    // descrição da roleta
    const textX = px + Math.cos(angle + arc / 2) * (textRadius)
    const textY = py + Math.sin(angle + arc / 2) * (textRadius)
    ctx.save();
    ctx.font = 'bold 1.6rem sans-serif';
    ctx.fillStyle = "white";
    ctx.translate(textX, textY);
    ctx.rotate(angle + arc / 2 + Math.PI);
    let text = produtos[i];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.restore();

    count_colors += 1
  }

  // desenhando a borda
  ctx.beginPath();
  ctx.arc(px, py, outsideRadius + 10, 0, 2 * Math.PI, true);
  ctx.arc(px, py, outsideRadius - 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#5e5e5e";
  ctx.stroke();
  ctx.fill();

  // centro
  ctx.beginPath();
  ctx.arc(px, py, 25, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffb947";
  ctx.stroke();
  ctx.fill();

  // seta
  ctx.beginPath();
  ctx.moveTo(px - 10, (py - 5)-(outsideRadius+5));
  ctx.lineTo(px + 10, (py - 5)-(outsideRadius+5));

  ctx.lineTo(px + 10, (py - 5)-(outsideRadius-15));
  ctx.lineTo(px + 25, (py - 5)-(outsideRadius-15));
  ctx.lineTo(px, py-(outsideRadius-30));
  ctx.lineTo(px - 25, (py - 5)-(outsideRadius-15));
  ctx.lineTo(px - 10, (py - 5)-(outsideRadius-15));

  ctx.lineTo(px - 10, py - (outsideRadius + 15));
  ctx.fillStyle = "red";
  ctx.fill();
}



function spin(item) {

  let itemSorteado = item
  
  targetAngle += arc*itemSorteado

  // rodar a roleta
  rotateWheel();

}



function rotateWheel() {
  if(startAngle >= targetAngle) {
    stopRotateWheel();
    return;
  }

  // Definição do novo angulo
  startAngle += 0.1;
  
  // Desenha a roleta com novo angulo
  draw();

  // Velocidade da roleta
  spinTimeout = setTimeout('rotateWheel()', 10);
}


function stopRotateWheel() {
  clearTimeout(spinTimeout);
  let degrees = startAngle * 180 / Math.PI + 90;
  console.log(degrees)
  let arcd = arc * 180 / Math.PI;
  let index = Math.floor((360 - degrees % 360) / arcd);

  // mostrando o produto sorteado
  alert(`produto: ${produtos[index]}`);

  // resetando as variaveis e roleta
  location.reload();
}

draw();