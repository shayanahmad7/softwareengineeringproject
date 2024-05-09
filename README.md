# softwareengineeringproject
This is our super cool project for software engineering project for Spring 2024. 

# Abu Dhabi Eats

Abu Dhabi Eats is an innovative AI-driven nutrition and food ordering web application tailored for the diverse population of Abu Dhabi. This application helps users plan meals and manage their diet by integrating local restaurant data, offering personalized meal recommendations based on dietary preferences, and facilitating direct meal orders.

## Project Structure
```bash
softwareengineeringproject/
│
├── client/                    	# React frontend
│   ├── public/                	# Static files
│   │   └── index.html
│   ├── src/
│   │   ├── components/        	# Reusable UI components
│   │   ├── pages/             	# Page components
│   │   ├── App.mjs            	# ECMAScript Modules
│   │   ├── index.mjs          	# ECMAScript Modules
│   │   └── routes.mjs         	# ECMAScript Modules
│   └── package.json
│
├── server/                    	# Node/Express backend
│   ├── config/                	# Configuration files (e.g., DB connection)
│   │   └── database.mjs      	# ECMAScript Modules
│   ├── models/                	# Database models (Mongoose)
│   │   └── User.mjs          	# ECMAScript Modules
│   ├── routes/                	# API routes
│   │   └── api.mjs           	# ECMAScript Modules
│   ├── controllers/           	# Business logic
│   │   └── userController.mjs	# ECMAScript Modules
│   ├── middleware/            	# Custom middleware functions
│   │   └── authMiddleware.mjs	# ECMAScript Modules
│   ├── utils/                 	# Utility functions
│   │   └── logger.mjs        	# ECMAScript Modules
│   └── server.mjs             	# Server entry point (ECMAScript Modules)
│
├── .gitignore                 	# Specifies intentionally untracked files to ignore
├── README.md                  	# Project overview and setup instructions
└── package.json               	# Root package.json for managing scripts


## Technologies

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Other**: ECMAScript Modules (ESM)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourgithub/softwareengineeringproject.git

2. Install dependencies
   ```bash
      npm install
   
3. Navigate to abudhabieats folder:
  ```bash
      cd abudhabieats
   
4. Run using
  ```bash
      node app.js
## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Authors

    Shayan Ahmad
    Matija Susic
    Farzan Ali

## Acknowledgments

    Hat tip to anyone whose code was used
    Inspiration
    etc
