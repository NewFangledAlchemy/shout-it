/**
 * Created by towens on 11/11/13.
 * Jeff edited
 */
var httpd = require('http').createServer(handler);
var io =  require('socket.io').listen(httpd);
var fs = require('fs');

httpd.listen(4000);

function handler(req, res){
    fs.readFile(__dirname + '/client.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading client.html');
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}

io.sockets.on('connection', function(socket){

    //task on receiving client message event
    socket.on('clientMessage', function(content){
        socket.emit('serverMessage','You said: ' + content);

        socket.get('username', function(err, username){
            if (!username) username = socket.id;
        socket.broadcast.emit('serverMessage', username.name + ' Age: ' + username.age + ' said: ' + content);
        });
    });

    //task on receiving login event
    socket.on('login', function(username){
        socket.set('username', username, function(err){
            if (err) { throw err;}
            socket.emit('serverMessage', 'Currently logged in as ' + username.name + ' Age: ' + username.age);
            socket.broadcast.emit('serverMessage', 'User ' + username.name + ' logged in');
        });
    });

    //task when user disconnects
    socket.on('disconnect', function(){
        socket.get('username', function(err,username){
            if(!username) username = socket.id;
            socket.broadcast.emit('serverMessage', 'User ' + username.name + ' disconnected');
        });
    });

    //emits the login event to the client after connection
    socket.emit('login');
});