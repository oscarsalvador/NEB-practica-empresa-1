> terraform graph | unflatten -l 45 -f  | dot  -Tpdf  > base-graph.pdf

terraform graph saca en grafo en texto, que otras herramientas pueden parsear y usar. Saca un diagrama muy plano, poco profundo

unflatten es una herramienta de CLI de linux para descolocar los nodos de un grafo, staggering
- `-l 45` para decirle que haga 45 niveles de profundidad
- `-f` para que reorganice bordes

dot imprime el pdf. tiene varias opciones, pero no las he usado en el producto final. Con `-Norientation=90` y `-Grotate=90` se puede girar el grafico (y el texto en los nodos de vuelta), pero se comeria un folio entero y es un poco descarado para el detalle que es hablar de terraform graph

