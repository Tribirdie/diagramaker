const infCanvas = document.getElementById('c')
const context = infCanvas.getContext("2d")

let shapes_list = [];

let shape_origin = [675, 207]
let viewport_coords = [0, 0] 
let zoom_percent = 1

function shape_map(){
	return new Map([[
		["type", null],
		["pos_x", 0],
		["pos_y", 0],
		["size_w", 0],
		["size_h", 0],
	]])
}

function file_dialog(element){
	document.getElementById(element).click();
}


let square_clicked = 0;
let bounding_rect = 0;

function square_button(e){
	let shape_map_template = shape_map();

	let x_coordinate = e.clientX - bounding_rect.left - 25
	let y_coordinate = e.clientY - bounding_rect.top - 25
	shape_map_template.set("type", "square");
	shape_map_template.set("pos_x", x_coordinate);
	shape_map_template.set("pos_y", y_coordinate);
	shape_map_template.set("size_w", 50);
	shape_map_template.set("size_h", 50);

	shapes_list.push(shape_map_template)


	context.scale(zoom_percent, zoom_percent)
	context.beginPath()
	context.fillStyle = "blue";
	context.fillRect(x_coordinate, y_coordinate, 50, 50);


}

function draw_square(){
	if (square_clicked == 1){
		document.getElementById("c").removeEventListener("click", square_button)
		square_clicked = 0
	}

	else{
		let element_canvas = document.getElementById("c")
		element_canvas.addEventListener("click", square_button)
		bounding_rect = element_canvas.getBoundingClientRect();
		square_clicked += 1
	}

}


function draw_origin(event){
	let canvas_click_pos_x = event.pageX;
	let canvas_click_pos_y = event.pageY;


	context.beginPath()
	context.arc(canvas_click_pos_x, canvas_click_pos_y, 20, 0, 2 * Math.PI)
	context.stroke()
}

let origin_butt_clicked = 0;

function origin_button(){
	if (origin_butt_clicked == 1){
		document.getElementById("c").removeEventListener("click", draw_origin)
		origin_butt_clicked = 0;
	}

	else{
		document.getElementById("c").addEventListener("click", draw_origin)
		origin_butt_clicked += 	1
	}
}

let clickX = 0
let clickY = 0
let mouseX = 0
let mouseY = 0
let new_originX = 0
let new_originY = 0

let clicked = false;

function get_pan_init_pos(e){
	clicked = true;
	clickX = event.clientX
	clickY = event.clientY
}

function mouse_move(e){
	mouseX = e.clientX
	mouseY = e.clientY
	new_originX = infCanvas.width + mouseX
	new_originY = infCanvas.height + mouseY

	clicked = false;
}

function access_shapes(diffX,diffY, zoom_percent, event){
	for (let i = 0; i < shapes_list.length; i++){
		let type = shapes_list[i].get("type")
		let pos_x = shapes_list[i].get("pos_x")
		let pos_y = shapes_list[i].get("pos_y")
		let size_w = shapes_list[i].get("size_w")
		let size_h = shapes_list[i].get("size_h")


		if (type == "square"){
			context.beginPath();
			context.fillStyle = "blue";

			if (event == "pan"){
				console.log("this is me")
				context.fillRect(pos_x+diffX, pos_y+diffY, size_w * zoom_percent, size_h * zoom_percent)
				shapes_list[i].set("pos_x", pos_x+diffX)
				shapes_list[i].set("pos_y", pos_y+diffY)
			}

			else{
				context.fillRect(pos_x, pos_y, size_w, size_h )
				shapes_list[i].set("pos_x", pos_x)
				shapes_list[i].set("pos_y", pos_y)
			}
		}
	}

}
function update_shapes_list(e){
	if (!clicked && square_clicked == 0){
		let diffX = event.clientX - clickX
		let diffY = event.clientY - clickY

		context.save()
		context.clearRect(0,0, infCanvas.width, infCanvas.height)

		access_shapes(diffX, diffY, zoom_percent, "pan")
		context.restore()
	}
}

document.getElementById("c").addEventListener("mousedown", get_pan_init_pos)
document.getElementById("c").addEventListener("mousemove", mouse_move)
document.getElementById("c").addEventListener("mouseup", update_shapes_list)

document.getElementById("c").addEventListener("wheel", (event) => {
	if (event.deltaY < 0){
		if (zoom_percent < 5){
			console.log("his thisme")
			zoom_percent += 0.1
			zoom_percent = Math.round(zoom_percent * 10) / 10

			context.save()
			context.clearRect(0,0, infCanvas.width, infCanvas.height)
			context.translate(mouseX, mouseY)
			context.scale(zoom_percent, zoom_percent)
			context.translate(-mouseX, -mouseY)

			access_shapes(0,0,zoom_percent, "zoom")
			context.restore()
		}
	}

	else{
		if (zoom_percent > 0){
			console.log("his this me")
			zoom_percent -= 0.1
			zoom_percent = Math.round(zoom_percent * 10) / 10

			context.save()
			context.clearRect(0,0, infCanvas.width, infCanvas.height)
			context.translate(mouseX, mouseY)
			context.scale(zoom_percent, zoom_percent)
			context.translate(-mouseX, -mouseY)

			access_shapes(0,0,zoom_percent, "zoom")
			context.restore()

		}
	}

})
window.file_dialog = file_dialog;
window.draw_square = draw_square;
window.origin_button = origin_button
