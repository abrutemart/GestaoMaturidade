const express = require('express');
const cors = require('cors');
const app = express();
const Request = require('tedious').Request;
const Connection = require('tedious').Connection;  

const config = {
    "server": "EC2AMAZ-EB5H4PI",
    "authentication": {
        "type": "default",
        "options": {
        "userName": "sa",
        "password": "sa"
        }
    },
    "options": {
        "port": 1433,
        "database": "DMG",
        "trustServerCertificate": true
    }
} 

app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get("/api/get", (req, res) => {
    var result = {};
    result['registros'] = [];
    const query = req.query.query; console.log(query);
    const connection = new Connection(config);
    connection.on('connect', (err) => { 
        if (err) {
            console.log('Connection Failed');
            throw err;
        }
        console.log("Connected");

        const request = new Request(query, (err, rowCount) => {
            if (err) {
              throw err;
            }
            res.send(result);
            console.log('DONE!'); 
            connection.close();
            res.end();
        });

        request.on('row', (columns) => {
            
            var linha = {};
            columns.forEach((column) => {
                if (column.value === null) {
                    linha[column.metadata.colName] = 'NULL';
                } else {
                    linha[column.metadata.colName] = column.value;
                }
            });

            result['registros'].push(linha);
        });

        connection.execSql(request);

    });
    connection.connect(); 
});

app.post("/api/post", (req, res) => {
    
    const query = req.body.query;
    console.log(query);
    
    const connection = new Connection(config);
    connection.on('connect', (err) => { 
        if (err) {
            console.log('Connection Failed');
            throw err;
        }
        console.log("Connected");

        const request = new Request(query, (err, rowCount) => {
            if (err) {
                throw err;
            }
            console.log('DONE!');
            connection.close();
            res.end();
        });

        request.on('row', (columns) => {
            var linha = {};
            columns.forEach((column) => {
                if (column.value === null) {
                    linha[column.metadata.colName] = 'NULL';
                } else {
                    linha[column.metadata.colName] = column.value;
                }
            });

            result['registros'].push(linha);
        });

        connection.execSql(request);

    });
    connection.connect(); 
});

app.listen(4001, () => {
    console.log("Servidor na porta 4001");
});