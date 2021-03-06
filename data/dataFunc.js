/** @module Data functions module */

const fs           = require('fs');

var user = function(id,login,pass){
  this.userId       = id;
  this.userName     = login;
  this.userPass     = pass;
  this.userType     = 1;
  this.userSession  = null;
};

var task = function (id,taskText,taskFlags,taskDate,taskDeadline) {
    this.taskId = id;
    this.taskText = taskText;
    this.taskFlags = taskFlags;
    this.taskDate = taskDate;
    this.taskDeadline = taskDeadline;
};

var newFile = function(){
    this.idMax = 0;
    this.tasks = [new task(0, 'example', [0,0,0])];
};
/**
 * Find by name
 * @alias findByName
 * @param {string} usName Requesting user's name
 * @returns {null|{userPass: *, userSession: *, userType: *, userName: *, userId: *}} All of user's data
 * @memberof module:Data functions module
 */
var a = function(usName){
    let authData    = JSON.parse(fs.readFileSync('data/auth_data.json'));
    for(let i = 0; i <= authData.idMax; i++){
        if(usName == authData.data[i].userName){
            return {userName:authData.data[i].userName,userPass:authData.data[i].userPass,userId:authData.data[i].userId, userType:authData.data[i].userType,userSession: authData.data[i].userSession}
        }
    }
    return(null);
};
/**
 * Register new user
 * @alias addUser
 * @param {string} usName Requesting user's name
 * @param {string} usPass Requesting user's password
 * @memberof module:Data functions module
 */
var b    = function(usName,usPass){
    let authData    = JSON.parse(fs.readFileSync('data/auth_data.json'));
    let id          = 1 + authData.idMax;
    let newUser     = new user(id,usName,usPass);
    authData.data[id] = newUser;
    authData.idMax = id;
    fs.writeFileSync('data/auth_data.json', JSON.stringify(authData, null, ' '));
    fs.writeFileSync(`data/${id}.json`, JSON.stringify(new newFile(), null, ' '));
};
/**
 * Add login session
 * @alias sessionAdd
 * @param {string} usName Requesting user's name
 * @param {string} session New login session for user login
 * @memberof module:Data functions module
 */
var c = function(usName, session){
    let authData    = JSON.parse(fs.readFileSync('data/auth_data.json'));
    authData.data[a(usName).userId].userSession = session;
    fs.writeFileSync('data/auth_data.json', JSON.stringify(authData, null, ' '));
};
/**
 * Search for user by cookie
 * @alias searchForCookie
 * @param {string} pie Requested session
 * @returns {null|{userName: *, userId: *}} User's name and id
 * @memberof module:Data functions module
 */
var d = function(pie){
    let authData    = JSON.parse(fs.readFileSync('data/auth_data.json'));
    for(let i = 0; i <= authData.idMax; i++){
        if(pie === authData.data[i].userSession){
            return {userName:authData.data[i].userName,userId:authData.data[i].userId};
        }
    }
    return null;
};
/**
 * Get tasks for render
 * @alias getTasksData
 * @param {string} userId Requesting user's name
 * @returns {{tasksData: object}} All of user's tasks
 * @memberof module:Data functions module
 */
var e = function(userId){
    let tasksData = JSON.parse(fs.readFileSync(`data/${userId}.json`));
    return tasksData;
};
/**
 * Add new task
 * @alias addTask
 * @param {string} userId Requesting user's name
 * @param {string} taskText New task text
 * @param {string} taskFlags New task flags
 * @param {string} taskDate New task creation date
 * @param {string} taskDeadline New task deadline
 * @returns {number} New task's data max id
 * @memberof module:Data functions module
 */

var f = function(userId, taskText, taskFlags, taskDate, taskDeadline){
    let tasksData = JSON.parse(fs.readFileSync(`data/${userId}.json`));
    tasksData.idMax++;
    tasksData.tasks.push(new task(tasksData.idMax, taskText, taskFlags, taskDate, taskDeadline));
    fs.writeFileSync(`data/${userId}.json`, JSON.stringify(tasksData, null, ' '));
    return tasksData.tasks.length-1;
};
/**
 * Delete task by Id
 * @alias deleteTask
 * @param {number} taskId Deleted task id
 * @param {number} userId Requesting user's id
 * @returns {number} deleted task id
 * @memberof module:Data functions module
 */
var g = function(taskId, userId){
    let tasksData = JSON.parse(fs.readFileSync(`data/${userId}.json`));
    var taskDelId;
    for(i=0; i<tasksData.tasks.length; i++){
        if(tasksData.tasks[i].taskId==taskId){
           taskDelId = i;
        }
    }
    tasksData.tasks.splice(taskDelId, 1);
    fs.writeFileSync(`data/${userId}.json`, JSON.stringify(tasksData, null, ' '));
    return taskId
};
/**
 * Function for editting tasks
 * @alias editTask
 * @param {number} userId Requesting user's id
 * @param {number} taskId Editted task id
 * @param {string} taskText New text for task
 * @param {string} taskFlags New flags for task
 * @param {string} taskDeadline New deadline for task
 * @returns {{taskText:string ,taskId:number}} Editted task data
 * @memberof module:Data functions module
 */
var h = function(userId, taskId, taskText, taskFlags, taskDeadline){
    let tasksData = JSON.parse(fs.readFileSync(`data/${userId}.json`));
    tasksData.tasks[taskId].taskText = taskText;
    tasksData.tasks[taskId].taskFlags = taskFlags;
    tasksData.tasks[taskId].taskDeadline = taskDeadline;
    fs.writeFileSync(`data/${userId}.json`, JSON.stringify(tasksData, null, ' '));
    return {taskText:taskText, taskId:taskId};
};
/**
 * Deauth by deleting session from data
 * @alias sessionDelete
 * @param {string} usName Requesting user's name
 * @returns {number} Result of deauth
 * @memberof module:Data functions module
 */
var k = function(usName){
    let authData    = JSON.parse(fs.readFileSync('data/auth_data.json'));
    authData.data[a(usName).userId].userSession = null;
    fs.writeFileSync('data/auth_data.json', JSON.stringify(authData, null, ' '));
    return 1;
};
module.exports = {
    findByName: a,
    addUser: b,
    sessionAdd: c,
    searchForCookie: d,
    getTasksData: e,
    addTask: f,
    deleteTask: g,
    editTask: h,
    sessionDelete: k
};