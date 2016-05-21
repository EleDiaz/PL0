// Mejor en vez de = poner do

// Declaracion especificando los tipos con sintaxis sin {}
fun hola : a:Tipo b:Tipo -> Tipo
	"Y esto es un comentario ya que molan los de lisp"
	do a + b

// Declaracion sin tipos se deben inferir, se debe recomendar esribir los tipos
fun : a b
	do a + b

// declaracion con tipos y sintaxis {}
fun hola : a:Tipo b:Tipo -> Tipo {
	let x = a + b
	let other = a - b
	let mut a' = a
	a+other*x
}

// Bucle fold
fold elems -> elem with acc {
	// id posible to acces to acc 
	actions
}

// Bucle map
map elems -> elem {

}

// While map
while exp {

}

// Infinite loop
loop {
// Break?
}





// declaracion con tipos forall ????
fun hola : a:* b:* -> * {

}

fun hola : a:* b:* -> Tipo
	= a + b

var mivar : Type = value "Por aqui este valor sirve pa poco"
var mivar "Errror las variables preinicializadas por favor"

