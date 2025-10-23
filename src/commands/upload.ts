import * as console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
export async function mapCommand(params: any, options: any) {
  const { dsn, repo_id: repoID, commit_sha: sha, provider } = params;
  if (!fs.existsSync(path.resolve(process.cwd(), '.canyon_output'))) {
    console.log('不存在');
    return;
  }
  const files = fs.readdirSync(path.resolve(process.cwd(), '.canyon_output'));
  let data = {};
  for (let i = 0; i < files.length; i++) {
    const fileCoverageString = fs.readFileSync(
      path.resolve(process.cwd(), '.canyon_output', files[i]),
      'utf-8',
    );
    data = {
      ...data,
      ...JSON.parse(fileCoverageString),
    };
  }

  const p = {
    dsn,
    provider: provider || 'gitlab',
    repoID: repoID || process.env.CI_PROJECT_ID,
    sha: sha || process.env.CI_COMMIT_SHA,
    instrumentCwd: process.cwd(),
    reportID: 'initial_coverage_data',
    reportProvider: 'ci',
    buildTarget: '',
    coverage: Object.keys(data),
  };
  console.log(p);
  await axios.post(dsn, {
    ...p,
    coverage: data,
  });
}
