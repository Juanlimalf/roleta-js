let colors = ["#3E66AE",
              "#F7C210",
              "#AC1D15",
              "#215B29",
              "#42215A"];

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

// angulo inicial
let startAngle = 0

// angulo sorteado 
let targetAngle = (arc*(produtos.length-1))*3;

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
  ctx.lineWidth = 1;
  
  // contagem para colorir os seguimentos da roleta
  let count_colors = 0;

  let itemSorteado;

  // desenhando seguimentos da roleta
  for(let i = 0; i < produtos.length; i++) {

    if (count_colors == colors.length) {
      count_colors = 0
    }
    let angle = startAngle - i * arc;
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
    ctx.font = 'bold 1.5rem sans-serif';
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


// Funçao para iniciar o giro da roleta
async function spin(item) {

  let btn = document.getElementById('btn')
  // desabilitando o botao girar
  btn.disabled = true

  // // definindo o item sorteado
  // itemSorteado = produtos.indexOf(item)
  itemSorteado = item
  
  // definindo onde a roleta ira parar
  targetAngle += arc*itemSorteado

  // rodar a roleta
  rotateWheel();

}

async function rotateWheel() {
  if(startAngle >= targetAngle) {
    stopRotateWheel();
    return;
  }

  // Definição do novo angulo
  startAngle += diminuirLinear(startAngle, targetAngle)

  // Desenha a roleta com novo angulo
  draw();

  // Velocidade da roleta
  spinTimeout = requestAnimationFrame(rotateWheel);
}


async function stopRotateWheel() {
  cancelAnimationFrame(spinTimeout);

  // mostrando o produto sorteado
  alert(`produto: ${produtos[itemSorteado]}`);

  btn.disabled = false

  // resetando as variaveis e roleta
  location.reload();
}


// funçao que diminui conforme o valor, para diminuir a velocidade da roleta
function diminuirLinear(valorAtual, totalIteracao) {
  var valorInicial = 0.2;
  var valorFinal = 0.001;
  var valorIncremento = (valorInicial - valorFinal) / totalIteracao; // 20 é o número de intervalos entre 20 valores

  return valorInicial - (valorAtual - 1) * valorIncremento;
}


draw();