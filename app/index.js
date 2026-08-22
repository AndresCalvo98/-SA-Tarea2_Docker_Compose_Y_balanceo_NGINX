const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Leer datos de las noticias (Simulación de base de datos)
const dataPath = path.join(__dirname, 'data.json');
let noticias = [];
try {
  const rawData = fs.readFileSync(dataPath);
  noticias = JSON.parse(rawData);
} catch (error) {
  console.error("Error leyendo data.json:", error);
}

// Ruta principal: Listado de noticias
app.get('/', (req, res) => {
  res.render('index', { 
    noticias, 
    instanceId: os.hostname(), 
    pageTitle: "Tech & AI News" 
  });
});

// Ruta de detalle de noticia
app.get('/noticia/:id', (req, res) => {
  const noticia = noticias.find(n => n.id === parseInt(req.params.id));
  
  if (!noticia) {
    return res.status(404).render('404', { instanceId: os.hostname() });
  }

  res.render('article', { 
    noticia, 
    instanceId: os.hostname() 
  });
});

// Ruta de API (ejemplo para demostrar otra regla en NGINX)
app.get('/api/info', (req, res) => {
  res.json({
    status: "ok",
    service: "portal-noticias",
    instanceId: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT} - Instancia: ${os.hostname()}`);
});
