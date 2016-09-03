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

    queryPublicIPAddress() {
        async.parallel([
            () => this.queryIPAddress('ipv4'),
            () => this.queryIPAddress('ipv6')
        ]);
    }

    queryIPAddress(version) {
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

            if (version === 'ipv4') {
                this.ipv4 = ip ? ip : null;
            } else {
                this.ipv6 = ip ? ip : null;
            }

            if (this.ipv4 !== undefined && this.ipv6 !== undefined) {
                this.emit('ip', {
                    v4: this.ipv4,
                    v6: this.ipv6
                });
            }
        });
    }
}

module.exports = PublicIp;