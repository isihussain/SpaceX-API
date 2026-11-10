<p align="center"><img src="https://live.staticflickr.com/65535/49185149122_37f5c52e43_k.jpg"></p>

<h1 align="center">SpaceX REST API (Community Fork)</h1>

<h3 align="center">
Open Source REST API for launch, rocket, core, capsule, starlink, launchpad, and landing pad data.
</h3>

<p align="center">
<a href="https://github.com/isihussain/SpaceX-API/actions/workflows/ci.yml"><img src="https://github.com/isihussain/SpaceX-API/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<a href="https://github.com/isihussain/SpaceX-API/releases"><img src="https://img.shields.io/github/release/isihussain/SpaceX-API.svg?longCache=true&style=flat-square" alt="Release"></a>
<a href="https://en.wikipedia.org/wiki/Representational_state_transfer"><img src="https://img.shields.io/badge/interface-REST-brightgreen.svg?longCache=true&style=flat-square" alt="REST"></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg?style=flat-square" alt="Node.js"></a>
</p>

> [!NOTE]
> **Community Modernization Fork**: Upstream `r-spacex/SpaceX-API` was archived in read-only mode. This repository (`isihussain/SpaceX-API`) is actively maintained by the community with bug fixes, Node 20 LTS runtime support, modernized background sync jobs, expanded test coverage, and upcoming Starship & Raptor engine endpoints.

<h4 align="center">
  <i>
    We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Space Exploration Technologies Corp (SpaceX), or any of its subsidiaries or its affiliates. The names SpaceX as well as related names, marks, emblems and images are registered trademarks of their respective owners.
  </i>
</h4>

<h3 align="center">
<a href="docs/README.md">Docs</a> - <a href="docs/clients.md">API Clients</a> - <a href="docs/apps.md">Apps</a> - <a href="docs/queries.md">Query Guide</a>
<br/>
</h3>

## Recent Improvements & Resolved Upstream Issues

- **Schema Consistency (#1368)**: Corrected `tdb` typo to `tbd` in launch schemas and examples, and documented `launch_library_id`.
- **Server Resilience (#1346)**: Structured uncaught exception and rejection logging with full stack traces, ensuring container orchestrators (Kubernetes/Docker) trigger restarts on exit code 1.
- **Robust Webcast ID Parsing (#1350)**: Fixed YouTube video ID extraction to handle short URLs, parameters, and empty queries.
- **Unit Test Coverage (#1354)**: Comprehensive Jest test suite added covering parser edge cases, constants, healthcheck guards, and query transforms.
- **Runtime & Container Hardening**: Upgraded runtime to Node.js 20 LTS and Docker image to `node:20-alpine`.
- **Automated CI**: GitHub Actions workflow covering Node 18 & Node 20 matrices.
- **Launch Library 2 Sync Modernization**: Added defensive guards and custom User-Agent to prevent rate-limit rejections.

## Usage

```
GET https://api.spacexdata.com/v5/launches/latest
```

```json
{
  "fairings": null,
  "links": {
    "patch": {
      "small": "https://images2.imgbox.com/eb/0f/Vev7xkUX_o.png",
      "large": "https://images2.imgbox.com/ab/79/Wyc9K7fv_o.png"
    },
    "reddit": {
      "campaign": "https://www.reddit.com/r/spacex/comments/fjf6rr/dm2_launch_campaign_thread/",
      "launch": "https://www.reddit.com/r/spacex/comments/glwz6n/rspacex_cctcap_demonstration_mission_2_general",
      "media": "https://www.reddit.com/r/spacex/comments/gp1gf5/rspacex_dm2_media_thread_photographer_contest/",
      "recovery": "https://www.reddit.com/r/spacex/comments/gu5gkd/cctcap_demonstration_mission_2_stage_1_recovery/"
    },
    "flickr": {
      "small": [],
      "original": [
        "https://live.staticflickr.com/65535/49927519643_b43c6d4c44_o.jpg",
        "https://live.staticflickr.com/65535/49927519588_8a39a3994f_o.jpg"
      ]
    },
    "presskit": "https://www.nasa.gov/sites/default/files/atoms/files/commercialcrew_press_kit.pdf",
    "webcast": "https://youtu.be/xY96v0OIcK4",
    "youtube_id": "xY96v0OIcK4",
    "article": "https://spaceflightnow.com/2020/05/30/nasa-astronauts-launch-from-us-soil-for-first-time-in-nine-years/",
    "wikipedia": "https://en.wikipedia.org/wiki/Crew_Dragon_Demo-2"
  },
  "static_fire_date_utc": "2020-05-22T17:39:00.000Z",
  "static_fire_date_unix": 1590169140,
  "tbd": false,
  "net": false,
  "window": 0,
  "rocket": "5e9d0d95eda69973a809d1ec",
  "success": true,
  "failures": [],
  "details": "SpaceX will launch the second demonstration mission of its Crew Dragon vehicle as part of NASA's Commercial Crew Transportation Capability Program (CCtCap), carrying two NASA astronauts to the International Space Station.",
  "crew": [
    "5ebf1b7323a9a60006e03a7b",
    "5ebf1a6e23a9a60006e03a7a"
  ],
  "ships": [
    "5ea6ed30080df4000697c913"
  ],
  "capsules": [
    "5e9e2c5df359188aba3b2676"
  ],
  "payloads": [
    "5eb0e4d1b6c3bb0006eeb257"
  ],
  "launchpad": "5e9e4502f509094188566f88",
  "auto_update": true,
  "flight_number": 94,
  "name": "CCtCap Demo Mission 2",
  "date_utc": "2020-05-30T19:22:00.000Z",
  "date_unix": 1590866520,
  "date_local": "2020-05-30T15:22:00-04:00",
  "date_precision": "hour",
  "upcoming": false,
  "cores": [
    {
      "core": "5e9e28a7f3591817f23b2663",
      "flight": 1,
      "gridfins": true,
      "legs": true,
      "reused": false,
      "landing_attempt": true,
      "landing_success": true,
      "landing_type": "ASDS",
      "landpad": "5e9e3032383ecb6bb234e7ca"
    }
  ],
  "launch_library_id": "5eb87cd9ffd86e000604b32a",
  "id": "5eb87d46ffd86e000604b388"
}
```

## Local Development

### Prerequisites
- Node.js `>= 18.0.0` (Recommended: Node 20 LTS)
- MongoDB `>= 5.0`
- Redis `>= 6.0`

### Quickstart
```bash
git clone https://github.com/isihussain/SpaceX-API.git
cd SpaceX-API
npm install
npm test
npm start
```

### Docker
```bash
docker build -t spacex-api .
docker run -p 6673:6673 --env-file .env spacex-api
```