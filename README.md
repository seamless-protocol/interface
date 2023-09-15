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

## Deployment in IPFS

This app is actively deployed in IPFS. To deploy a new version, follow the next step of intstructions:

1. Create an Infura account and create a new project with IPFS steps enabled with a custom gateway. (This is an upgraded account)
2. Install IPFS CLI: https://blog.infura.io/post/ipfs-file-upload-client-tool
3. Run `yarn build && yarn export`
4. Run ./ipfs-upload-client --id <INFURA_PROJECT_ID> --secret <INFURA_PROJECT_SECRET> --source <POINT_TO_BUILD_FOLDER>
5. Use the the gateway from step one to access the hosted ipfs which will look like below:
   https://seamless-protocol.infura-ipfs.io/ipfs/QmcDp4k9siuUsVrtYxk4drq66JkfVyetdcbGzxWkpYxKQc/
6. Click into the IPFS link within the address bar to get the direct and use this to point a custom domain to it.
   https://bafybeigoimqumlwxnexnacekz2g7ztuuljxj2uqgggaslvlmorxdkowybe.ipfs.dweb.link/
