# Linting and Formatting
For consistency and predictable organization of code, this project uses [Eslint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting. 

## The Setup
The configuration for Eslint and prettier can be found at the root of this project:
- Eslint - `.eslintrc.js`
- Prettier - `.prettierrc`

VSCode is configured to automatically fix fixable linting errors on save. See `.vscode/settings.json`.

With `package.json`, there scripts that you can run to lint, autoFix and format the entire codebase.

```
"lint": "eslint --ext .js --ext .jsx .",
"fix": "eslint --ext .js --ext .jsx . --fix",
"format": "prettier --write",
```

##  Git Commit hooks
Git commit hooks are a provision that allows us run custom scripts when specific events occur in the git workflow. [See more here](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

For this project, we are using the clientside commit hooks to automatically lint and alphabetize staged files before they get committed.

## Auto-alphabetization of translation files
This is meant to help ensure consistency and ease of reference within the translation files. For this, we are making use of git hooks via a package called [husky](https://typicode.github.io/husky/#/). Husky allows us to configure a defined pre-commit command which triggers the `precommit` script within modified packages. The `precommit` script in `packages/frontend/package.json` is configured to run [lint-staged](https://github.com/okonet/lint-staged). Lint-staged allows us run linters on files that have been staged through git. 

Within `package.json`, the block below defines what linters and formatters get applied to what filetype.

```
 "lint-staged": {
    "*.{js,ts,tsx, jsx}": [
      "eslint --quiet --fix",
      "prettier --write"
    ],
    "src/translations/*.json": "sort-json --ignore-case true"
  }
 ```
 
Two main things are ensured through this configuration:
- Staged translation files `src/translations/*.json"` get sorted in alphabetical order automatically using a package called [sort-json](https://github.com/kesla/sort-json)
- Staged `.js` and `.jsx` files get linted for any major linting errors and committing will fail until linting errors are resolved e.g unused vars. We can make the rules as tight or loose as we want through the configuration in `.eslintrc.js`.
- Staged `.js` and `.jsx` automatically get formatted using [prettier](https://prettier.io/). This too makes use of the configuration found in `.prettierrc`.

## Proposal: Commit messages
Within `.husky/commit-msg`, there's a script that ensures consistent formatting with commit messages using the `commit-msg` git hook. 

The proposed format is:
```
git commit -m "{commit type goes here}: {commit information}"
```

Example:
```
git commit -m "feat: linting support using eslint"
```

The image below provides more information on the commit types.
![image](https://user-images.githubusercontent.com/16845555/144693890-b0a4d6a9-9463-489e-8d8b-1a8cb4489d67.png)

Learn more [here](https://commitizen.github.io/cz-cli/). This is not a major thing, however. It just seemed like a somewhat beneficial low-hanging fruit.
