
const LanguageObj = (words, lang) =>{

	if (lang === undefined || lang === null){
		lang = 1;
	}

	console.log(words);
	console.log(lang)
	return {
		import: words[lang][0],
		export: words[lang][1],
		square: words[lang][2],
		circle: words[lang][3],
		settings: words[lang][4],
		importJson: words[lang][5],
		exportJson: words[lang][6],
		exportImg: words[lang][7],
		nodes: words[lang][8],
		appearance: words[lang][9],
		language: words[lang][10],
		width: words[lang][11],
		height: words[lang][12],
		output: words[lang][13],
		image: words[lang][14],
		loadDiagram: words[lang][15]

	}
}

const LanguageWords = [
	["Importar", "Exportar", "Cuadrado","Circulo", "Configuracion", "Seleccionar diagrama", "Exportar como JSON",
		"Exportar como imagen", "Nodos", "Apariencia", "Lenguaje", "Ancho:", "Alto:", "Salida", "Imagen",
	"Cargar diagrama"],

	["Import", "Export", "Square", "Circle" ,"Settings", "Select diagram", "Export as JSON", "Export as image", "Nodes",
		"Appearance", "Language", "Width:", "Height:", "Output", "Image", "Load diagram"]
]

export {LanguageObj, LanguageWords}
