# Shdo: Execute shell commands in multiple directories grouped by tags

* https://gitlab.com/bimlas/node-shdo (official repository)
* https://github.com/bimlas/node-shdo (mirror, please give a star if you like it)

## Commands

### Add

Assign tags to directories.

The tags can be specified as command-line parameters, directories should
be listed in the prompt, or piped to stdin.

```
$ shdo add "pictures" "personal"
shdo: add > /home/myself/photos
shdo: add > /home/mom/my_little_family
```

Tagging Git repositories under the current directory with "git-repos" tag

```
# Linux / Windows Git Bash / ...
$ find "./" -name ".git" -printf "%h\n" | sort -u | shdo add "git-repos"
```

**NOTE**

Piping to stdin may not work on Windows Git Bash, the error message is:
          
```
stdin is not a tty
```
          
In this case try it again in cmd.exe or in PowerShell.


### Run

Running commands in multiple directories at once, arguments are tags or paths.

```
$ shdo run "git-repos" "../wip-project"
shdo: run > git status --short --branch

__ /home/me/src/awesome-project ______________________________________________
## master
AM README.md
 M package.json

__ /home/me/src/git-test _____________________________________________________
## master...origin/master
 M README.adoc
 M encoding/cp1250-encoding-dos-eol.txt
 M encoding/dos-eol.txt
 
__ /home/me/helping-tom/wip-project __________________________________________
## master...origin/master
 M example-code.js

==============================================================================
shdo: run > another command and so on ... 
```