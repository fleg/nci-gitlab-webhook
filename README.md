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

By default plugin processes only GitLab `Push Hook` events to run build
on new commits in default branch (specified in `scm.rev` section of project
config).

Plugin will run build on GitLab Merge Request opening or new commits in
source branch if `Merge Request Hook` specified in GitLab.

Also plugin supports force build running via adding MR comment with text
`/run_ci`.

Plugin requires following events in GitLab webhook:

- Push Hook
- Merge Request Hook
- Note Hook

## Skip builds

You can avoid of build creation by adding `[skip ci]` or `[ci skip]` to
commit message.

## License

[The MIT License](https://raw.githubusercontent.com/node-ci/nci-gitlab-webhook/master/LICENSE)
