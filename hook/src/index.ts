import { Dialute, SberRequest, SberResponse } from 'dialute';
const textToCommand = (texts: string[]) => {
    console.log('textToCommand in index.ts');
    let text = texts.join(' ');
    text = text.toLocaleLowerCase();

    let smartapp = ['запусти зарядку','запусти бодрое пробуждение'];
    let greet = ['привет','добрый','салют','доброе','здравствуй'];
    let help = ['помо','справка','правила','покажи что-нибудь'];
    let value = ['оценка','оценить'];
    let next = ['далее','дальше','след']
    let stop = ['закончить','стоп','конец','останови']
    let previous = ['наза','верни','верну','обратно']

    for (let dir of smartapp) {
        if (text.includes(dir)) return {type: 'smartapp'};
    }
    for (let dir of greet) {
        if (text.includes(dir)) return {type: 'greet'};
    }
    for (let dir of value) {
        if (text.includes(dir)) return {type: 'value'};
    }
    for (let dir of next) {
        if (text.includes(dir)) return {type: 'next'};
    }
    for (let dir of stop) {
        if (text.includes(dir)) return {type: 'stop'};
    }
    for (let dir of previous) {
        if (text.includes(dir))  return {type: 'previous'};
    }
    for (let dir of help) {
        if (text.includes(dir)) return {type: 'help'};
    }
    return {type: 'fail'};
}

