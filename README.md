# Pro-checked

Pro-checked is a single-user project management app that provides statistics and alerts you on deadlines. It is built using VueJS, FastAPI, and MySQL for the backend. Made with 💙 by [EyePan](https://github.com/Eyepan)

## Features

- User authentication and authorization
- Ability to create, update, and delete projects and tasks
- Statistics dashboard that shows project progress, task completion rate, and overall performance
- Notification alerts for approaching deadlines
- Intuitive user interface

## Tech Stack

- VueJS: a progressive JavaScript framework for building user interfaces
- FastAPI: a modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
- MySQL: a popular open-source relational database management system

## Usage

You can always use Pro-checked [here](https://eyepan.github.io/prochecked-vue/)

To run Pro-checked locally, follow these steps:

### Requirements: MySQL server, Python3, Node, NPM, VueJS

- Clone the backend repository:

```
git clone https://github.com/eyepan/prochecked-fastapi-backend.git
cd prochecked-fastapi-backend
```

- Create a virtual environment and download all packages

```
python3 -m venv venv
# enable your virtual environment
pip install -r requirements.txt
```

- Create a `.env` file with the variables

NOTE: You might need to change some of these, based on your MySQL preferences. Check them before changing here.

```
MYSQLDATABASE=prochecked
MYSQLHOST=localhost
MYSQLPASSWORD=
MYSQLPORT=3306
MYSQLUSER=root
```

- Clone the frontend repository:

```
git clone https://github.com/eyepan/prochecked-vue.git
cd prochecked-vue
```

Install the necessary dependencies:
`npm install`

Create a `.env` file with the variable

```
VITE_API_URL="localhost:8000/api/"
```

- And finally

```
npm run dev
```

to launch vite.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
