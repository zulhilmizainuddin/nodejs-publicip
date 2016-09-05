'use strict';

const dgram = require('dgram');
const dns = require('dns-socket');
const events = require('events');
const async = require('async');

class PublicIp extends events.EventEmitter {

    constructor() {
        super();

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

    queryPublicIPv4Address() {
        this.queryIPAddress('ipv4', (err, ip) => {
            if (err) {
                this.emit('error', err);
                return;
            }

            this.emit('ip', ip);
        });
    }

    queryPublicIPv6Address() {
        this.queryIPAddress('ipv6', (err, ip) => {
            if (err) {
                this.emit('error', err);
                return;
            }

            this.emit('ip', ip);
        });
    }

    queryPublicIPAddresses() {
        async.parallel({
           ipv4: (callback) => {
               this.queryIPAddress('ipv4', (err, ip) => {
                   callback(err, ip);
               });
           },
            ipv6: (callback) => {
                this.queryIPAddress('ipv6', (err, ip) => {
                    callback(err, ip);
                });
            }
        }, (err, results) => {
            if (results.ipv4 || results.ipv6) {
                this.emit('ip', {
                    v4: results.ipv4,
                    v6: results.ipv6
                });
            } else {
                this.emit('error', err);
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