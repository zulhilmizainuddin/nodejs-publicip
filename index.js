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
        if (callback instanceof Function) {
            return this.queryPublicIPv4AddressWithCallback(callback);
        }
        else {
            return this.queryPublicIPv4AddressWithPromise();
        }
    }

    queryPublicIPv6Address(callback) {
        if (callback instanceof Function) {
            return this.queryPublicIPv6AddressWithCallback(callback);
        }
        else {
            return this.queryPublicIPv6AddressWithPromise();
        }
    }

    queryPublicIPAddresses(callback) {
        if (callback instanceof Function) {
            return this.queryPublicIPAddressesWithCallback(callback);
        }
        else {
            return this.queryPublicIPAddressesWithPromise();
        }
    }

    queryPublicIPv4AddressWithCallback(callback) {
        this.queryIPAddress('ipv4', (err, ip) => {
            callback(err, ip);
        });

        return null;
    }

    queryPublicIPv6AddressWithCallback(callback) {
        this.queryIPAddress('ipv6', (err, ip) => {
            callback(err, ip);
        });

        return null;
    }

    queryPublicIPAddressesWithCallback(callback) {
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

        return null;
    }

    queryPublicIPv4AddressWithPromise() {
        return new Promise((resolve, reject) => {
            this.queryIPAddress('ipv4', (err, ip) => {
                if (!err) {
                    resolve(ip);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    queryPublicIPv6AddressWithPromise() {
        return new Promise((resolve, reject) => {
            this.queryIPAddress('ipv6', (err, ip) => {
                if (!err) {
                    resolve(ip);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    queryPublicIPAddressesWithPromise() {
        return new Promise((resolve, reject) => {
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
                    resolve({
                        ipv4: results.ipv4,
                        ipv6: results.ipv6
                    });
                } else {
                    reject(err);
                }
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

            if (err) {
                callback(err, null);
                return;
            }

            let ip = res.answers[0] && res.answers[0].data;
            if (ip) {
                callback(null, ip);
            } else {
                callback(new Error('Failed to retrieve IP address'), null);
            }
        });
    }
}

module.exports = PublicIp;