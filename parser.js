function weekStr2IntList(week) {
    /* 周数字符串转数组 */
    // 将全角逗号替换为半角逗号
    week.replace(/，/g, ',');
    let weeks = [];
  
    // 以逗号为界分割字符串，遍历分割的字符串
    week.split(",").forEach(w => {
        if (w.search('-') != -1) {
            let range = w.split("-");
            let start = parseInt(range[0]);
            let end = parseInt(range[1]);
            for (let i = start; i <= end; i++) {
                if (!weeks.includes(i)) {
                    weeks.push(i);
                }
            }
        } else if (w.length != 0) {
            let v = parseInt(w);
            if (!weeks.includes(v)) {
                weeks.push(v);
            }
        }
    });
    return weeks;
}
function optimizeText(text) {
    /* 优化文本 */
    let returnText = text.replace(/(^\s*)|(\s*$)/g, "");//去除两端空格
    returnText = returnText.replace(/&nbsp;/ig, " ");//&nbsp;替换为普通空格
    return returnText;
}
var courseDataTexts = [];//用于存放课程数据，以此跳过重复（跨大节）的课程
function haveCourseRepeat(courseDataText,day) {
    /* 判断课程是否重复出现 */
    let haveRepeat = false;
    for(let i = 0;i<courseDataTexts.length;i++){
        if(courseDataTexts[i][0] == courseDataText && courseDataTexts[i][1] == day){
            console.log("出现重复课程:",courseDataText,day);
            haveRepeat = true;
        }
    }
    courseDataTexts.push([courseDataText,day]);
    return haveRepeat;
}
function scheduleHtmlParser(html) {
    let result = [];
    $('#mytable tbody').find('tr').each(function() {
        /* 一整个行的数据 */
        $(this).find(".td").each(function(index){
        /* 只有课程数据的class是"td"，所以标题之类的会被略过 */
            let nowday = index + 1;//星期几
            $(this).find("div").each(function(){
                if(!$(this).hasClass("div_nokb")){
                /* 没有课的"大节"里面，有且只有一个class为"div_nokb"的div */
                    if(!haveCourseRepeat($(this).text(),nowday)){
                    /*重复课程不再解析*/
                        let courseDataTexts = $(this).text().split("◇");//div里面的内容，以<br>分割
                        let courseName = optimizeText($(courseDataHtmls[0]).text());//课程名称
                        let courseTeacher = optimizeText($("<span>"+courseDataHtmls[1]+"</span>").text().replace(/&nbsp;/ig, "、"));//授课教师
                        let courseTimesText = optimizeText($("<span>"+courseDataHtmls[2]+"</span>").text());//上课节数&周数文本，需要再次处理
                        /* 处理周数 */
                        let courseTimes = courseTimesText.split("[");
                        let weeksText = courseTimes[0];//方括号内的是节数，分割取左就是周数
                        let weeks = weekStr2IntList(weeksText);//周数数组
                        /* 处理节数 */
                        let sectionsText = courseTimes[1].replace(/]/g, "");
                        let sections = weekStr2IntList(sectionsText);//节数数组，可以直接套用处理周数的函数
                        let courseLoc = "";//上课地点，不一定有
                        if(courseDataHtmls.length>=4)
                        {
                            courseLoc = optimizeText($("<span>"+courseDataHtmls[3]+"</span>").text());
                        }
                        /* 
                          console.log("课程名称:",courseName);
                          console.log("授课教师:",courseTeacher);
                          console.log("上课地点:",courseLoc); 
                          console.log("周数:",weeks);
                          console.log("节数:",sections);
                          console.log("星期:",nowday);
                        */
                        /* sections封装成小爱课程表需要的 */
                        let courseSections = [];
                        for (let i = 0;i < sections.length;i++){
                            let courseSection = { "section":sections[i] };
                            courseSections.push(courseSection);
                        }
                        let courseInfo = {
                            "name":courseName,
                            "position":courseLoc,
                            "teacher":courseTeacher,
                            "weeks":weeks,
                            "day":nowday,
                            "sections":courseSections,
                        };
                        result.push(courseInfo);
                    }
                }else {
                    console.log("出现空课程，所在星期:",nowday);
                }
            });
        });
    });

    /*如果不需要时间表，可以把下方时间表的代码删除（不删也行），并把下一行的注释去掉*/
    //return { courseInfos: result }
    
    /*  时间表生成 开始  */
    let timetableInfo = {
        'summer':[
            ['07:50','08:30'],
            ['08:40','09:20'],
            ['09:30','10:10'],
            ['10:30','11:10'],
            ['11:20','12:00'],
            ['15:00','15:40'],
            ['15:50','16:30'],
            ['16:40','17:20'],
            ['17:30','18:10'],
            ['19:30','20:10'],
            ['20:20','21:00'],
            ['21:10','21:50']
        ],
        'winter':[
            ['07:50','08:30'],
            ['08:40','09:20'],
            ['09:30','10:10'],
            ['10:30','11:10'],
            ['11:20','12:00'],
            ['14:30','15:10'],
            ['15:20','16:00'],
            ['16:10','16:50'],
            ['17:00','17:40'],
            ['19:30','20:10'],
            ['20:20','21:00'],
            ['21:10','21:50']
        ]
    };
    let timetable = [];
    let nowMonth = new Date().getMonth()+1;
    /*每年4至10月执行夏季作息*/
    if(nowMonth>3 && nowMonth<11)
    {
        timetable = timetableInfo.summer;
    }
    else
    {
        timetable = timetableInfo.winter;
    }
    let resultTimetable = [];
    for(let i=0;i<timetable.length;i++)
    {
        let sectionTime = {
            "section": i+1,
            "startTime": timetable[i][0],
            "endTime": timetable[i][1]
        };
        resultTimetable.push(sectionTime);
    }
    console.log(result)
    return { courseInfos: result,sectionTimes: resultTimetable}
    /*  时间表生成 结束  */
}