# nodejs-publicip [![Code Climate](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip/badges/gpa.svg)](https://codeclimate.com/github/zulhilmizainuddin/nodejs-publicip)
Query your IPv4 and IPv6 public IP address from OpenDNS

## Install

    npm install --save nodejs-publicip
    
## API

```javascript
// query public IPv4 address
queryPublicIPv4Address(callback)

// query public IPv6 address
queryPublicIPv6Address(callback)

// query public IPv4 and IPv6 address
queryPublicIPAddresses(callback)
```

## Usage Example

### queryPublicIPv4Address(callback)
```javascript
const PublicIp = require('nodejs-publicip');

const publicIp = new PublicIp();
publicIp.queryPublicIPv4Address((err, ip) => {
    if (err) {
        console.log(`error: ${err}`);
        return;
    }

    console.log(`ip address: ${ip}`);
});
```

### queryPublicIPv6Address(callback)
```javascript
const PublicIp = require('nodejs-publicip');

const publicIp = new PublicIp();
publicIp.queryPublicIPv6Address((err, ip) => {
    if (err) {
        console.log(`error: ${err}`);
        return;
    }

    console.log(`ip address: ${ip}`);
});
```

### queryPublicIPAddresses(callback)
```javascript
const PublicIp = require('nodejs-publicip');

const publicIp = new PublicIp();
publicIp.queryPublicIPAddresses((err, ipv4, ipv6) => {
    if (err) {
        console.log(`error: ${err}`);
        return;
    }

    console.log(`ipv4 address: ${ipv4}`);
    console.log(`ipv6 address: ${ipv6}`);
});
```

## Result Example

    ipv4 address: 113.210.191.235
    ipv6 address: 2001:d08:1810:2b6:e4db:2f8c:8007:630c
