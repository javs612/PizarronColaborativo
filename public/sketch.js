let datos = [];
let mx ;
let my ;
let tempar;
let fig;
let figa = 0;
let color = 255;
var colBtn;

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('canvasP');
	background(255);

	socket = io.connect('http://localhost:3000');
	socket.on('temp',newDrawing);
	socket.on('newWindow',drawold);
	socket.on('masFig',drawMore);
	colBtn = select('#colorIN');
	colBtn.input(updateColor);

}

function updateColor(){
	color = colBtn.value();
}

function mouseDragged(){
	
	var d = dist(mx, my, mouseX, mouseY);
	if (d > 5) {
		if (figa === 2) {
			fig = {
				x: mx,
				y: my,
				x2: mouseX,
				y2: mouseY,
				figura: figa,
				col: color
			}
		}else{
			fig = {
				x: mx,
				y: my,
				size: d,
				figura: figa,
				col: color
			}
		}
		
		socket.emit('mouse',fig);

		switch(fig.figura){
		case 0:
			fill(fig.col);
			stroke(fig.col);
			puntoMedio(fig.x, fig.y, fig.size);
		break;

		case 1:
			rectMode(CENTER);
			fill(fig.col);
			stroke(fig.col);
			rect(fig.x, fig.y, fig.size, fig.size);
		break;

		case 2:
			fill(fig.col);
			stroke(fig.col);
			functionDDA(fig.x, fig.y, fig.x2, fig.y2);
		break;
		}

	}
	
}
function mousePressed(){
	mx = mouseX;
	my = mouseY;
	console.log('started click');
}

function mouseReleased(){		
	datos.push(fig);
	socket.emit('addFig',datos);
	console.log('click ended');

}


function newDrawing(data){
	console.log('ne drawing temper = data')
	tempar = data;
	switch(tempar.figura){
		case 0:
		fill(tempar.col);
		stroke(tempar.col);
		puntoMedio(tempar.x, tempar.y, tempar.size);
		break;

		case 1:
		rectMode(CENTER);
		fill(tempar.col);
		stroke(tempar.col);
		rect(tempar.x, tempar.y, tempar.size, tempar.size);
		break;

		case 2:
		fill(tempar.col);
		stroke(tempar.col);
		functionDDA(tempar.x, tempar.y, tempar.x2, tempar.y2);
		break;
	}
}

function drawold(data){
	datos = data;
}

function drawMore(data){
	datos = data;	
}

function figura(num) {
	figa=num;
	console.log(figa + ' : ' +num)
}

function draw() {
	frameRate(1);
	background(51);

	for (let i = 0; i < datos.length; i++) {
		switch(datos[i].figura){
			case 0:
			fill(datos[i].col);
			stroke(datos[i].col);
			puntoMedio(datos[i].x, datos[i].y, datos[i].size);
			break;

			case 1:
			rectMode(CENTER);
			fill(datos[i].col);
			stroke(datos[i].col);
			rect(datos[i].x, datos[i].y, datos[i].size, datos[i].size);
			break;

			case 2:
			fill(datos[i].col);
			stroke(datos[i].col);
			functionDDA(datos[i].x, datos[i].y, datos[i].x2,datos[i].y2);
			break;
		}
	}
}

function functionDDA(x1,y1,x2,y2)
{
	// delta x 
	let dx = x2 - x1;
	let dy = y2 - y1;
	let dif;
	let xinc;
	let yinc;
	let x = x1; 
	let y = y1;

	//valor absoluto solo para ver la diferencia entre las diferencias
	// si no pones abs y estan de derecha a izq como debe dibujar
	// no lo va dibujar por que la diferencia de uno es negativa por lo cual lo hace menor y/o affecta de donde a donde debe dibujar
	if (abs(dx) > abs(dy)){
		dif = abs(dx);
	}else{
		dif = abs(dy);
	}

	// si |dy| > 1 entonces dy/dif el cual es igual a dy  da 1 entonces
	// la y se va ir sumando en 1 y la x parcialmente por que queda dx/dif el cual 
	// representa 1/m
	// en casos de dx siendo mayor que 1 se incrementara en 1 y dy en algo parcial

	xinc= dx/dif;
	yinc = dy/dif;

	//dibujamos el primer punto
	point (round(x), round(y));
	for (let k = 0; k < dif; k++)
	{
		console.log("yinc: " + yinc);
		x += xinc;
		y += yinc;
		point (round(x), round(y));
	}
}

function puntoMedio(xc, yc , r){
	let x = 0;
	let y = r;		

	let p= 5/4 - r;
	point(xc,yc);
	while (x < y){
		x = x + 1;
	    if (p < 0)
	    	p = p + 2*x + 1;
	    else {
	    	y = y - 1;
	    	p = p + 2*(x - y) + 1;
	    }
    	point(xc + x, yc + y);
    	point(xc + y , yc + x);

    	point(xc + y, yc - x);
    	point(xc + x,yc - y);

    	point(xc - x, yc - y);
    	point(xc - y, yc - x);

    	point(xc - y,yc + x);
    	point(xc - x,yc + y);
	}
}