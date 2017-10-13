# nci-gitlab-webhook

[gitlab](https://gitlab.com) webhook plugin for [nci](https://github.com/node-ci/nci)

## Dependencies

[nci-express](https://github.com/node-ci/nci-express)

## Installation

```sh
npm install nci-gitlab-webhook
```

## Usage

Add this plugin to the `plugins` section at server config
```yml
plugins:
    - nci-gitlab-webhook
```
after that you can set gitlab webhook at project config
```yml
webhooks:
    gitlab:
        secret: '123456'
```
plugin will listen `POST /webhooks/:projectName/gitlab` and will get secret
from ```X-Gitlab-Token``` request header.

Plugin also will listen `POST /webhooks/:projectName/gitlab/123456` to
get secret from url for backward compatibility (will be removed on next
major release).

Please prefer first method (with request header) for new installations.

## License

[The MIT License](https://raw.githubusercontent.com/node-ci/nci-gitlab-webhook/master/LICENSE)
