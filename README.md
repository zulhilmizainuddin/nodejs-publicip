# nodejs-publicip [![Code Climate](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip/badges/gpa.svg)](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip)
Event emitter for querying your IPv4 and IPv6 public IP address from OpenDNS

## Install

    npm install --save nodejs-publicip
    
## API

```javascript
// query public IPv4 address
queryPublicIPv4Address()

// query public IPv6 address
queryPublicIPv6Address()

// query public IPv4 and IPv6 address
queryPublicIPAddresses()
```

## Usage Example

```javascript
const PublicIp = require('nodejs-publicip');

const publicIp = new PublicIp();
publicIp
    .on('ip', (ip) => {
        console.log(`ipv4 address: ${ip.v4}`);
        console.log(`ipv6 address: ${ip.v6}`);
    });

publicIp.queryPublicIPAddresses();
```

## Result Example

    ipv4 address: 113.210.191.235
    ipv6 address: 2001:d08:1810:2b6:e4db:2f8c:8007:630c
