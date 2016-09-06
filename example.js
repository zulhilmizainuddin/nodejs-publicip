'use strict';

const PublicIp = require('./index');

const publicIp = new PublicIp();
publicIp.queryPublicIPAddresses((err, ipv4, ipv6) => {
    if (err) {
        console.log(`error: ${err}`);
        return;
    }

    console.log(`ipv4 address: ${ipv4}`);
    console.log(`ipv6 address: ${ipv6}`);
});