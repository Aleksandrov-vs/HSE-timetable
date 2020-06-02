const launcher = require('./launcher.js')
const puppeteer = require('puppeteer')
const fs = require('fs')
const GetTimetablePage = require('./GetTimetablePage')
const GetTimetable = require('./GetTimetable')
const config = require('../../bot/config.json')
Database = require('../../bot/scr/Database')

const db = new Database(config.databaseURL);
const url = "https://ruz.hse.ru/ruz/main"

const ParseTimetable = async (GroupName) => {
    let timetable= []
    let test =0

    const browser = await launcher.StartBrowser()
    const page = await launcher.StartPage(browser)
    await page.on('console', msg => console.log('PAGE LOG:', msg.text()));


    await page.goto(url)
    const result = await GetTimetablePage(page, GroupName)
    console.log(result)
    if (result == 0){
        return {result : 0, timetable : timetable};
    }
    timetable = await GetTimetable(page)
    await browser.close()
    fs.writeFileSync('../out.json', JSON.stringify(timetable, null, 2))
    return {result : 1, timetable : timetable};



}



const UpdateDB = async ()=>{
    const Groups = await db.GetGroupsName()
    for(group of Groups) {
        const result = await ParseTimetable(group.name_group)
        if (result.result) {
            const data = result.timetable
            let json_st = JSON.stringify(data)
            console.log(typeof json_st, json_st)
            db.UpdateGroup(group.name_group, json_st)
        }
    }
}
//
// UpdateDB()
//     .then(()=>{
//     console.log('done')
//     })
//     .catch((e)=>{
//     console.log(e)
// })


module.exports.ParseTimetable = ParseTimetable;
module.exports.UpdateDB = UpdateDB;