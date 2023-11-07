import express from "express"
import cors from "cors"
import mysql from "mysql2/promise"

const db = await mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'farmacia',
   namedPlaceholders: true

})

console.log("conectado a la base de datos")


//CREAR APLICACION EXPRES
const app = express()
app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
   res.send("hola mundo")
})

//GET -LISTAR TODOS LOS PRODUCTOS ---
app.get("/producto", async (req, res) => {
   try {
      const [rows, fields] = await db.execute("SELECT * FROM producto");
      res.send(rows);
   } catch (error) {
     console.error("Error al consultar la base de datos:", error);
     res.status(500).send("Error al consultar la base de datos");
   }
 });

//GET -BUSCAR PRODUCTOS POR NOMBRE ---
app.get("/producto/:nombre", async (req,res) => {
   const nombre = req.params.nombre
   const [rows,fields] = await db.execute("SELECT * FROM producto WHERE nombre=:nombre" , {
      nombre
   })
   if (rows.length > 0 ) {
      res.send(rows[0])
   } else {
      res.status(404).send({mensaje: "Producto no encontrado" })
   } 
})

//INGRESAR PRODUCTOS ---
app.post("/producto", async (req, res) => {
   try {
     const producto = req.body.producto;
     const [rows] = await db.execute(
       "INSERT INTO producto (nombre, codigo, precio, stock) VALUES (:nombre, :codigo, :precio, :stock)",
       { nombre: producto.nombre, codigo: producto.codigo, precio: producto.precio, stock: producto.stock }
     );
 
     res.status(201).send({ ...producto, id: rows.insertId });
   } catch (error) {
     console.error("Error al ingresar producto:", error);
     res.status(201).send("Error al ingresar producto"); 
   }
 });
 

//ACTUALIZAR NOMBRE DEL PRODUCTO ---
app.put("/producto/:id" , async (req,res) => {   
   const idreq = req.params.id
   const producto = req.body.producto
   await db.execute("UPDATE producto SET nombre=:nombre , precio=:precio,codigo=:codigo, stock=:stock WHERE id=:id",{
      id: idreq, nombre: producto.nombre, precio: producto.precio, codigo: producto.codigo, stock: producto.stock
   })
   res.send("ok")
})

//ELIMINAR PRODUCTO POR SU NOMBRE
app.delete("/producto/:nombre", async (req, res) => {
   const nombre = req.params.nombre;
   await db.execute("DELETE FROM producto WHERE nombre=:nombre", { nombre });
   res.send("ok");
 });


//PONER EN MARCHA API,FUNCIONANDO EN PUERTO 3000
app.listen(3000, () => {
   console.log("api en funcionamiento")
})


 
