'use strict';

const dgram = require('dgram');
const dns = require('dns-socket');
const events = require('events');

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


    getPublicIPv4Address() {
        this.queryIPAddress('ipv4');
    }

    getPublicIPv6Address() {
        this.queryIPAddress('ipv6');
    }

    getPublicIPAddress() {
        this.queryIPAddress('ipv4');
        this.queryIPAddress('ipv6');
    }

    queryIPAddress(version) {
        const data = this.type[version];
        const socket = dns({
            socket: dgram.createSocket(version === 'ipv6' ? 'udp6' : 'udp4'),
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

            this.emit(version, ip ? ip : null);
        });
    }
}

module.exports = PublicIp;