
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/topic/new', (req, res) => {
    fs.readdir('data', (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', { topics: files });
    });
});
app.get(['/topic', '/topic/:id'], (req, res) => {
    fs.readdir('data', (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        let id = req.params.id;
        if (id) {
            // id값이 있을때
            fs.readFile(`data/${id}`, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', { title: id, topics: files, description: data });
            });
        } else {
            // id값이 없을때
            res.render('view', { title: 'Welcome', description: 'Hello Javascript for server', topics: files });
        }
    });
});
app.post('/topic', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    fs.writeFile(`data/${title}`, description, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect(`/topic/${title}`);
    })
});

app.listen(3000, () => {
    console.log('Connected, 3000 port!');
})