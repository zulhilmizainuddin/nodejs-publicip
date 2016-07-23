# nodejs-publicip [![Code Climate](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip/badges/gpa.svg)](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip)
Query your IPv4 and IPv6 public IP address from OpenDNS

Based on implementation of https://github.com/sindresorhus/public-ip.

## Install

    npm install --save nodejs-publicip
    
## API

```javascript
// query public IPv4 address
getPublicIPv4Address()

// query public IPv6 address
getPublicIPv6Address()

// query public IPv4 and IPv6 address
getPublicIPAddress()
```

## Usage Example

```javascript
const PublicIp = require('nodejs-publicip');

const publicIp = new PublicIp();
publicIp
    .on('ipv4', (ip) => {
        console.log(`ipv4 address: ${ip}`);
    })
    .on('ipv6', (ip) => {
        console.log(`ipv6 address: ${ip}`);
    });

publicIp.getPublicIPAddress();
```

## Result Example

    ipv4 address: 113.210.191.235
    ipv6 address: 2001:d08:1810:2b6:e4db:2f8c:8007:630c
