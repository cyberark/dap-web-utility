# DAP Web Utility
Simplify DAP/Conjur Deployment & Operations

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)  ![](https://img.shields.io/badge/Certification%20Level-Community-28A745?link=https://github.com/cyberark/community/blob/master/Conjur/conventions/certification-levels.md)

![](https://img.shields.io/badge/language-javascript-red.svg)
![](https://img.shields.io/badge/language-jQuery-blue.svg)
![](https://img.shields.io/badge/language-nodeJS-pink.svg)
![](https://img.shields.io/badge/platform-docker-orange.svg)

![](https://img.shields.io/badge/version-0_1-black.svg)

## Features
### Simplicity
- On-screen instructions minimize your time & effort for scripting
- Command-line console is always avaliable to you: click the floating action button at the bottom right of the screen to toggle it
- Smaller in image size, compared to the official [Conjur CLI](https://hub.docker.com/r/cyberark/conjur-cli)
- Comes built-in with handy tools (see below)

### Security
- No persistent storage; your home folder is mounted as our home folder
- The tool uses a native mechanism to manage its own credentials

### Tools
- docker client, docker-compose
- kubectl
- oc client
- SSH Client
- jq
- vi, nano
- SSH Client
- net-tools, including ping
- curl, wget

## Requirements

1. Docker on Linux / macOS
2. Web Browser
3. Internet access

Works with CyberArk DAP v11+ or Conjur OSS v1+.

## Usage instructions

1. Execute `docker run -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v $HOME:/root quincycheng/conjur-webcli:0.1`
2. Navigate to http://localhost:3000 using your preferred web browser

## Future work
 - Master on AWS
 - Standby
 - Followers
 - Integrations
 - More guidelines 

## Contributing

We welcome contributions of all kinds to this repository. For instructions on how to get started and descriptions
of our development workflows, please see our [contributing guide](https://github.com/cyberark/dap-web-utility/blob/master/CONTRIBUTING.md).

## License

This repository is licensed under Apache License 2.0 - see [`LICENSE`](LICENSE) for more details.
