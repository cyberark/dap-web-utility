/*
const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const docker = new Docker();


router.get('/home', function (req, res, next) {
    docker.info(function (err, info) {
        if (err) {
            res.json({
                msg: "error",
                message: "Docker is running ?"
            });
        } else {
            res.json(info);
        }
    });
});
*/

/**
 * containers list
 */
/*
router.get('/containers', function (req, res, next) {
    docker.listContainers({all: true}, function (err, containers) {
        res.json(containers);
    });
});

router.get('/containers/start/:id', function (req, res, next) {
    const container = docker.getContainer(req.params.id);
    container.start(function (err, data) {
        if (!err) {
            res.json({
                code: 200,
                msg: 'OK'
            })
        } else {
            res.json({
                code: 400,
                msg: err.toString()
            })
        }
    });
});

router.get('/containers/stop/:id', function (req, res, next) {
    const container = docker.getContainer(req.params.id);
    container.stop(function (err, data) {
        if (!err) {
            res.json({
                code: 200,
                msg: 'OK'
            })
        } else {
            res.json({
                code: 400,
                msg: err.toString()
            })
        }
    });
});

router.get('/containers/remove/:id', function (req, res, next) {
    const container = docker.getContainer(req.params.id);
    container.remove({force: true}, function (err, data) {
        if (!err) {
            res.json({
                code: 200,
                msg: 'OK'
            })
        } else {
            res.json({
                code: 400,
                msg: err.toString()
            })
        }
    });
});

router.get('/images', function (req, res, next) {
    docker.listImages(null, function (err, listImages) {
        if (err) {
            res.json(err);
        } else {
            res.json(listImages);
        }
    });
});

router.get('/images/remove/:id', function (req, res, next) {
    let imageId = req.params.id;
    if (imageId.indexOf(":") > 0) {
        imageId = imageId.split(":")[1];
    }
    const image = docker.getImage(imageId);
    image.remove({force: true}, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

router.get('/search/:name', function (req, res, next) {
    const name = req.params.name;
    docker.searchImages({term: name}, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

module.exports = router;
*/