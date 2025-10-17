代办项

upload
- [x] 对于init json，先尝试找input SourceMap


参考 https://docs.hoppscotch.io/documentation/clients/cli/overview#hopp-test

md.canyonjs.io 玩一下

node bin/canyon upload --dsn=http://canyon1010.fws.qa.nt.ctripcorp.com/coverage/client --repo_id=$CI_PROJECT_ID --instrument_cwd=$CI_PROJECT_DIR --sha=$CI_COMMIT_SHA --branch=$CI_COMMIT_REF_NAME --provider=gitlab
