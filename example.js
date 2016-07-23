'use strict';

const PublicIp = require('./index');

const publicIp = new PublicIp();
publicIp
    .on('ipv4', (ip) => {
        console.log(`ipv4 address: ${ip}`);
    })
    .on('ipv6', (ip) => {
        console.log(`ipv6 address: ${ip}`);
    });

publicIp.getPublicIPAddress();