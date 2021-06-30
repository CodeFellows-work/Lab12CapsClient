'use strict'; 

const io = require('socket.io-client'); 

const client = io.connect('http://localhost:3000'); 
const transit = io.connect('http://localhost:3000/in-transit');
const delivered = io.connect('http://localhost:3000/delivered');

// ===============VENDOR==================
setInterval(() => {
    let date = new Date(); 
    let time = `${date.getHours()}:${date.getMinutes()}`;
    let payloadInfo = {
        event: 'pickup',
        time: time,
        payload: {
            store: 'ABC store',
            orderID: 1234567890,
            customer: 'Bill',
            address: 'ABC store On 1234 234 NE'
        }
    }
    client.emit('pickup', payloadInfo)
}, 5000);
// ================VENDOR PAYLOAD DELIVERED============

delivered.on('delivered', (payload) => {
    console.log(`Thank you for delivering ${payload.payload.orderID}`); 
});


//================DRIVER====================
setInterval(() => {
    client.on('pickup', (payload) => {
        console.log(`Picking up order ${payload.payload.orderID}`);
    });
}, 1500);

setInterval(() => {
    let date = new Date(); 
    let time = `${date.getHours()}:${date.getMinutes()}`;
    let payloadInfo = {
        event: 'in-transit',
        time: time,
        payload: {
            store: 'ABC store',
            orderID: 1234567890,
            customer: 'Bill',
            address: 'ABC store On 1234 234 NE'
        }
    }
    transit.emit('in-transit', payloadInfo)
}, 1500);

setInterval(() => {
    let date = new Date(); 
    let time = `${date.getHours()}:${date.getMinutes()}`;
    let payloadInfo = {
        event: 'delivered',
        time: time,
        payload: {
            store: 'ABC store',
            orderID: 1234567890,
            customer: 'Bill',
            address: 'ABC store On 1234 234 NE'
        }
    }
    delivered.emit('delivered', payloadInfo)
}, 3000);



