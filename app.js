const inquirer = require('inquirer');
const axios = require('axios');
const path = require('path');
const qs = require('qs');
const puppeteer = require('puppeteer');
const fs = require('fs');



let browserInstance = {};

const problemsDirectory = './problems';

const templateURL = 'http://codeforces.com/api/problemset.problems?tags=';

async function getProblemTypes(){
    try{
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'tags',
                message: 'Enter the tag for which you want problems'
            },
            {
                type: 'input',
                name: 'index',
                message: 'Choose from the level of questions: A,B.. or Z? '
            },
            {
                type: 'input',
                name: 'limit',
                message: 'Enter the number of problems you want (0 for all): '
            }
        ]);
        return await answers;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

function getFilteredProblems(problems, index){
    let tempArray = [];
    for(const problem of problems){
        if(problem.index.toLowerCase() === index.toLowerCase()){
            tempArray.push(problem);
        }
    }
    return tempArray;
}


async function _getBrowserReady(){
    const browser = await puppeteer.launch();
    browserInstance.browser = browser;
    return await browserInstance;
}

async function saveProblemScreenshot(problem){
    const contestPageURL = 'http://codeforces.com/problemset/problem/'+problem.contestId+'/'+problem.index;
    const browser = browserInstance.browser;
    const page = await browserInstance.browser.newPage();
    await page.goto(contestPageURL);
    console.log(`Saving the problem ${problem.contestId}${problem.index} ....`);
    return await page.pdf({path: `./${problemsDirectory}/${problem.contestId}${problem.index}.pdf`, format: 'A4'});
}


async function _main(){
    try{
        if (!fs.existsSync(problemsDirectory)){
            fs.mkdirSync(problemsDirectory);
        }
        await _getBrowserReady();
        const answers = await getProblemTypes();
        const requestUrl = `${templateURL}${answers.tags}`;
        const problemsRequest = await axios.get(requestUrl);
        const problems = (await problemsRequest).data;
        const filteredProblems = getFilteredProblems(problems.result.problems, answers.index);
        
        let screenShotPromises = [];
        if(Number(answers.limit) === 0){
            answers.limit = filteredProblems.length + 10;
        }
        let problemCount = 0;
        for(const problem of filteredProblems){
            if(problemCount >= answers.limit){
                break;
            }
            problemCount++;
            screenShotPromises.push(saveProblemScreenshot(problem));
        }
        await Promise.all(screenShotPromises);
        await browserInstance.browser.close();
        console.log('All the problems are saved in the problems folder...');
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

_main();