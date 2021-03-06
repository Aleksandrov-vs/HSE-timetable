const puppeteer = require('puppeteer');



module.exports = async (page, group_name)=> {

    return  await page.evaluate((group_name)=>{
        let timetable = []

        if (document.querySelector('.mb-3.ng-star-inserted') != null){
            return timetable
        }

        let elements = document.querySelectorAll('.media-body.day-items')


        for (const element of elements) {


            const today = new Date()
            const dd = String(today.getDate()).padStart(2, '0')
            const mm = String(today.getMonth() + 1).padStart(2, '0')
            const yyyy = today.getFullYear()
            const create_date = `${dd}.${mm}.${yyyy}`
            const date = element.querySelector('.d-lg-none.date.clearfix').innerText


            if ( (date.match(/[^\s]*/)[0]) != create_date){
                continue
            }

            const auditorium = element.querySelector('.info .auditorium').innerText
            const number_lesson = element.querySelector('small').innerText
            const lecture = element.querySelector('.info .lecturer').innerText
            const title =  element.querySelector('.title').innerText
            const information = element.querySelector('.info').innerText
            let  href = element.querySelector('.info :nth-child(4)')
            if (href != null){
                href = href.innerText
            }else {
                href =' '
            }

            const cell_data = {
                create_date: create_date,
                href: href,
                group: group_name,
                number_lesson: number_lesson,
                lecture: lecture,
                auditorium: auditorium,
                date: date,
                name: title,
                information: information,
            }

            timetable.push(cell_data)
        }
        return timetable
    },group_name);
}