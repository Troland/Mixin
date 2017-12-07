from fabric.api import local

def commit():
  local("git add . && git commit")

def push(repo='origin', branch='caidongliang'):
  local("git push %s %s" % (repo, branch))

def deploy(repo='origin', branch='caidongliang'):
  commit()
  push(repo, branch)
