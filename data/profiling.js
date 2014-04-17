/*
 * Clear profiling
 * */
db.setProfilingLevel(0);
db.system.profile.drop();

//Enable profiling
db.setProfilingLevel(1, 100);

//самые медленные запросы
db.system.profile.find({}).sort({
    millis: 1
}).pretty();

//самые медленные запросы по определенной таблице
db.system.profile.find({
    ns : 'batros_birthday.rss_posts'
}).sort({
        millis: 1
    }).pretty();