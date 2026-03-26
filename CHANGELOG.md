# Changelog

## [1.4.0](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.3.0...v1.4.0) (2026-03-26)


### Features

* **template/storybook:** add addon-vitest integration to storybook overlay ([033af40](https://github.com/Yelihi/quickstart-custom-fsd/commit/033af400f0915a1adc39767242322f285b9476cf))

## [1.3.0](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.2.0...v1.3.0) (2026-03-23)


### Features

* storybook propts 추가 ([61d3285](https://github.com/Yelihi/quickstart-custom-fsd/commit/61d32854877cc18d9ea80388c9c03114dcef7e52))
* **template:** ESLint 9 flat config + Prettier 기본 설정 추가 ([759e3a1](https://github.com/Yelihi/quickstart-custom-fsd/commit/759e3a136126b0b238539f39255377104a47cef1))
* **template:** husky overlay에 lint-staged 연동 ([4078744](https://github.com/Yelihi/quickstart-custom-fsd/commit/4078744b7b328689c2eee3906e552d10425ac0fb))
* **template:** storybook overlay + ESLint 9 + Prettier 기본 설정 추가 ([64fd974](https://github.com/Yelihi/quickstart-custom-fsd/commit/64fd974dfa11ec258e2d34902b1f4f05fa364dca))
* **template:** storybook overlay 추가 (react-vite, next, vue-vite) ([c579aef](https://github.com/Yelihi/quickstart-custom-fsd/commit/c579aefee346e4fe92a653118845f2b684f029db))


### Bug Fixes

* **test:** integration test UserChoices에 storybook 필드 추가 ([661dc45](https://github.com/Yelihi/quickstart-custom-fsd/commit/661dc45ba4e16c21fdc0dfd90173ff160af65390))

## [1.2.0](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.1.3...v1.2.0) (2026-03-22)


### Features

* **scaffold:** scaffold 모듈 분리, E2E 파이프라인 추가 및 템플릿 버그 수정 ([5867a0a](https://github.com/Yelihi/quickstart-custom-fsd/commit/5867a0a2d1e3aec6668d2ac4bb8e749a0ef6ad49))

## [1.1.3](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.1.2...v1.1.3) (2026-03-21)


### Bug Fixes

* **validate:** 프로젝트 이름 유효성 검사 조건 반전 수정 ([fc2106d](https://github.com/Yelihi/quickstart-custom-fsd/commit/fc2106d718cb698edb84c7197eed3b830fef6063))

## [1.1.2](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.1.1...v1.1.2) (2026-03-21)


### Bug Fixes

* **cli:** 쉬뱅 라인 인라인 주석 제거 ([4b829fc](https://github.com/Yelihi/quickstart-custom-fsd/commit/4b829fca7104915de8bc0f9812342249e68d7f9a))

## [1.1.1](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.1.0...v1.1.1) (2026-03-21)


### Bug Fixes

* **ci:** release-please 워크플로우에 npm publish 통합 ([e0d0715](https://github.com/Yelihi/quickstart-custom-fsd/commit/e0d07159aac0136c7930994604a57ba5bd7710df))

## [1.1.0](https://github.com/Yelihi/quickstart-custom-fsd/compare/v1.0.0...v1.1.0) (2026-03-21)


### Features

* **templates:** FSD 예시 코드 및 base-ts 환경 셋팅 추가 ([130a8ab](https://github.com/Yelihi/quickstart-custom-fsd/commit/130a8ab7072767676488d66ef5131c1670c95652))

## 1.0.0 (2026-03-21)


### Features

* core/copy-template ([dc182a1](https://github.com/Yelihi/quickstart-custom-fsd/commit/dc182a1fffc28b094f51017a6aa55201dfeef687))
* core/exec ([dbc09e1](https://github.com/Yelihi/quickstart-custom-fsd/commit/dbc09e108549047939417b52097bff5830a9b5af))
* core/merge-package 그리고 prompt 경로 이동 ([9f120fd](https://github.com/Yelihi/quickstart-custom-fsd/commit/9f120fd53f24ce5ed971744d3f840197901eb9ca))
* core/pm ([8e0499a](https://github.com/Yelihi/quickstart-custom-fsd/commit/8e0499a414b448338fd369735015a57406c9807a))
* core/render ([b66414b](https://github.com/Yelihi/quickstart-custom-fsd/commit/b66414b3a22724875adf49e8725b609cdae0e931))
* core/validate ([6bd6713](https://github.com/Yelihi/quickstart-custom-fsd/commit/6bd67134e78541a4b5fba209f7db0734a5348f50))
* create command 그리고 utils 내 renameGitignore 추가 ([590dd40](https://github.com/Yelihi/quickstart-custom-fsd/commit/590dd4008c2b4caaab414476c194259610923a5e))
* create 내 최종 output 까지 작업 ([7097696](https://github.com/Yelihi/quickstart-custom-fsd/commit/7097696c260b89d2c4d9fdd1b6536e907f2a28bd))
* **templates:** react-vite, next, vue-vite FSD 템플릿 생성 ([fe3f48b](https://github.com/Yelihi/quickstart-custom-fsd/commit/fe3f48b22da3e8ed08348a885d8c22861aa93b74))
* 총괄 index 내 main 부분 작업 ([c8f9c15](https://github.com/Yelihi/quickstart-custom-fsd/commit/c8f9c15e9f842168eedca1b9c5bc533bc3e42f56))


### Bug Fixes

* **core:** overlay package.json 덮어쓰기 및 templates 경로 오류 수정 ([08b2051](https://github.com/Yelihi/quickstart-custom-fsd/commit/08b205156d50edce3fa12ac21e06d957c7aeb8b8))
* **test:** vitest 환경을 jsdom에서 node로 변경 ([9b450aa](https://github.com/Yelihi/quickstart-custom-fsd/commit/9b450aad71061953df8bcd62a3e6e0e7d52d0de0))
