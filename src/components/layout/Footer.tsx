import IconGithub from "~icons/mdi/github";

const REPO = "https://github.com/stephansama/pomodoro-web-app";

export function Footer() {
  return (
    <footer className="footer">
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source on GitHub"
      >
        <IconGithub width={16} height={16} aria-hidden="true" />
        <span>Source on GitHub</span>
      </a>
    </footer>
  );
}
