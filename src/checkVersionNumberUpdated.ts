
import fetch from "node-fetch";
export const urlJoin: typeof import("path").join = require("url-join");
import * as core from '@actions/core';
import * as path from "path";


export async function checkVersionNumberUpdated(params: Record<"repository", string>) {

    const { repository } = params;

    const { version } = require(path.join(process.cwd(), "./package.json"));

    core.debug("version: " + version);

    const latest_version_deployed = await fetch(
        urlJoin(
            "https://raw.github.com",
            repository,
            "master",
            "package.json"
        )
    )
        .then(res => res.text())
        .then(text => JSON.parse(text))
        .then(({ version }) => version as string)
        .catch(() => undefined)
        ;

    if (latest_version_deployed === undefined) {

        core.debug("No version of the module have been deployed yet");

        return;

    }

    if (latest_version_deployed === version) {

        core.setFailed(`The package.json version ( currently ${version} ) need to be bumped`);

        return;

    }

    core.debug(`Ok ${latest_version_deployed} -> ${version}`);

}