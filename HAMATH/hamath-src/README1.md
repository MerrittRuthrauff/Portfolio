# Hamath Learning Software

**Authors:**

**H**enrique Oliveira

**A**idan Melen

**M**errit Ruthrauff

**A**rmora Rama

**Decription:** Hamath is a math based game aimed to augment the in-class learning in a fun and interactive way.

***

# Prerequisites For Setup and Installations

**First things first, make sure you have [pip](https://github.com/TheBigTeam/hamath-workspace/wiki/pip-installation), [python](https://github.com/TheBigTeam/hamath-workspace/wiki/python-installation), and [github](https://github.com/TheBigTeam/hamath-workspace/wiki/github-setup) installed and working properly. If not, don't sweat it, check out the [**wiki's**](https://github.com/TheBigTeam/hamath-workspace/wiki) for installation instructions**


***

## Virtual Environment Setup

Make a new virtualenv in desired location: `virtualenv yourprojectname`

The `projectname-workspace` directory isolates our libraries and contains the local github repository.

**How To Use:**

Activate the virtualenv: `source /bin/activate`
Windows: `Script/activate`

The virtualenv can be deactivated: `deactivate`

## Setup Local Repository

Now, from inside our activated virtual enviroment (*projectname-workspace*), pull down code from github with the following command-line commands:

```
git init
git remote add origin https://github.com/TheBigTeam/hamath-workspace
git pull origin master

git update-index --assume-unchanged path/to/hamath_db
git push --set-upstream origin milestone_name
```

You will get two projects: 
* **hamath**: is the class project
* **mysite-example**: is a django sample website described [**here**](https://docs.djangoproject.com/en/1.9/intro/tutorial01/)

* or create your own django project with `django-admin startproject mysite`

**important note:**

The hidden file titled `.gitignore` will hide you virtualenv folders when you run `git status`. Without it, you would have to ignore these directories manually during every commit.

## Project Setup

Install Requirements: `pip install -r requirements.txt`

1. Navigate to the project root: `/projectname-workspace/projectname-src`

2. Setup Database with the makemigration and migrate commands:

  `python manage.py makemigrations`

  `python manage.py migrate`

3. Create new Admin: `python manage.py createsuperuser`

  username = `yourname`
  
  email = `yourname@westminstercollege.edu`

  password = `password`

4. Run the server: `python manage.py runserver`

  Open website in browser at http://localhost:8000 or admin at http://localhost:8000/admin (admin:admin)



