const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const stream = require('stream');
const os = require('os');

const docker = new Docker();
const returnHomeRouter = (io) => {


    router.get('/', (req, res, next) => {
        res.render('home');
    });

    io.on('connection', (socket) => {
        socket.on('exec', (id, w, h) => {
            //const container = docker.getContainer(id);
            const container = docker.getContainer(os.hostname);

            let cmd = {
                "AttachStdout": true,
                "AttachStderr": true,
                "AttachStdin": true,
                "Tty": true,
                Cmd: ['/bin/bash','--init-file','/opt/dap-web-utility/bin/.bashrc']
            };
            container.exec(cmd, (err, exec) => {
                let options = {
                    'Tty': true,
                    stream: true,
                    stdin: true,
                    stdout: true,
                    stderr: true,
                    hijack: true
                };

                container.wait((err, data) => {
                    socket.emit('end', 'ended');
                });

                if (err) {
                    return;
                }

                exec.start(options, (err, stream) => {
                    const dimensions = {h, w};
                    if (dimensions.h != 0 && dimensions.w != 0) {
                        exec.resize(dimensions, () => {
                        });
                    }

                    stream.on('data', (chunk) => {
                        socket.emit('show', chunk.toString());
                    });

                    socket.on('cmd', (data) => {
                        stream.write(data);
                    });

                });
            });
        });

        socket.on('attach', (id, w, h) => {
            //const container = docker.getContainer(id);
            const container = docker.getContainer(os.hostname);

            const logStream = new stream.PassThrough();
            logStream.on('data', (chunk) => {
                socket.emit('show', chunk.toString('utf8'));
            });

            var logs_opts = {
                follow: true,
                stdout: true,
                stderr: true,
                timestamps: false
            };

            function handler(err, stream) {
                container.modem.demuxStream(stream, logStream, logStream);
                if (!err && stream) {
                    stream.on('end', () => {
                        logStream.end('===Logs stream finished===');
                        socket.emit('end', 'ended');
                        stream.destroy();
                    });
                }
            }

            container.logs(logs_opts, handler);
        });

        socket.on('getSysInfo', function (id) {
            //const container = docker.getContainer(id);
            const container = docker.getContainer(os.hostname);
            container.stats((err, stream) => {
                if (!err && stream != null) {
                    stream.on('data', (data) => {
                        socket.emit(id, data.toString('utf8'));
                    });
                    stream.on('end', () => {
                        socket.emit('end', 'ended');
                        stream.destroy();
                    });
                }
            });
        });

        socket.on('end', () => {
            array = [];
            streams.map((stream) => {
                stream.destroy();
            });
            console.log('socket ended');

        });


        let array = [];
        let streams = [];
        socket.on('getContainersInfo', (id) => {
            id = os.hostname;
            if (array.indexOf(id) === -1) {
                array.push(id);
                console.log("socket.io => getContainersInfo " + id);
                var container = docker.getContainer(id);
                container.stats((err, stream) => {
                    streams.push(stream);
                    if (!err && stream != null) {
                        stream.on('data', (data) => {
                            const toSend = JSON.parse(data.toString('utf8'));
                            socket.emit("containerInfo", toSend);
                        });
                        stream.on('end', function () {
                            socket.emit('end', 'ended');
                            stream.destroy();
                        });
                    }
                });
            }

        });

    });

    return router;
};

module.exports = returnHomeRouter;

