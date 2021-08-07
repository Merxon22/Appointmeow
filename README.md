# Appointmeow
 Make appointments easier~

# How to setup Appoiontmeow:
Appointmeow is a webapp based on python Flask and Javascript React

## Basic requirement:
Python == 3.9.5

## Step 1:
1. Install [Node JS](https://nodejs.org)
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)

## Step 2:
1. Clone the github repository to **./Appointmeow** directory

   `git clone https://github.com/Merxon22/Appointmeow.git ./Appointmeow`

2. Enter the following command to first create a React app. This process usually takes a few minutes.

`npx create-react-app appointmeow`

***Note that the git repository is cloned to "./Appointmeow" and the React app is created in "./appointmeow". This is because both git clone and create-react-app requires an empty directory. Therefore, we have to create them in two different directories and combine them manually later.***

3. Copy everything from **./Appointmeow** directory into **./appoiontmeow** directory. Overwrite every file in the **./appointmeow** directory.

After copying the files, you can remove the **./Appointmeow** directory.

4. Then, enter the **appointmeow** directory, install node modules:

`npm install antd`
`npm install react-router-dom`

## Step 3:
1. Make sure you are in the **appointmeow** directory.
2. To start the **React App**, enter `yarn start` in terminal.
3. To start the **Flask-API**, enter `yarn start-api` in terminal.

***Both "React App" and "Flask-API" should be running at the same time to ensure Appointmeow works properly***
