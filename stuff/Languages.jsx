
const LanguageObj = (words, lang) =>{

	if (lang === undefined || lang === null){
		lang = 1;
	}

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
		loadDiagram: words[lang][15],
		select: words[lang][16],
		extension: words[lang][17]
	}
}

const LanguageWords = [
	["Importar", "Exportar", "Cuadrado","Circulo", "Configuracion", "Seleccionar diagrama", "Exportar como JSON",
		"Exportar como imagen", "Nodos", "Apariencia", "Lenguaje", "Ancho:", "Alto:", "Salida", "Imagen",
	"Cargar diagrama", "Seleccionar de aqui", "Extension"],

	["Import", "Export", "Square", "Circle" ,"Settings", "Select diagram", "Export as JSON", "Export as image", "Nodes",
		"Appearance", "Language", "Width:", "Height:", "Output", "Image", "Load diagram", "Select from here", "Extension"],

	["Importare", "Esportare", "Quadrato", "Cerchio", "Impostazioni", "Seleziona diagramma", "Esporta come JSON",
		"Esporta come immagine", "Nodi", "Aspetto", "Lingua", "Larghezza:", "Altezza:", "Output", "Immagine",
	"Carica diagramma", "Seleziona da qui", "Estensione"],

	["Importer", "Exporter", "Carré", "Cercle", "Paramètres", "Sélectionner un diagramme", "Exporter en JSON",
		"Exporter en image", "Nœuds", "Apparence", "Langue", "Largeur:", "Hauteur:", "Sortie", "Image",
	"Charger un diagramme", "Sélectionner d'ici", "Extension"]
]

export {LanguageObj, LanguageWords}
