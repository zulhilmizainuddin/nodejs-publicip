'use strict';

const dgram = require('dgram');
const dns = require('dns-socket');
const events = require('events');
const async = require('async');

class PublicIp {

    constructor() {
        this.type = {
            ipv4: {
                server: '208.67.222.222',
                question: {
                    name: 'myip.opendns.com',
                    type: 'A'
                }
            },
            ipv6: {
                server: '2620:0:ccc::2',
                question: {
                    name: 'myip.opendns.com',
                    type: 'AAAA'
                }
            }
        };
    }

    queryPublicIPv4Address(callback) {
        this.queryIPAddress('ipv4', (err, ip) => {
            callback(err, ip);
        });
    }

    queryPublicIPv6Address(callback) {
        this.queryIPAddress('ipv6', (err, ip) => {
            callback(err, ip);
        });
    }

    queryPublicIPAddresses(callback) {
        async.parallel({
           ipv4: (answer) => {
               this.queryIPAddress('ipv4', (err, ip) => {
                   answer(err, ip);
               });
           },
            ipv6: (answer) => {
                this.queryIPAddress('ipv6', (err, ip) => {
                    answer(err, ip);
                });
            }
        }, (err, results) => {
            if (results.ipv4 || results.ipv6) {
                callback(null, results.ipv4, results.ipv6);
            } else {
                callback(err, null, null);
            }
        });
    }

    queryIPAddress(version, callback) {
        const data = this.type[version];
        const socket = dns({
            socket: dgram.createSocket(version === 'ipv4' ? 'udp4' : 'udp6'),
            retries: 1
        });

        socket.query.bind(socket);
        socket.query({
            questions: [data.question]
        }, 53, data.server, (err, res) => {
            socket.destroy();

            if (err) {
                callback(err.message, null);
                return;
            }

            let ip = res.answers[0] && res.answers[0].data;
            if (ip) {
                callback(null, ip);
            } else {
                callback('Failed to retrieve IP address', null);
            }
        });
    }
}

module.exports = PublicIp;