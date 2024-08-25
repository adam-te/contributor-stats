export interface Author {
  login: string; //'adam-te',
  id: number; // 47219987,
  node_id: string; //'MDQ6VXNlcjQ3MjE5OTg3',
  avatar_url: string; //'https://avatars.githubusercontent.com/u/47219987?v=4',
  gravatar_id: string; //'',
  url: string; // 'https://api.github.com/users/adam-te',
  html_url: string; // 'https://github.com/adam-te',
  followers_url: string; // 'https://api.github.com/users/adam-te/followers',
  following_url: string; // 'https://api.github.com/users/adam-te/following{/other_user}',
  gists_url: string; // 'https://api.github.com/users/adam-te/gists{/gist_id}',
  starred_url: string; // 'https://api.github.com/users/adam-te/starred{/owner}{/repo}',
  subscriptions_url: string; // 'https://api.github.com/users/adam-te/subscriptions',
  organizations_url: string; // 'https://api.github.com/users/adam-te/orgs',
  repos_url: string; // 'https://api.github.com/users/adam-te/repos',
  events_url: string; // 'https://api.github.com/users/adam-te/events{/privacy}',
  received_events_url: string; // 'https://api.github.com/users/adam-te/received_events',
  type: "User" | "Organization"; // 'User',
  site_admin: boolean; //false
}

export interface CommitResponse {
  sha: string;
  node_id: string;
  url: string;
  html_url: string;
  comments_url: string;
  author: Author;
  commit: Commit;
  repository: any;
  parents: any[];
}

export interface Commit {
  author: Author;
  committer: Author;
  message: string;
  tree: any;
  url: string;
  comment_count: number;
  verification: any;
}

export interface CommitFileStats {
  sha: string;
  filename: string; // 'frontend/src/js/app/view/state/rootReducer/rootReducer.js',
  status: "modified";
  additions: number; // 1,
  deletions: number; //  1,
  changes: number; // 2,
  blob_url: string; //
  raw_url: string; //
  contents_url: string; //
  patch: string; //
}

export interface CommitSpecifics {
  sha: string;
  node_id: string;
  author: Author;
  committer: Author;
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: CommitFileStats[];
}

export interface Repo {
  id: number; //12657258,
  node_id: string; // "MDEwOlJlcG9zaXRvcnkxMjY1NzI1OA==",
  name: string; // "puppet-teagent",
  full_name: string; // "thousandeyes/puppet-teagent",
  private: boolean; // false,
  owner: Author;
  html_url: string; // "https://github.com/thousandeyes/puppet-teagent",
  description: string; // "Puppet module for the ThousandEyes enterprise agent.",
  fork: boolean; //false,
  url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent",
  forks_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/forks",
  keys_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/keys{/key_id}",
  collaborators_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/collaborators{/collaborator}",
  teams_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/teams",
  hooks_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/hooks",
  issue_events_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/issues/events{/number}",
  events_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/events",
  assignees_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/assignees{/user}",
  branches_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/branches{/branch}",
  tags_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/tags",
  blobs_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/git/blobs{/sha}",
  git_tags_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/git/tags{/sha}",
  git_refs_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/git/refs{/sha}",
  trees_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/git/trees{/sha}",
  statuses_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/statuses/{sha}",
  languages_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/languages",
  stargazers_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/stargazers",
  contributors_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/contributors",
  subscribers_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/subscribers",
  subscription_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/subscription",
  commits_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/commits{/sha}",
  git_commits_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/git/commits{/sha}",
  comments_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/comments{/number}",
  issue_comment_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/issues/comments{/number}",
  contents_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/contents/{+path}",
  compare_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/compare/{base}...{head}",
  merges_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/merges",
  archive_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/{archive_format}{/ref}",
  downloads_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/downloads",
  issues_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/issues{/number}",
  pulls_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/pulls{/number}",
  milestones_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/milestones{/number}",
  notifications_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/notifications{?since,all,participating}",
  labels_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/labels{/name}",
  releases_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/releases{/id}",
  deployments_url: string; // "https://api.github.com/repos/thousandeyes/puppet-teagent/deployments",
  created_at: string; // "2013-09-07T00:16:57Z",
  updated_at: string; // "2021-03-18T22:01:21Z",
  pushed_at: string; // "2021-03-18T22:01:18Z",
  git_url: string; // "git://github.com/thousandeyes/puppet-teagent.git",
  ssh_url: string; // "git@github.com:thousandeyes/puppet-teagent.git",
  clone_url: string; // "https://github.com/thousandeyes/puppet-teagent.git",
  svn_url: string; // "https://github.com/thousandeyes/puppet-teagent",
  homepage: string; //"",
  size: number; // 43,
  stargazers_count: number; // 1,
  watchers_count: number; // 1,
  language: string; // "Puppet",
  has_issues: boolean; // true,
  has_projects: boolean; // true,
  has_downloads: boolean; // true,
  has_wiki: boolean; // true,
  has_pages: boolean; // false,
  has_discussions: boolean; // false,
  forks_count: number; // 15,
  mirror_url: string | null; // null,
  archived: boolean; // false,
  disabled: boolean; // false,
  open_issues_count: number; // 0,
  license: string | null;
  allow_forking: boolean; // true,
  is_template: boolean; // false,
  web_commit_signoff_required: boolean; // false,
  topics: any[]; // [],
  visibility: "public" | "private";
  forks: number; // 15,
  open_issues: number; // 0,
  watchers: number; // 1,
  default_branch: string; // "master",
  permissions: {
    admin: boolean; // false,
    maintain: boolean; // false,
    push: boolean; // false,
    triage: boolean; // false,
    pull: boolean; // true
  };
}

