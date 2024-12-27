---
description: "Handling two Git accounts"
date: 2019-05-09
---

Hello,

Recently, I was faced with a problem.
How to manage two git accounts on the same computer?
I explain myself, a "`personal`" account and a "`work`" account, on the same computer.
Yes, I know that working on personal things with work materials is a bad habit ... but that's another question.

So, to get rid of just that (I did not invent anything, there are a lot of tutorials on the web), you will need to create a separate directory.
One for work, one for the person.

<!-- more -->

Regarding git, you will have to manage your \ $ HOME .gitconfig like this:

```bash
[includeIf "gitdir:~/perso/"]
    path = ~/perso/.gitconfig

[includeIf "gitdir:~/work/"]
    path = ~/work/.gitconfig

[user]
```

So as you see, **[user]** is not define. So you'll have to define it in **another** `.gitconfig`.
So in each directory, create a `.gitconfig`

in the `/perso` directory:

``` bash
[user]
   email = perso@perso.com
   name = name
```

in the `/work` directory:

``` bash
[user]
   email = work@work.com
   name = name
```

And that's it. Each time you'll go into the folder, your "`git user`" will change.

## Bonus

Here is my git alias for log:

yes there is 3, 3 differents view.

``` bash
[alias]
    lg1 = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate
    lg2 = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat
    l = log --graph --pretty=tformat:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%an %cr)%Creset' --abbrev-commit --date=relative
```

**See you !**
___
