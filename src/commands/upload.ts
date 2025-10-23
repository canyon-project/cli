import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as console from "node:console";

export async function mapCommand(params: any, options: any) {
  const { dsn, repo_id: repoID, commit_sha: sha, provider,build_target } = params;
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
    const fileCoverage = JSON.parse(fileCoverageString)

    if (files[i].includes('-init-')) {
      try {
        const pathString = fs.readFileSync(
            path.resolve(Object.keys(fileCoverage)[0]+'.map'),
            'utf-8',
        );

        Object.entries(fileCoverage).forEach((item:any)=>{
          item[1].inputSourceMap = JSON.parse(pathString)
        })
      } catch (e) {
      }
    }

    data = {
      ...data,
      ...fileCoverage,
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
    buildTarget: build_target||'',
    coverage: Object.keys(data),
  };
  await axios.post(dsn, {
    ...p,
    // 覆盖p中的coverage
    coverage: data,
  });
}
