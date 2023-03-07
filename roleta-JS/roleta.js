// VARIAVES GLOBAIS

let colors = ["#3E66AE",
              "#F7C210",
              "#AC1D15",
              "#215B29",
              "#42215A"];


// Produtos da roleta
let produtos;

// angulo da roleta em radianos
let arc;

// angulo inicial
let startAngle = 0;

// quantidade de voltas da roleta
let quantidadeVoltas = 4;

// angulo de parada da roleta
let targetAngle = (((Math.PI/180)*360)*quantidadeVoltas) - ((Math.PI/180)*108);

let spinTimeout;

let itemSorteado;

async function drawRoulette(){
  
  const url = 'http://localhost:8004/produtos';
  
  const options = {
  method: "GET",
  mode: "cors", 
  cache:"default"
  };

  let pro = await fetch(url, options)
  .then(promisse => promisse.json())
  .then(response => {
    produtos = response;
  });

  draw();

};

// produtos = ["30% DESCONTO BUFFET",
//                 "1 CAFE MOKACCINO",
//                 "1 PEDAÇO DE PIZZA",
//                 "1 CAFE COADO",
//                 "1 SALGADO",
//                 "1 SUCO DE LARANJA 300ML.",
//                 "1 TAPIOCA MANTEIGA",
//                 "1 MISTO QUENTE",
//                 "1 ESFIHA TURCA DE CARNE",
//                 "1 EMPADA DE FRANGO"];


// Desenhar a Roleta
function draw() {

  arc = Math.PI / (produtos.length/2);

  let canvas = document.getElementById("wheelcanvas");

  let padding;
  let font;

  if (window.innerHeight>window.innerWidth){
    padding = window.innerWidth * 0.95
    font = 'bold 1.5rem sans-serif'

  } else{
    padding = 600
    font = 'bold 1rem sans-serif'
  }

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
  ctx.strokeStyle = "#5e5e5e";
  ctx.lineWidth = 1;
  
  // contagem para colorir os seguimentos da roleta
  let count_colors = 0;

  // desenhando a roleta
  for(let i = 0; i < produtos.length; i++) {

    // seguimentos da roleta
    if (count_colors == colors.length) {
      count_colors = 0
    }
    let angle = startAngle - i * arc;
    ctx.fillStyle = colors[count_colors];
    ctx.beginPath();
    ctx.arc(px, py, outsideRadius, angle, angle + arc, false);
    ctx.arc(px, py, insideRadius, angle + arc, angle, true);
    ctx.stroke();
    ctx.fill();

    // descrição da roleta
    const textX = px + Math.cos(angle + arc / 2) * (textRadius)
    const textY = py + Math.sin(angle + arc / 2) * (textRadius)
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = "white";
    ctx.translate(textX, textY);
    ctx.rotate(angle + arc / 2 + Math.PI);
    let text = produtos[i]["descricao_produto"];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.restore();
    ctx.save();

    // desenhando a borda
    ctx.beginPath();
    ctx.fillStyle = "#5e5e5e";
    ctx.arc(px, py, outsideRadius-20, angle, angle + arc, false);
    ctx.arc(px, py, outsideRadius, angle + arc, angle, true);
    ctx.stroke();
    ctx.fill();
    ctx.save();

    // Calcula as coordenadas do centro do círculo na extremidade do segmento
    const circleX = px + (outsideRadius-10) * Math.cos(angle+(arc/3)*0.8);
    const circleY = py + (outsideRadius-10) * Math.sin(angle+(arc/3)*0.8);

    const circleX1 = px + (outsideRadius-10) * Math.cos(angle+(arc/3)*2.2);
    const circleY1 = py + (outsideRadius-10) * Math.sin(angle+(arc/3)*2.2);

    // Desenha o círculo na extremidade do segmento
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(circleX, circleY, 6, 0, 2 * Math.PI);
    ctx.arc(circleX1, circleY1, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.save();
    
    count_colors += 1
  }

  // centro
  ctx.beginPath();
  ctx.arc(px, py, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#cd9a29";
  ctx.stroke();
  ctx.fill();

  // seta
  ctx.beginPath();
  ctx.moveTo(px - 10, (py - 5)-(outsideRadius-5));
  ctx.lineTo(px + 10, (py - 5)-(outsideRadius-5));

  ctx.lineTo(px + 10, (py - 5)-(outsideRadius-20));
  ctx.lineTo(px + 25, (py - 5)-(outsideRadius-20));
  ctx.lineTo(px, py-(outsideRadius-35));
  ctx.lineTo(px - 25, (py - 5)-(outsideRadius-20));
  ctx.lineTo(px - 10, (py - 5)-(outsideRadius-20));

  ctx.lineTo(px - 10, py - (outsideRadius + 15));
  ctx.fillStyle = "red";
  ctx.fill();
}


// Funçao para iniciar o giro da roleta
async function spin(item) {

  let btn = document.getElementById('btn');
  // desabilitando o botao girar
  btn.disabled = true;
  
  // // definindo o item sorteado
  // itemSorteado = produtos.indexOf(item)
  itemSorteado = item;
  
  // definindo onde a roleta ira parar
  targetAngle += arc*itemSorteado;

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
  alert(`produto: ${produtos[itemSorteado]["descricao_produto"]}, cod: ${produtos[itemSorteado]["cod_acesso"]}`);

  btn.disabled = false;

  // resetando as variaveis e roleta
  location.reload();
}


// funçao que diminui conforme o valor, para diminuir a velocidade da roleta
function diminuirLinear(valorAtual, totalIteracao) {
  let valorInicial = 0.2;
  let valorFinal = 0.0001;
  let valorIncremento = (valorInicial - valorFinal) / totalIteracao; // 20 é o número de intervalos entre 20 valores

  return valorInicial - (valorAtual - 1) * valorIncremento;
}


drawRoulette();