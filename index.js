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
        this.queryIPAddress('ipv4', (ip) => {
            this.emit('ip', ip);
        });
    }

    queryPublicIPv6Address() {
        this.queryIPAddress('ipv6', (ip) => {
            this.emit('ip', ip);
        });
    }

    queryPublicIPAddresses() {
        async.parallel({
           ipv4: (callback) => {
               this.queryIPAddress('ipv4', (ip) => {
                   callback(null, ip);
               });
           },
            ipv6: (callback) => {
                this.queryIPAddress('ipv6', (ip) => {
                    callback(null, ip);
                });
            }
        }, (err, results) => {
            this.emit('ip', {
                v4: results.ipv4,
                v6: results.ipv6
            });
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

            if (err) {}

            let ip;
            if (res) {
                ip = res.answers[0] && res.answers[0].data;
            }

            callback(ip ? ip : null);
        });
    }
}

module.exports = PublicIp;