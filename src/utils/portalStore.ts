const STORAGE = {
  state: 'yarichard-ide-state',
  projects: 'yarichard-ide-projects',
  incubations: 'yarichard-ide-incubations',
  github: 'yarichard-ide-github-token',
};

export type FileEntry = { type: 'file' | 'dir'; content: string };
export type IDEState = {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  fileSystem: Record<string, FileEntry>;
  cwd: string;
};
export type Incubation = { code: string; language: string; timestamp: number };

export const saveIDEState = (state: IDEState) =>
  localStorage.setItem(STORAGE.state, JSON.stringify(state));

export const loadIDEState = (): IDEState | null => {
  const raw = localStorage.getItem(STORAGE.state);
  return raw ? JSON.parse(raw) : null;
};

export const saveProject = (name: string, project: IDEState) => {
  const all = loadProjects();
  all[name] = project;
  localStorage.setItem(STORAGE.projects, JSON.stringify(all));
};

export const loadProjects = (): Record<string, IDEState> => {
  const raw = localStorage.getItem(STORAGE.projects);
  return raw ? JSON.parse(raw) : {};
};

export const loadProject = (name: string): IDEState | null => loadProjects()[name] || null;

export const deleteProject = (name: string) => {
  const all = loadProjects();
  delete all[name];
  localStorage.setItem(STORAGE.projects, JSON.stringify(all));
};

export const saveIncubation = (name: string, code: string, language: string) => {
  const all = loadIncubations();
  all[name] = { code, language, timestamp: Date.now() };
  localStorage.setItem(STORAGE.incubations, JSON.stringify(all));
};

export const loadIncubations = (): Record<string, Incubation> => {
  const raw = localStorage.getItem(STORAGE.incubations);
  return raw ? JSON.parse(raw) : {};
};

export const loadIncubation = (name: string): Incubation | null => loadIncubations()[name] || null;

export const deleteIncubation = (name: string) => {
  const all = loadIncubations();
  delete all[name];
  localStorage.setItem(STORAGE.incubations, JSON.stringify(all));
};

export const setGithubToken = (token: string) =>
  localStorage.setItem(STORAGE.github, token);

export const getGithubToken = (): string | null =>
  localStorage.getItem(STORAGE.github);

export const githubStatus = () =>
  getGithubToken() ? 'GitHub token is set.' : 'No GitHub token. Use: github login <token>';

export const pushToGitHub = async (repo: string, path: string, content: string, message = 'Update from yarichard-international IDE') => {
  const token = getGithubToken();
  if (!token) throw new Error('No GitHub token. Use: github login <token>');

  const get = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${token}` },
  });
  let sha: string | undefined;
  if (get.ok) {
    const data = await get.json();
    sha = data.sha;
  }

  const body = JSON.stringify({
    message,
    content: btoa(content),
    ...(sha ? { sha } : {}),
  });

  const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `GitHub push failed (${resp.status})`);
  }
  return `Pushed to ${repo}/${path}`;
};

let channel: BroadcastChannel | null = null;

export const liveShare = {
  join(room: string, onMessage: (msg: { type: string; payload: any }) => void) {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return false;
    if (channel) channel.close();
    channel = new BroadcastChannel(`yarichard-live-${room}`);
    channel.onmessage = (e) => onMessage(e.data);
    return true;
  },
  send(type: string, payload: any) {
    if (!channel) throw new Error('Not in a live share room. Use: live start <room>');
    channel.postMessage({ type, payload, time: Date.now() });
  },
  leave() {
    channel?.close();
    channel = null;
  },
};
