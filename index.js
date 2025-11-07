import fetch from "node-fetch";

export default async function deploy_to_github({ repo_name, files, commit_message }) {
  const token = process.env.GITHUB_TOKEN;
  const owner = "TousifShaikh7";

  // 1. Create repo if not exists
  await fetch(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      name: repo_name,
      private: false
    })
  });

  // 2. Loop through files and upload them
  for (const file of files) {
    const url = `https://api.github.com/repos/${owner}/${repo_name}/contents/${file.path}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: commit_message,
        content: Buffer.from(file.content).toString("base64")
      })
    });
  }

  return { success: true, message: `Code deployed to https://github.com/${owner}/${repo_name}` };
}
