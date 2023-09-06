# Seamless protocol interface

An open source interface for the decentralized liquidity protocol Seamless

Enabling users to:

- Manage and monitor their positions on the Seamless Protocol, and the overall status of it
- Manage and monitor their positions on the Seamless Safety module
- Participate in the Community Governance

## How to use

Install it and run:

```sh
cp .env.example .env.local
yarn
yarn dev
```

### Troubleshooting

Issue: I cannot connect to `app.seamlessprotocol.com`

The seamless-ui is hosted on IPFS in a decentralized manner. `app.seamlessprotocol.com` just holds a CNAME record to the Cloudflare IPFS gateway. You can use [any](https://ipfs.github.io/public-gateway-checker/) public or private IPFS gateway supporting origin isolation to access aave-ui if for some reason the Cloudflare gateway doesn't work for you

## License

[BSD-3-Clause](./LICENSE.md)

## Credits

To all the Ethereum community
