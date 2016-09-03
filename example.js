'use strict';

const PublicIp = require('./index');

const publicIp = new PublicIp();
publicIp
    .on('ip', (ip) => {
        console.log(`ipv4 address: ${ip.v4}`);
        console.log(`ipv6 address: ${ip.v6}`);
    });

publicIp.queryPublicIPAddress();