function* script(r: SberRequest, rs: SberResponse) {
    let rsp = r.buildRsp();
    rsp.kbrd = ['Оценить','Помощь'];
    
    let phrase;
    let phraseIndex;
    let {gender, appeal} = r.body.payload.character;
    let maleofficialFailPhrases = ['Я пока не выучил эту команду. Лучше скажите «помощь», возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажите «помощь», возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажите «помощь», возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажите «помощь», возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажите «помощь», возможно, это чем-то поможет'];
    let maleno_officialFailPhrases = ['Я пока не выучил эту команду. Лучше скажи «помощь» возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажи «помощь», возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажи «помощь», возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажи «помощь», возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажи «помощь», возможно, это чем-то поможет'];
    let femaleofficialFailPhrases = ['Я пока не выучила эту команду. Лучше скажите «помощь», возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажите «помощь», возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажите «помощь», возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажите «помощь», возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажите «помощь», возможно, это чем-то поможет'];
    let femaleno_officialFailPhrases = ['Я пока не выучила эту команду. Лучше скажи «помощь» возможно, это чем-то поможет', 'Расшифровка этого займет несколько часов. Лучше скажи «помощь», возможно, это чем-то поможет',
        'Над этим мне нужно подумать. Лучше скажи «помощь», возможно, это чем-то поможет', 'Разработчики работают над добавлением этой команды. Лучше скажи «помощь», возможно, это чем-то поможет',
        'Скоро я пойму, что это значит. Лучше скажи «помощь», возможно, это чем-то поможет'];

    phrase = ` Добро пожаловать в приложение «Бодрое пробуждение»! Здесь ${(appeal === 'official' ? 'вы можете' : 'ты можешь')} провести личную зарядку. Для этого сначала нужно выбрать её длительность, а затем повторять за упражнениями на экране. Удачи!`;
    rsp.msg = phrase;
    rsp.data = {type: 'init'};
    const Exercise_Name = () => {
        rsp.msg = 'Я Дима'
    }
    yield rsp;

    while (true) {
        rsp = r.buildRsp();
        gender = r.body.payload.character.gender;
        appeal = r.body.payload.character.appeal;
        if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'help') {
            rsp.data = {type: 'helpme'}
            rsp.msg = `Суть приложения - выбрать длительность зарядки и выполнять упражнения на экране. `;  
        } else if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'fivemin') {
            rsp.data = {type: 'fivemin'}
            rsp.msg = `Легкая разминка для быстрого пробуждения`;
        } else if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'sevenmin') {
            rsp.data = {type: 'sevenmin'}
            rsp.msg = `Идеальная гимнастика для большинства людей`;
        } else if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'tenmin') {
            rsp.data = {type: 'tenmin'}
            rsp.msg = `Полноценная тренировка для всего тела`;
        } else if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'start') {
            rsp.data = {type: 'start'}
            rsp.msg = `${(appeal === 'official' ? 'Повторяйте' : 'Повторяй')} за упражнениями на экране`;
            console.log(r.act?.type);
            console.log(r.act?.type == 'hands1');
            setTimeout(Exercise_Name, 1000);
        } else if (r.type === 'SERVER_ACTION' && r.act?.action_id === 'completed') {
            rsp.data = {type: 'completed'};
            rsp.kbrd = ['Оценить','Помощь'];
            rsp.msg = 'Поздравляю! Зарядка окончена';
        } else if (r.type ==='SERVER_ACTION' && r.act.action_id === 'next') {
            rsp.data = {type: 'next'};
            // rsp.kbrd = ['Закончить','Вернуться','Далее'];
        } else if (r.type ==='SERVER_ACTION' && r.act.action_id === 'exercise') {
            rsp.data = {type: 'exercise'};
            rsp.kbrd = ['Закончить','Вернуться','Далее'];
            let exer = String(r.act?.type);
            console.log(exer)
            if (exer.includes('hands1')) 
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} вращения плечами. Для этого ${(appeal === 'official' ? 'положите' : 'положи')} свои ру́ки на плечи и ${(appeal === 'official' ? 'вращайте' : 'вращай')} их в одну сторону. Затем ${(appeal === 'official' ? 'повторяйте' : 'повторяй')} то же самое, только в другую сторону`
            else if (exer.includes('hands2'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} рывки руками в сторону. Для этого ${(appeal === 'official' ? 'согните' : 'согни')} ру́ки в локтях, ${(appeal === 'official' ? 'сделайте' : 'сделай')} пару рывков. Затем ${(appeal === 'official' ? 'разомкните' : 'разомкни')} ру́ки и ${(appeal === 'official' ? 'сделайте' : 'сделай')} так же пару рывков. При этом во время широких рывков можно поворачиваться корпусом вправо или влево`
            else if (exer.includes('hands3'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} рывки руками вверх и вниз. Для этого одну руку ${(appeal === 'official' ? 'опустите' : 'опусти')} вниз, а другую ${(appeal === 'official' ? 'поднимите' : 'подними')} вверх. После сделанных рывков ${(appeal === 'official' ? 'поменяйте' : 'поменяй')} ру́ки местами`
            else if (exer.includes('head1'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} вращения головой. Для этого ру́ки ${(appeal === 'official' ? 'положите' : 'положи')} на талию и ${(appeal === 'official' ? 'вращайте' : 'вращай')} головой по часовой стрелке. Затем ${(appeal === 'official' ? 'повторите' : 'повтори')} это уже против часовой стрелки`
            else if (exer.includes('circling1'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} вращения тазом. Для этого ру́ки ${(appeal === 'official' ? 'положите' : 'положи')} на талию и ${(appeal === 'official' ? 'вращайте' : 'вращай')} тазом по часовой стрелке. Затем ${(appeal === 'official' ? 'повторите' : 'повтори')} это уже против часовой стрелки`
            else if (exer.includes('circling2'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} вращения корпусом. Для этого ру́ки ${(appeal === 'official' ? 'сомкните' : 'сомкни')} в кулак перед собой и ${(appeal === 'official' ? 'сделайте' : 'сделай')} повороты корпуса сначало влево, а затем вправо`
            else if (exer.includes('hands4'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} вращения кистей. Для этого ру́ки ${(appeal === 'official' ? 'сомкните' : 'сомкни')} в кулак перед собой и ${(appeal === 'official' ? 'вращайте' : 'вращай')} кистями по часовой стрелке. Затем ${(appeal === 'official' ? 'повторите' : 'повтори')} это уже против часовой стрелки`
            else if (exer.includes('legs1'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} махи ногами. Для этого ру́ки ${(appeal === 'official' ? 'положите' : 'положи')} на талию и ${(appeal === 'official' ? 'поднимите' : 'подними')} сначала одну ногу, а затем другую`
            else if (exer.includes('legs2'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} выпады. Для этого ру́ки ${(appeal === 'official' ? 'положите' : 'положи')} на талию и ${(appeal === 'official' ? 'сделайте' : 'сделай')} шаг вперёд. Затем одну ногу ${(appeal === 'official' ? 'согните' : 'согни')} в колене под девяносто граудосв. Затем ${(appeal === 'official' ? 'поменяйте' : 'поменяй')} ногу`
            else if (exer.includes('legs3'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} приседания. Для этого ${(appeal === 'official' ? 'опускайтесь' : 'опускайся')} вниз с прямой спиной, пока бедро не станет параллельно полу. Затем ${(appeal === 'official' ? 'поднимитесь' : 'поднмись')} вверх `
            else if (exer.includes('legs4'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} прыжки. Для этого ру́ки ${(appeal === 'official' ? 'положите' : 'положи')} на талию и ${(appeal === 'official' ? 'сделайте' : 'сделай')} несколько прыжков. Можно прыгать как на двух ногах, так и на одной`
            else if (exer.includes('slopes1'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} наклоны вбок. Для этого одну руку ${(appeal === 'official' ? 'положите' : 'положи')} на талию, а вторую ${(appeal === 'official' ? 'тяните' : 'тяни')} в сторону головы. Затем ${(appeal === 'official' ? 'сделайте' : 'сделай')} несколько наклонов вбок. Затем ${(appeal === 'official' ? 'поменяйте' : 'поменяй')} руку`
            else if (exer.includes('slopes2'))
                rsp.msg = `${(appeal === 'official' ? 'Делайте' : 'Делай')} наклоны вниз. Для этого ${(appeal === 'official' ? 'поставьте' : 'поставь')} ноги на ширине плеч, а затем, не сгиная ног в коленях, ${(appeal === 'official' ? 'постарайтесь' : 'постарайся')} дотянуться руками до пола`
            }else if (r.type ==='SERVER_ACTION' && r.act.action_id === 'previous') {
            rsp.kbrd = ['Закончить','Вернуться','Далее'];
            rsp.data = {type: 'previous'};
        } else if (r.type == "RATING_RESULT") {
            //Пользовательская оценка. От 1 до 5
            rsp.data = {type: 'mark'};
            rsp.msg = `Спасибо за оценку!`;            
        } else if (r.type === 'MESSAGE_TO_SKILL') {
            let texts = r.nlu.texts;
            let command = textToCommand(texts);   
            if (command.type === 'greet') {
                rsp.msg =  ` Добро пожаловать в приложение «Бодрое пробуждение»! Здесь ${(appeal === 'official' ? 'вы можете' : 'ты можешь')} провести личную зарядку. Для этого сначала нужно выбрать её длительность, а затем повторять за упражнениями на экране. Удачи!`;
                rsp.data = command;
            } else if (command.type === 'smartapp') {
                rsp.msg = ` Добро пожаловать в приложение «Бодрое пробуждение»! Здесь ${(appeal === 'official' ? 'вы можете' : 'ты можешь')} провести личную зарядку. Для этого сначала нужно выбрать её длительность, а затем повторять за упражнениями на экране. Удачи!`;
                rsp.data = command;
            } else if (command.type === 'start') {
                rsp.data = command
                rsp.msg = `${(appeal === 'official' ? 'Повторяйте' : 'Повторяй')} за упражнениями на экране`;
            } else if (command.type === 'next') {
                rsp.kbrd = ['Закончить','Вернуться','Далее'];
                rsp.data = command;
            } else if (command.type === 'previous') {
                rsp.kbrd = ['Закончить','Вернуться','Далее'];
                rsp.data = command;
            } else if (command.type === 'stop') {
                rsp.msg = 'Завершаю';
                rsp.kbrd = ['Оценить','Помощь'];
                rsp.data = command;
            } else if (command.type === 'completed') {
                rsp.data = {type: 'completed'};
                rsp.kbrd = ['Оценить','Помощь'];
                rsp.msg = 'Поздравляю! Зарядка окончена';
            } else if (command.type === 'value') {
                rsp.msg = 'Оценивание';
                rsp.data = command;
                rsp.body.messageName = 'CALL_RATING';
            } else if (command.type === 'help') {
                rsp.msg = `Суть приложения - выбрать длительность зарядки и выполнять упражнения на экране. Во время зарядки можно перейти к следующему упражнению, сказав «Далее», или закончить её выполнение, сказав «Закончить». Количество повторений определяется ${(appeal === 'official' ? 'вами' : 'тобой')} самостоятельно`;  
                rsp.data = command;
            } else if (command.type === 'exercise') {  
                rsp.data = command;
            } else if (command.type === 'fail') {
                let {gender, appeal} = r.body.payload.character;
                console.log(gender, appeal);
                if (gender === 'male') {
                    if (appeal === 'official') {
                        let phraseIndex = Math.floor(Math.random() * maleofficialFailPhrases.length);
                        phrase = maleofficialFailPhrases[phraseIndex];
                    } else {
                        let phraseIndex = Math.floor(Math.random() * maleno_officialFailPhrases.length);
                        phrase = maleno_officialFailPhrases[phraseIndex];
                    }
                } else {
                    if (appeal === 'official') {
                        let phraseIndex = Math.floor(Math.random() * femaleofficialFailPhrases.length);
                        phrase = femaleofficialFailPhrases[phraseIndex];
                    } else {
                        let phraseIndex = Math.floor(Math.random() * femaleno_officialFailPhrases.length);
                        phrase = femaleno_officialFailPhrases[phraseIndex];
                    }
                }
                rsp.msg = phrase;
                rsp.data = command;
            }
            console.log(command);
        }
        else{
            rsp.msg = '';
            rsp.data = {};
        }
        yield rsp;
    }
}

Dialute
    .fromEntrypoint(script as GeneratorFunction)
    .start();