export interface RawCommitStats {
  fileName: string;
  additions: number;
  deletions: number;
  changes: number;
}

export interface GithubUser {
  id: string; // 'adam-te'
  name?: string; // Adam Wilson
  email?: string; // adam@thousandeyes.com
  createdAt: string;

  // Details on the user
  notes?: string;
}

export interface RawGithubUser {
  login: string; //'aamaralb-te',
  id: number; // 103206146,
  node_id: string; // 'U_kgDOBibNAg',
  avatar_url: string; // 'https://avatars.githubusercontent.com/u/103206146?v=4',
  gravatar_id: string; // '',
  url: string; // 'https://api.github.com/users/aamaralb-te',
  html_url: string; // 'https://github.com/aamaralb-te',
  followers_url: string; // 'https://api.github.com/users/aamaralb-te/followers',
  following_url: string; // 'https://api.github.com/users/aamaralb-te/following{/other_user}',
  gists_url: string; // 'https://api.github.com/users/aamaralb-te/gists{/gist_id}',
  starred_url: string; // 'https://api.github.com/users/aamaralb-te/starred{/owner}{/repo}',
  subscriptions_url: string; // 'https://api.github.com/users/aamaralb-te/subscriptions',
  organizations_url: string; // 'https://api.github.com/users/aamaralb-te/orgs',
  repos_url: string; // 'https://api.github.com/users/aamaralb-te/repos',
  events_url: string; // 'https://api.github.com/users/aamaralb-te/events{/privacy}',
  received_events_url: string; // 'https://api.github.com/users/aamaralb-te/received_events',
  type: string; // "User";
  site_admin: boolean; // false;
  name: string; // "Alex Bednell";
  company: string | null;
  blog: string; //"";
  location: string | null;
  email: string | null;
  hireable: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number; // 0;
  public_gists: number; // 0;
  followers: number; // 0;
  following: number; // 1;
  created_at: string; // "2022-04-07T15:56:08Z";
  updated_at: string; // "2024-04-09T13:42:41Z";
}

export interface GithubMember {
  login: string; //"aamaralb-te",
  id: number; //103206146,
  node_id: string; // "U_kgDOBibNAg",
  avatar_url: string; // "https://avatars.githubusercontent.com/u/103206146?v=4",
  gravatar_id: string; //"",
  url: string; //"https://api.github.com/users/aamaralb-te",
  html_url: string; //"https://github.com/aamaralb-te",
  followers_url: string; //"https://api.github.com/users/aamaralb-te/followers",
  following_url: string; //"https://api.github.com/users/aamaralb-te/following{/other_user}",
  gists_url: string; //"https://api.github.com/users/aamaralb-te/gists{/gist_id}",
  starred_url: string; //"https://api.github.com/users/aamaralb-te/starred{/owner}{/repo}",
  subscriptions_url: string; //"https://api.github.com/users/aamaralb-te/subscriptions",
  organizations_url: string; //"https://api.github.com/users/aamaralb-te/orgs",
  repos_url: string; //"https://api.github.com/users/aamaralb-te/repos",
  events_url: string; //"https://api.github.com/users/aamaralb-te/events{/privacy}",
  received_events_url: string; //"https://api.github.com/users/aamaralb-te/received_events",
  type: string; // "User",
  site_admin: boolean; // false
}

export interface GithubCommitHistory {
  author: GithubUser;
  commits: SearchCommit[]; // "webapps";
}

export interface SearchCommit {
  sha: string;
  repo: string;
  files: RawCommitStats[];
}

export interface ContributionStats {
  commits: number;
  additions: number;
  deletions: number;
}

export interface RepoContributionStats extends ContributionStats {
  name: string;
}

export interface GithubUserContributionStats {
  author: GithubUser;
  overall: ContributionStats;
  repos: RepoContributionStats[];
  notes?: string;
}
