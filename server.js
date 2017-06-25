var express = require('express');
var unirest = require('unirest');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var config = require('./config');
var events = require('events');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var Recipe = require('./models/recipe');
app.use(express.static('public'));
app.use(bodyParser.json());

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

//function to make the external API call
var getRecipe = function(recipeName) {
    var emitter = new events.EventEmitter();
    var keyword = '';
    var cuisine = '';
    unirest.get("http://api.yummly.com/v1/api/recipes?_app_id=efb53f7e&_app_key=0ac4d25d064640db602125d899e35a71&q=" + keyword + "&allowedCuisine[]=cuisine^cuisine-" + cuisine + "&requirePictures=true")
        .header("Accept", "application/json")
        .end(function(result) {
            console.log(result.status, result.headers, result.body);

            if (result.ok) {
                emitter.emit('end', result.body);
            }
            //failure scenario
            else {
                //console.log("error line 28");
                emitter.emit('error', result.code);
            }
        });
    return emitter;
};

//create get endpoint for ajax to access the external API results data
app.get('/search/:recipeName', function(req, res) {
    //first API call
    var getRecipeNames = getRecipe(req.params.recipeName);

    //get the data from the first api call
    getRecipeNames.on('end', function(item) {
        res.json(item);
        //get the artists and ID for use in next call
    });
    getRecipeNames.on('error', function(code) {
        res.sendStatus(code);
    });

});


app.get('/recipe', function(req, res) {
    Recipe.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
    });
});

app.post('/recipe/:recipeName', function(req, res) {
    Recipe.create({
        name: req.params.recipeName
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

app.put('/recipe/:recipeName', function(req, res) {
    Recipe.find(function(err, items) {
        if (err) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }
        Recipe.update({
            _id: req.body.id
        }, {
            $set: {
                name: req.body.name
            }
        }, function() {
            res.status(201).json(items);
        });
    });
});

app.delete('/recipe/:recipeId', function(req, res) {
    Recipe.findByIdAndRemove(req.params.recipeId, function(err, items) {
        if (err)
            return res.status(404).json({
                message: 'Item not found.'
            });

        res.status(201).json(items);
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

//server listener/settings
app.listen(process.env.PORT || 8080);