#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);



if(args[0].toString() == '-p'){
  amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    
    var ex = 'topic_logs';
    var channel = args[1].toString();

    //var args = process.argv.slice(2);
    //var key = (args.length > 0) ? args[0] : 'anonymous.info';
    //var msg = args.slice(1).join(' ') || 'Hello World!';
    
    var message = args[3].toString();



    var user = Number(args[5]);

    var msg = [{
      body: message,
      id: user
    }];

    //var msg = [message,user];

    ch.assertExchange(ex, 'topic', {durable: true});
    ch.publish(ex, channel, new Buffer(JSON.stringify(msg)));
    //ch.publish(ex, channel, new Buffer(msg));
    //console.log(" [x] Sent %s:'%s'", key, msg);
    console.log(" %s has been published to the channel %s from user id %d.", message, channel, user);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
}

if(args[0].toString() == '-s'){
  amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'topic_logs';
    
    var channel = args[1].toString();

    ch.assertExchange(ex, 'topic', {durable: true});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      //console.log(' [*] Waiting for logs. To exit press CTRL+C');
      console.log('You have been subscribed to the channel %s.',channel);

      //args.forEach(function(channel) {
        ch.bindQueue(q.queue, ex, channel);
      //});

      /*ch.consume(q.queue, function(msg) {
        //console.log(" %s: %d published %s", user, msg.fields.routingKey, msg.content.toString());
        console.log("%d ", Number(msg.content));
      }, {noAck: true});
      */
      ch.consume(q.queue, function(msg) {
        //console.log(" %s: %d published %s", user, msg.fields.routingKey, msg.content.toString());
        //console.log("%s published %s.", msg.fields.routingKey, msg.content.toString());
        
        var ar = JSON.parse(msg.content)
        //var data = ar.body.toString();
        console.log("UserId %s published %s ", ar[0]['id'], ar[0]['body']);//,JSON.stringify(msg.id),JSON.stringify(msg.body));
        //console.log(ar[0]['body']);
        //console.log(msg);
        //homes[0]['Agents'][0]['Name']
        //console.log(msg.body);
      }, {noAck: true});
    });
  });
});
}




/*
var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'topic_logs';

    ch.assertExchange(ex, 'topic', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(key) {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, function(msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    });
  });
});*/