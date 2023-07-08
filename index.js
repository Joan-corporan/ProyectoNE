const express = require("express");
const fs = require("fs-extra");

const app = express();
const PORT = process.env.PORT || 3000;

//Midleware
app.use(express.json())



// 2.5 Modificar un endpoint que devuelva un producto por id o por nombre

// 1. Crear un endpoint que devuelva todos los productos
app.get("/productos", (req, res) => {
    fs.readFile("./db.js", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error en el servidor");
        } else {
            res.status(200).send(data);
        }
    });
});


// 2. Crear un endpoint que devuelva un producto por id
app.get("/productos/:id", (req, res) => {
    fs.readFile("./db.js", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error en el servidor");
        } else {
            const productos = JSON.parse(data);
            const producto = productos.find((producto)=> producto.id === parseInt(req.params.id)  
            
            );
            if (producto) {
                res.status(200).send(producto);
            } else {
                res.status(400).send("producto no encontrado");
            }
        }
    });
});



// 3. Crear un endpoint que cree un producto
app.post('/productos', (req,res)=>{
    
    fs.readFile('./db.js','utf8',(err,data)=>{
        if(err){
            res.status(500).send('Error en el servidor')
            
        } else {
            const productos = JSON.parse(data)
            const nuevoProducto = {
                id: productos.length +1,
                marca: req.body.modelo,
                precio: req.body.precio,
                cantidad: req.body.cantidad
            }
            productos.push(nuevoProducto)
            fs.writeFile('./db.js',JSON.stringify(productos),(err)=>{
                if(err){
                    res.status(500).send('Error en el servidor')
                } else {
                    res.status(200).send(`productos ${nuevoProducto.id}`)
                }
            })
        }
        
    })
})

// 4. Crear un endpoint que modifique un producto

app.put('/productos/:id',(req,res)=>{
    const{marca,modelo,precio,cantidad}= req.body
    fs.readFile('./db.js','utf8',(err,data)=>{
        if(err){
            res.status(500).send('Error en el servidor')
            
        }else{
            const productos= JSON.parse(data)
            const producto = productos.find((producto)=>producto.id===parseInt(req.params.id))
            if(producto){
                producto.marca=marca
                producto.modelo=modelo
                producto.precio=precio
                producto.cantidad=cantidad
                fs.writeFile('./db.js',JSON.stringify(productos),(err)=>{
                    if(err){
                        res.status(500).send('Error en el servidor')
                    }else{
                        res.status(200).send('Producto actualizado')
                    }
                    
                })
            }else{
                res.status(400).send(`No se encuentra el producto con id ${req.params.id}`)
            }
        }
    })
})

// 5. Crear un endpoint que elimine un producto
app.delete('/productos/:id', (req, res) => {

    fs.readFile('./db.js', 'utf8', (err, data) => {
  
      if (err) {
  
        res.status(500).send('Error en el servidor')
  
      } else {
  
        const productos = JSON.parse(data)
  
        const producto = productos.find((producto) => producto.id === parseInt(req.params.id))
  
        if (producto) {
  
          const index = productos.indexOf(producto)
  
          productos.splice(index, 1)
  
          fs.writeFile('./db.js', JSON.stringify(productos), (err) => {
  
            if (err) {
  
              res.status(500).send('Error en el servidor')
  
            } else {
  
              res.status(200).send(`Producto con el id ${req.params.id} eliminado correctamente`)
  
            }
  
          })
  
        } else {
  
          res.status(404).send(`No se encuentra producto con el id ${req.params.id}`)
  
        }
  
      }
  
    })
  
  })


app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
