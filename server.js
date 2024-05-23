const express = require('express');
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()) // ส่งด้วย Data JSON
app.use(express.static('public'));
const port = 3000;

// Middleware - บอกวิธีการที่ client ส่งข้อมูลผ่าน middleware
app.use(bodyParser.urlencoded({extended:false})) // ส่งผ่าน Form
app.use(bodyParser.json()) // ส่งด้วย Data JSON

const mysql = require("mysql2/promise");
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'student_database',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
 });

// Endpoint to get data from LongDo API
app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get('https://api.longdo.com/map/services', {
            params: {
                key: '41ba3c4efb8662b11360407728f08213',
                // Include other required parameters here
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


// Route to fetch locations from MySQL
app.get('/api/locations', async (req, res) => {
  try {
      const connection = await dbConn
      const [rows] = await connection.query('SELECT * from location_711')
      res.json(rows);
  } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/api/locations", async (req, res) => {
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    try {
        const store_id = req.body.store_id;
        const store_name = req.body.store_name;
        const lat = req.body.lat;
        const lon = req.body.lon;
        const tel = req.body.tel;
        const address = req.body.address;

        if (!store_id || !store_name || !lat || !lon || !tel || !address) {
                // return res.status(400).json({ message: "ต้องกรอกข้อมูลทุกช่อง." });
                return res.status(400).send(`<h1 style="color: black; background-color: LemonChiffon;">กรุณากรอกข้อมูลให้ครบทุกช่อง.🧐</h1>`);
            }

        const connection = await dbConn
        const rows = await connection.query("insert into location_711 (store_id,store_name,lat,lon,tel,address) values('"+store_id+"','"+store_name+"','"+lat+"','"+lon+"','"+tel+"','"+address+"')")
        // res.status(201).send(rows);
        // res.status(201).send(`<h1 style="color: black; background-color: lightgreen;">🥳 คุณได้ทำการเพิ่มข้อมูลร้าน ${store_id} เรียบร้อยแล้ว 🥳</h1>`);
        res.redirect(303, '/');


    } catch (error) {
        console.error(error);
        res.status(500).send(`<h1 style="color: black; background-color: lightcoral; ">บันทึกรายการร้านไม่สำเร็จ: ${error}</h1>`);
}})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
