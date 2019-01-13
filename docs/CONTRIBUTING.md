Code style
----------

For project formatting style we are following EditorConfig. Make sure to install EditorConfig plugin in your editor.

For TypeScript code style we are using TSLint with default config config. Make sure to install TSLint plugin in your editor or use CLI command `npm run lint` to verify that your code conforms the style guide. TSLint checks are also integrated with Travis CI which are run for every pull request.

Commit message guidelines
-------------------------

Borrowed from [AngularJS Git Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on github as well as in various git tools.

#### Subject line
Subject line contains succinct description of the change.

##### Allowed `<type>`
* feat (feature)
* fix (bug fix)
* docs (documentation)
* style (formatting, missing semi colons, …)
* refactor
* test (when adding missing tests)
* chore (maintain)

##### Allowed `<scope>`
Scope could be anything specifying place of the commit change. For example api, server, messages, bundles, router, etc...

##### `<subject>` text
* use imperative, present tense: “change” not “changed” nor “changes”
* don't capitalize first letter
* no dot (.) at the end

#### Message footer

##### Referencing issues

Closed bugs should be listed on a separate line in the footer prefixed with "Closes" keyword like this:
```
Closes #234
```

or in case of multiple issues:
```
Closes #123, #245, #992
```

#### Examples

```
test(html): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```
