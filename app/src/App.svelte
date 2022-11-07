<script lang="ts">
    import { onMount } from 'svelte';
    import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client';
    import { setTheme } from './themes';
    import { logger } from "./utils";

    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjAwMWJlYjc4NjkyOThkZGRiY2FkOTQ5M2M2YzlkODAyN2E3ZGYzOGZlNWMxM2JkODYyNzFhZTZlZjA0YjVlODVkOGYiLCJhdWQiOiJWUFMiLCJleHAiOjE2Njc4MzI5MDYsImlhdCI6MTY2Nzc0NjQ5NiwiaXNzIjoiS0VZTUFTVEVSIiwidHlwZSI6IkJlYXJlciIsImp0aSI6IjE3MDYzMjJhLTA0ZjEtNGQ5Yy05NWI1LTMzYTM0YTMzZTMwOSIsInNpZCI6IjI4N2U1MzMxLTY5NDItNGRhNi1iMGVkLTFjNzJiMzlkYjIwYyJ9.chtA8xf4u8HjfwnoNhjj9Y2P-4Np-xXMpVDeOg_YpHgjZBzRJ4ldeKuDQN2B2ikPp_qCjpvg1m-eOujgj-W641xcF_jXbUB0KIfo6UpP75lHWAql6d3Mpo65ei9MPPd7K7ITmsIIgN1dieXSCtJdodt2Ga4Iq_ZhBftG1VwLhiW3r8l-Y4nnLblGyfNYWevDWUi2sciOoSwplMz6umGebKIvPloOI5Wt5GyCA7ZKIywF7MX6kBomc2VXvv4umSHC5mehu5CMxeQcjAYQpsM8_-pyPr7Qlwr3qCwK32ZEcCMXfPjdaJ8qKueI3v-5hPSJEFCuWt8jr-awRnQ3w7NaSjluBvUDjOckJDpBJaiADUxD-Z0f50a434I_0FEUpnNchyhPNBWfOhYuhCQGUwMQeroJPozIbg037iIQ5ldvWmT-40M6Wt0PxFrtbsctikI6P4dALL0fMqnJAM3OSbR4Ikn_JuPmktiDHdzakC_6BuKl6wnsT2fCsvdqWwOyHpk3dbxV2SvObK9rkQWtmMhgBtVsfgEBNju0gymPUZaAwl1DohteAeCGQd04suQZphKK0dyD-diW9fN14OVhMK50vWc9_yCa-btdzmztUGV1mL1mfUbRynPZaMb_WCfn70p5Q3h8NHjlJ4KzOvODKkDfJo56_foVZkWrzRm-2q9eFsM";
// Set the name of your SmartApp for activation
    let initPhrase = 'запусти Утренняя Зарядка';
    let character = 'eva'; // default, before sber client gets state
    let assistant;
    var stoptime = false;
    var stopex = false;
    //$: setTheme(character);
    onMount(() =>
    {
        function getState() {return {}}

        const init = () =>
        {
            if (process.env.NODE_ENV === 'production') {return createAssistant({getState});}
            return createSmartappDebugger({token, initPhrase, getState });
        };
        assistant = init();
        assistant.on('start', () => { logger.log('SmartApp started'); });
        digital();
        assistant.on('data', event =>
        {
            // Set your action or data hooks
            if (!event.type) {
                // Use invariants to prevent errors on Sber Portal
                return;
            }
            // FIXME Add event handler for closing the app and use "assistant.close()" inside it;

            if (event.type === 'character') {
                character = event.character.id;
                if (character === 'joy' || character === 'eva') {
                    setTheme('sber');
                }
            }

            if (event.type === 'smart_app_data') {
                logger.log(event.smart_app_data.type);
                if (event.smart_app_data.type === 'close_app'){
                    assistant.close();
                }
                else if (event.smart_app_data.type === 'smartapp') {
                    console.log('here');
                }
                else if (event.smart_app_data.type === 'next') {
                    if (window.document.body.className == 'start') {
                        if (number_of_exercise + 1 < exercise.length) {
                            assistant.sendData({
                                action: {
                                    action_id: 'exercise',
                                    type: exercise[number_of_exercise]
                                }
                            });
                            number_of_exercise++;
                        }
                        else {
                            assistant.sendData({
                                action: {
                                    action_id: 'completed'
                                }
                            });
                            number_of_exercise = 0; 
                            document.getElementById('wrap').style.display="flex";
                            document.getElementById("base-timer").style.display="none";
                            document.getElementById('exercise').style.display="none";
                            window.document.body.className = '';
                            timePassed = 0;
                        }
                }
                    else {}
                }
                else if (event.smart_app_data.type === 'previous') {
                    if (number_of_exercise != 0) {
                        number_of_exercise--;
                        assistant.sendData({
                                action: {
                                    action_id: 'exercise',
                                    type: exercise[number_of_exercise]
                                }
                            })
                    }
                }
                else if (event.smart_app_data.type === 'stop') {
                    if (document.getElementById("base-timer").style.display==="flex") 
                        stoptime = true;
                    else {}
                    number_of_exercise = 0;
                    document.getElementById('wrap').style.display="flex";
                    document.getElementById("base-timer").style.display="none";
                    document.getElementById('exercise').style.display="none";
                    window.document.body.className = '';
                    timePassed = 0;
                }
            }
        })
    })
    const body = document.getElementById("body")
    document.addEventListener('keydown', (event) => {    
        logger.log(event.key);
        switch(event.key) {
    case '26':
      // Включить/Выключить
      break;
     case '164':
      // Отключить звук
      break;
     case '19':
      // Вверх
      break;
     case '22':
      // Вправо
      break;
     case '20':
      // Вниз
      case '21':
      // Влево
     break;
     case '23':
      // ок   
      start()
     break;
     case '4':
      // Назад
        close()
     break;
     case '84':
      // AC Search
     break;
     case '3':
      // Домой
     break;
     case '24':
      // Увеличение громкости
     break;
     case '25':
      // Уменьшение громкости
     break;
  }
});

    function digital() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var hours_str = hours.toString();
        var minutes_str = minutes.toString();
        var seconds_str = seconds.toString();
           //* добавление ведущих нулей */
        if (hours < 10) hours_str = "0" + hours_str;
        if (minutes < 10) minutes_str = "0" + minutes_str;
        if (seconds < 10) seconds_str = "0" + seconds_str;
        document.getElementById("clock").innerHTML = hours_str + ":" + minutes_str + ":" + seconds_str;
        setTimeout(digital, 1000);
   }

   let visible,fivebool,sevenbool,tenbool = false;
   function startTimer(time) {
    if (stoptime) {
        timePassed = 0;
        timeLeft = TIME_LIMIT;
        document.getElementById("base-timer").style.display="none";
        stoptime = false;
        return;
    }
    if (stopex) {
        stopex = false;
        return;
    }
    if (time == 0) 
    {
        timePassed = 0;
        document.getElementById("base-timer").style.display="none";
        document.getElementById('exercise').style.display="flex";
        assistant.sendData({
                                action: {
                                    action_id: 'exercise',
                                    type: exercise[number_of_exercise]
                                }
                            })
        return
    }
    // The amount of time passed increments by one
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    // The time left label is updated
    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);
    setTimeout(()=>startTimer(timeLeft),1000);
}
   const start = () =>
   {
        if (window.document.body.className == 'fivemin') {
            exercise = exercises_easy;
        } else if (window.document.body.className == 'sevenmin') {
            exercise = exercises_middle;
        } else if (window.document.body.className == 'tenmin') {
            exercise = exercises_hard;
        }
        var word = exercise[0]
        close();
        document.getElementById('wrap').style.display="none";
        document.getElementById('description').innerHTML = "Повторяйте за упражнениями на экране!";
        document.getElementById('base-timer').style.display="flex";
        startTimer(TIME_LIMIT);
        logger.log(word);    
        window.document.body.classList.toggle('start');
        assistant.sendData({
                action: {
                    action_id: 'start',
                    type: word
                }
            });
   }
   const close = () =>
   {
        visible = fivebool = sevenbool = tenbool = false;
        window.document.body.className = '';
        document.getElementById('body').style.boxShadow = '0 0 100px rgba(0,0,0,0.9) inset';
        document.getElementById('bodymirror').style.filter = 'blur(0px)';
        document.getElementById('body').style.background = 'linear-gradient(135deg, rgba(93,199,169,1) 0%, rgba(140,236,207,1) 50%, rgba(179,255,229,1) 100%)';
        document.getElementById('hidden_panel').style.right = '-1520px';
        document.getElementById('hidden_panel2').style.right = '-1600px';
        document.getElementById('fivemin').tabIndex = 1;
        document.getElementById('sevenmin').tabIndex = 2;
        document.getElementById('tenmin').tabIndex = 3;
        assistant.sendData({
            action: {
                action_id: 'close'
            }
        });
    }
   const fivemin = () =>
    {
        sevenbool = tenbool = false;
        visible = fivebool = true;
        document.getElementById('body').style.boxShadow = '0 0 500px rgba(0,0,0,0.9) inset';
        document.getElementById('fivemin').tabIndex = -1;
        document.getElementById('sevenmin').tabIndex = -1;
        document.getElementById('tenmin').tabIndex = -1;
        window.document.body.classList.toggle('fivemin');
        document.getElementById('hidden_panel').style.right = '0px';
        document.getElementById('hidden_panel2').style.right = '0px';
        document.getElementById('bodymirror').style.filter = 'blur(2px)';
        document.getElementById('body').style.background = 'linear-gradient(135deg, rgba(67,143,121,1) 0%, rgba(105,176,155,1) 50%, rgba(142,200,180,1) 100%)';
        assistant.sendData({
            action: {
                action_id: 'fivemin'
            }
        });
    };
    const sevenmin = () =>
    {
        fivebool = tenbool = false;
        visible = sevenbool = true;
        document.getElementById('body').style.boxShadow = '0 0 500px rgba(0,0,0,0.9) inset';
        document.getElementById('fivemin').tabIndex = -1;
        document.getElementById('sevenmin').tabIndex = -1;
        document.getElementById('tenmin').tabIndex = -1;
        window.document.body.classList.toggle('sevenmin');
        document.getElementById('hidden_panel').style.right = '0px';
        document.getElementById('hidden_panel2').style.right = '0px';
        document.getElementById('bodymirror').style.filter = 'blur(2px)';
        document.getElementById('body').style.background = 'linear-gradient(135deg, rgba(67,143,121,1) 0%, rgba(105,176,155,1) 50%, rgba(142,200,180,1) 100%)';
        assistant.sendData({
            action: {
                action_id: 'sevenmin'
            }
        });
    };
    const tenmin = () =>
    {
        fivebool = sevenbool = false;
        visible = tenbool = true;
        document.getElementById('body').style.boxShadow = '0 0 500px rgba(0,0,0,0.9) inset';
        document.getElementById('fivemin').tabIndex = -1;
        document.getElementById('sevenmin').tabIndex = -1;
        document.getElementById('tenmin').tabIndex = -1;
        window.document.body.classList.toggle('tenmin');
        document.getElementById('hidden_panel').style.right = '0px';
        document.getElementById('hidden_panel2').style.right = '0px';
        document.getElementById('bodymirror').style.filter = 'blur(2px)';
        document.getElementById('body').style.background = 'linear-gradient(135deg, rgba(67,143,121,1) 0%, rgba(105,176,155,1) 50%, rgba(142,200,180,1) 100%)';
        assistant.sendData({
            action: {
                action_id: 'tenmin'
            }
        });
    };        
    // var images = ['1.gif','2.gif','3.gif','4.gif','5.gif','6.gif'];
    // var exercises_easy = ['hands1','hands2','hands3','circling2','circling1','slopes1','slopes2','legs1']
    // var exercises_middle = ['head1','hands1','hands2','hands3','circling2','circling1','slopes1','legs1','legs4']
    // var exercises_hard = ['head1','hands1','hands2','hands3','circling2','slopes1','legs1','legs2','legs3','legs4']
    var images = ['https://i.ibb.co/GMtN3Hx/2.gif',
                'https://i.ibb.co/GMtN3Hx/2.gif',
                'https://i.ibb.co/0CPR20G/3.gif',
                'https://i.ibb.co/mtygXmN/4.gif',
                'https://i.ibb.co/f2DCS88/5.gif',
                'https://i.ibb.co/K2pJDhx/6.gif'];
    var exercises_easy = ['https://i.ibb.co/QpmrKTq/hands1.png','https://i.ibb.co/KDGfvfs/hands2.png','https://i.ibb.co/Tt54cQk/hands3.png','https://i.ibb.co/gSpfmVZ/circling2.png','https://i.ibb.co/2jZYmQf/circling1.png','https://i.ibb.co/H7KqQBp/slopes1.png','https://i.ibb.co/56BB4x6/slopes2.png','https://i.ibb.co/XD3HN57/legs1.png']
    var exercises_middle = ['https://i.ibb.co/QFR8MnR/head1.png','https://i.ibb.co/QpmrKTq/hands1.png','https://i.ibb.co/KDGfvfs/hands2.png','https://i.ibb.co/Tt54cQk/hands3.png','https://i.ibb.co/gSpfmVZ/circling2.png','https://i.ibb.co/2jZYmQf/circling1.png','https://i.ibb.co/H7KqQBp/slopes1.png','https://i.ibb.co/XD3HN57/legs1.png','https://i.ibb.co/dkW56bB/legs4.png']
    var exercises_hard = ['https://i.ibb.co/QFR8MnR/head1.png','https://i.ibb.co/QpmrKTq/hands1.png','https://i.ibb.co/KDGfvfs/hands2.png','https://i.ibb.co/Tt54cQk/hands3.png','https://i.ibb.co/gSpfmVZ/circling2.png','https://i.ibb.co/H7KqQBp/slopes1.png','https://i.ibb.co/XD3HN57/legs1.png','https://i.ibb.co/FbzCw0q/legs2.png','https://i.ibb.co/GR9QNCF/legs3.png','https://i.ibb.co/dkW56bB/legs4.png']
    var exercise = ['https://i.ibb.co/QFR8MnR/head1.png']
    var number_of_exercise = 0
    // Start with an initial value of 20 seconds
    const TIME_LIMIT = 10;

    // Initially, no time has passed, but this will count up
    // and subtract from the TIME_LIMIT
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    function formatTimeLeft(time) {
    
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;

    // The output in SS format
    return `${seconds}`;
}
</script>
<body id="body">
<!-- <head>
    <script>
    function digitalClock() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        //* добавление ведущих нулей */
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
            document.getElementById("clock").innerHTML = hours + ":" + minutes + ":" + seconds;
            setTimeout("digitalClock()", 1000);
        }
  </script>  

</head> -->
<div id = "bodymirror">
    <div class="game">
        <div class = "heading"> 
            <div class = "title">Зарядка</div>
            <div class = "emodji">💪</div>
            <div id="clock" class = "clock"></div>
            <!-- <script>digitalClock();</script> -->
        </div>
    </div>
    <hr class = "hr0">
    <div class = "description" id = "description"> 
        Выберите оптимальную длительность упражнений
    </div>
    <div class = "app" id = "app">
        <div class="base-timer" id = "base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
                <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining green"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
              </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">
                {formatTimeLeft(timeLeft)}
            </span>
          </div>
        <img id = "exercise" src = {exercise[number_of_exercise] + '.png'} class = "exercise" alt="Hello"/> 
    </div>
    <div class="wrap" id = "wrap">
        <button class = "fivemin" id = "fivemin" tabindex="1" on:click = {() => fivemin()}>
            <div class = "time5" id ="time5">5 мин</div>
            <br/>
            <hr class = "hr1">
            <div class="container">
                <h4><b>Легкая разминка для быстрого пробуждения</b></h4>
            </div>
        </button>
        <button class = "sevenmin" id = "sevenmin" tabindex="2" on:click = {() => sevenmin()}>
            <div class = "time7">7 мин</div>
            <br/>
            <hr class="hr1">
            <div class="container">
                <h4><b>Идеальная гимнастика для большинства людей</b></h4>
            </div>
        </button>
        <button class = "tenmin" id = "tenmin" tabindex="3" on:click = {() => tenmin()}>
            <div class = "time10">10 мин</div>
            <br/>
            <hr class = "hr1">
            <div class="container">
                <h4><b>Полноценная тренировка для всего тела</b></h4>
            </div>
        </button>
    </div>
</div>
<div class = "hidden_panel2" id = "hidden_panel2"></div>
<div class = "hidden_panel" id = "hidden_panel">
    <button class="close" tabindex="4" on:click = {() => close()} >x</button>
    {#if fivebool}
        <h1 class = "discription-title">5 мин</h1>
        <hr class = "hr2">
        <img class = "img" src = {images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription">
            Зарядка включает следующие упражнения: <br/><br/>
            - Вращения руками<br/>
            - Рывки руками<br/>
            - Вращение кистей<br/>
            - Вращение корпусом<br/>
            - Вращение тазом<br/>
            - Наклоны вбок<br/>
            - Наклоны вниз<br/>
            - Махи ногами</h0>
    {/if}
    {#if sevenbool}
        <h1 class = "discription-title">7 мин</h1>
        <hr class = "hr2">
        <img class = "img" src = {images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription">
            Зарядка включает следующие упражнения:  <br/><br/>
            - Вращения головой<br/>
            - Вращения руками<br/>
            - Рывки руками<br/>
            - Вращение кистей<br/>
            - Вращение корпусом<br/>
            - Вращение тазом<br/>
            - Наклоны<br/>
            - Махи ногами<br/>
            - Прыжки</h0>
    {/if}
    {#if tenbool}
        <h1 class = "discription-title">10 мин</h1>
        <hr class = "hr2">
        <img class = "img" src = {images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription">
            Зарядка включает следующие упражнения:  <br/><br/>
            - Вращения головой<br/>
            - Вращения руками<br/>
            - Рывки руками<br/>
            - Вращение кистей<br/>
            - Вращение корпусом<br/>
            - Наклоны<br/>
            - Выпады<br/>
            - Приседания<br/>
            - Прыжки</h0>
    {/if}
    <button class="start" tabindex="5" on:click = {() => start()}> Начать </button>
</div>

</body>




<style>
    .close:focus, .start:focus {
        background: rgb(87,144,137);
        background: linear-gradient(135deg, rgba(87,144,137,1) 0%, rgba(46,116,110,1) 100%);
        box-shadow: inset 0 0 0 5px white;
    }
    .title, .emodji, .clock, .hr0 {
        font-family: fantasy;
        margin-top: 10px;
    }
    .description {
        font-family: cursive;
    }
    .exercise{
        width: 1280px;
        height: 720px;
        margin-left: 320px;
        margin-right: 320px;
        display: none
    }
    .hr2 {
        margin-top: 60px
    }
    .close {
        float: right;
        margin-left: 50px;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);    
        border-radius: 100px;
        box-shadow: 5px 5px 5px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
        color: white;
    }
    .discrription {
        font-family: cursive;
        height: 425px;
        float:left;
        margin-top: 0px;
        font-size: 22px;
        margin-left: 20px;
    }
    .img {
        --heightA: var(--height);
        --widthA: var(--width);
        margin-right: 25%;
        margin-left: 25%;
    }
    .start {
        float: left;
        margin-bottom: 0;
        font-size: 30px;
        font-weight: bold;
        width: 50%;
        margin-right: 25%;
        margin-left: 25%;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);    
        border-radius: 1000px;
        box-shadow: 7px 7px 7px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
        color: white;
    }
    .discription-title {
        float: left;
        margin-left: 1%;
        margin-top: 0;
        margin-bottom: 5px;
        color:white;
    }
    .bodymirror {
        width: 1920px;
    }
    .time5, .time7, .time10 {
        float: right;
        font-size: 30px;
        color:white;
        margin-right: 7%;
    }
    .description {
        color: white;
        font-size: 30px;
        font-weight: bold;
        margin-left: 35px;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .hr0 {
        background-color: rgb(255,255,255,0.8);
        height: 10px;
        margin-left: 35px;
        margin-right: 35px;
        border-radius: 10% / 30%;
        font-weight: 100;
    }
    :global(body) {
        margin-top: 0;
        margin-left: 0;
        /* width: 1920px;
        height: 1000px; */
        background: rgb(93,199,169);
        background: linear-gradient(135deg, rgba(93,199,169,1) 0%, rgba(140,236,207,1) 50%, rgba(179,255,229,1) 100%);
        box-shadow: 0 0 100px rgba(0,0,0,0.9) inset;
    }
    .heading {
        color: white;
        font-size: 100px;
        font-family: fantasy;
        text-align: center;
    }
    .title {
        text-align: center;
        float: left;
        margin-left: 10%;
        width: 500px;
        text-decoration:underline;
        /* text-shadow: 1px 1px 1px #000; */
    }
    .emodji {
        float: left;
        margin-right: 50px;
        width: 100px;
        text-align: left;
    }
    .clock {
        text-align: center;
        font-family: fantasy;
        width: 190px;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);    
        float: right;
        margin-top: 30px;
        margin-right: 50px;
        font-size: 50px;
        border: none;
        border-radius: 1000px;
        box-shadow: 12px 12px 24px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
    }
    .game
    {
        height: 150px;
    }
    .container {
        float: left;
        display: block;
    }
    .wrap {
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;    
        float: left;
        margin-left: 1%;
        margin-top: 100px;
        margin-bottom: 100px;
    }

    .fivemin, .sevenmin, .tenmin {
        width: 400px;
        height: 200px;
        font-family: 'Nunito', sans-serif;
        font-size: 22px;
        text-transform: uppercase;
        letter-spacing: 1.3px;
        font-weight: 700;
        color: white;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
        border: none;
        border-radius: 100px;
        box-shadow: 12px 12px 24px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
        margin-right: 10px;
    }

    .fivemin::before, .sevenmin::before, .tenmin::before {
        content: '';
        border-radius: 1000px;
        min-width: calc(300px + 12px);
        min-height: calc(60px + 12px);
        border: 6px solid #00FFCB;
        box-shadow: 0 0 60px rgba(0,255,203,.64);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: all 500ms ease;
    }
    .fivemin:focus, .sevenmin:focus, .tenmin:focus {
        background: rgb(114,201,190);
        background: linear-gradient(135deg, rgba(114,201,190,1) 0%, rgba(72,187,177,1) 100%);
        box-shadow: inset 0 0 0 1px #3a7999;
    }
    /* СКРЫТЫЙ БЛОК */
    #hidden_panel {
        text-align: center;
        position: fixed; /* положение */
        top: 120px; /* отступ сверху */
        right: -520px; /* отступ слева */
        background: black; /* цвет фона */
        color: white; /* цвет текста */
        width: 500px; /* ширина блока */
        --widthpanel: var(--width);
        --heightpanel: var(--height);
        height: 900px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;

        box-shadow: 0 0 100px 100px black inset;
        }
    button:focus #hidden_panel {
        right: 0; /* отступ слева */
    }
    #hidden_panel2 {
        position: fixed; /* положение */
        top: 120px; /* отступ сверху */
        right: -600px; /* отступ слева */
        background: black; /* цвет фона */
        color: #000; /* цвет текста */
        width: 540px; /* ширина блока */
        height: 900px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;
        
        filter: blur(50px);
    }
    .base-timer {
        display: none;
        position: relative;
        height: 300px;
        width: 300px;
        margin-left: 40%;
        margin-top: 10%;
    }

    /* Removes SVG styling that would hide the time label */
    .base-timer__circle {
    fill: none;
    stroke: none;
    }

    /* The SVG path that displays the timer's progress */
    .base-timer__path-elapsed {
    stroke-width: 7px;
    stroke: green;
    }
    .base-timer__label {
    position: absolute;
    color:white;
    font-family: cursive;
    /* Size should match the parent container */
    width: 300px;
    height: 300px;
    
    /* Keep the label aligned to the top */
    top: 0;
    
    /* Create a flexible box that centers content vertically and horizontally */
    display: flex;
    align-items: center;
    justify-content: center;

    /* Sort of an arbitrary number; adjust to your liking */
    font-size: 60px;
    }

    @media screen and (min-width: 2101px) {
    .exercise{
        width: 2560px;
        height: 1440px;
        margin-left: 640px;
        margin-right: 640px;
        margin-bottom: 100px;
    }

    .time5, .time7, .time10 {
        float: right;
        font-size: 50px;
        color:white;
        margin-right: 7%;
    }
    .hr0 {
        background-color: rgb(255,255,255,0.8);
        margin-top: 100px;
        height: 20px;
        margin-left: 35px;
        margin-right: 35px;
        border-radius: 10% / 30%;
        font-weight: 100;
    }
    .heading {
        color: white;
        font-size: 150px;
        text-align: center;
    }
    .title {
        text-align: center;
        float: left;
        margin-left: 10%;
        margin-top: 20px;
        width: 700px;
        text-decoration:underline;
        /* text-shadow: 1px 1px 1px #000; */
    }
    .emodji {
        float: left;
        margin-right: 50px;
        margin-top: 10px;
        width: 200px;
        text-align: left;
    }
    .clock {
        text-align: center;
        width: 360px;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);    
        float: right;
        margin-top: 50px;
        margin-right: 100px;
        font-size: 100px;
        border: none;
        border-radius: 1000px;
        box-shadow: 12px 12px 24px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
    }
    .game
    {
        height: 150px;
    }
    .container {
        float: left;
        display: block;
    }
    .wrap {
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;    
        float: left;
        margin-left: 35px;
        margin-top: 100px;
        margin-bottom: 100px;
    }
        #hidden_panel {
        text-align: center;
        position: fixed; /* положение */
        top: 320px; /* отступ сверху */
        right: -1520px; /* отступ слева */
        background: black; /* цвет фона */
        color: white; /* цвет текста */
        width: 1200px; /* ширина блока */
        --widthpanel: var(--width);
        --heightpanel: var(--height);
        height: 1900px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;

        box-shadow: 0 0 100px 100px black inset;
        }
    button:focus #hidden_panel {
        right: 0; /* отступ слева */
    }
    #hidden_panel2 {
        position: fixed; /* положение */
        top: 320px; /* отступ сверху */
        right: -1600px; /* отступ слева */
        background: black; /* цвет фона */
        color: #000; /* цвет текста */
        width: 1240px; /* ширина блока */
        height: 1900px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;
        
        filter: blur(50px);
    }
    .base-timer {
        display: none;
        position: relative;
        height: 600px;
        width: 600px;
        margin-left: 40%;
        margin-top: 12%;
    }

    /* The SVG path that displays the timer's progress */
    .base-timer__path-elapsed {
    stroke-width: 8px;
    stroke: green;
    }
    .base-timer__label {
    position: absolute;
    color:white;
    font-family: cursive;
    /* Size should match the parent container */
    width: 600px;
    height: 600px;
    
    /* Keep the label aligned to the top */
    top: 0;
    
    /* Create a flexible box that centers content vertically and horizontally */
    display: flex;
    align-items: center;
    justify-content: center;

    /* Sort of an arbitrary number; adjust to your liking */
    font-size: 120px;
    }
    .img {
        width: 400px;
        height: 400px;
        margin-left: 400px;
        margin-right: 400px;
    }
    .discrription{
        height: 950px;
        font-size: 50px;
    }
    .discription-title{
        margin-top: 35px;
        font-size: 80px;
    }
    .hr2 {
        background-color: rgb(255,255,255,0.8);
        height: 10px;
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 10% / 24%;
        font-weight: 100;
        margin-top: 165px;
    }
    .start {
        width: 50%;
        margin-right: 25%;
        margin-left: 25%;
        height: 100px;
        font-size: 60px;
        font-weight: bold;
    }
    .close {
        float: right;
        font-weight: bold;
        margin-left: 100px;   
        border-radius: 100px;
        margin-right: 10px;
        width: 80px;
        height: 125px;
        font-size: 40px;
        margin-top: 10px;
    }
    .description{
        font-size: 60px;
        margin-top: 40px;
        margin-left: 35px;
    }
    .fivemin, .sevenmin, .tenmin {
        width: 850px;
        height: 425px;
        font-family: 'Nunito', sans-serif;
        font-size: 50px;
        text-transform: uppercase;
        letter-spacing: 1.3px;
        font-weight: 700;
        color: white;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
        border: none;
        border-radius: 150px;
        box-shadow: 15px 15px 28px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
        margin-right: 24px;
    }
    .wrap {
        height: 30%;
        display: flex;
        align-items: center;
        justify-content: center;    
        float: left;
        margin-left: 35px;
        margin-top: 400px;
        margin-bottom: 100px;
    }
    }

    @media screen and (max-width: 2100px) and (min-width: 1950px) {
    .clock {
        text-align: center;
        width: 210px;
    }
    .exercise{
        width: 1280px;
        height: 720px;
        margin-left: 320px;
        margin-right: 320px;
    }
    .description{
        font-size: 34px;
        margin-top: 20px;
        margin-left: 35px;
    }
    .fivemin, .sevenmin, .tenmin {
        width: 420px;
        height: 225px;
        font-family: 'Nunito', sans-serif;
        font-size: 24px;
        text-transform: uppercase;
        letter-spacing: 1.3px;
        font-weight: 700;
        color: white;
        background: #4FD1C5;
        background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
        border: none;
        border-radius: 100px;
        box-shadow: 12px 12px 24px rgba(79,209,197,.64);
        transition: all 0.3s ease-in-out 0s;
        cursor: pointer;
        outline: none;
        position: relative;
        padding: 10px;
        margin-right: 14px;
    }
    .wrap {
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;    
        float: left;
        margin-left: 25px;;
        margin-top: 200px;
        margin-bottom: 100px;
    }
    #hidden_panel {
        text-align: center;
        position: fixed; /* положение */
        top: 125px; /* отступ сверху */
        right: -850px; /* отступ слева */
        background: black; /* цвет фона */
        color: white; /* цвет текста */
        width: 700px; /* ширина блока */
        --widthpanel: var(--width);
        --heightpanel: var(--height);
        height: 1200px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;

        box-shadow: 0 0 100px 100px black inset;
        }
    button:focus #hidden_panel {
        right: 0; /* отступ слева */
    }
    #hidden_panel2 {
        position: fixed; /* положение */
        top: 125px; /* отступ сверху */
        right: -850px; /* отступ слева */
        background: black; /* цвет фона */
        color: #000; /* цвет текста */
        width: 700px; /* ширина блока */
        height: 1200px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;
        
        filter: blur(50px);
    }
    .img {
        width: 300px;
        height: 300px;
        margin-left: 200px;
        margin-right: 200px;
    }
    .discrription{
        height: 500px;
        font-size: 30px;
    }
    .discription-title{
        margin-top: 10px;
        font-size: 48px;
    }
    .hr2 {
        margin-top: 85px;
    }
    .start {
        width: 50%;
        margin-right: 25%;
        margin-left: 25%;
        height: 75px;
    }
    .close {
        font-weight: bold;
        float: right;
        margin-left: 50px;   
        border-radius: 100px;
        width: 50px;
        height: 65px;
        font-size: 24px;
        margin-top: 5px;
    }
    .base-timer{
        width: 250px;
        height: 250px;
        margin-top: 10%;
    }
    .base-timer__label {
        width: 250px;
        height: 250px;
    }
}
@media screen and (max-width: 1300px) {
    .exercise{
        width: 960px;
        margin-left: 160px;
        margin-right: 160px;
    }
    #hidden_panel {
        text-align: center;
        position: fixed; /* положение */
        top: 30px; /* отступ сверху */
        right: -550px; /* отступ слева */
        background: black; /* цвет фона */
        color: white; /* цвет текста */
        width: 480px; /* ширина блока */
        --widthpanel: var(--width);
        --heightpanel: var(--height);
        height: 900px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;

        box-shadow: 0 0 100px 100px black inset;
        }
    button:focus #hidden_panel {
        right: 0; /* отступ слева */
    }
    #hidden_panel2 {
        position: fixed; /* положение */
        top: 30px; /* отступ сверху */
        right: -550px; /* отступ слева */
        background: black; /* цвет фона */
        color: #000; /* цвет текста */
        width: 500px; /* ширина блока */
        height: 600px; /* высота блока */
        padding: 10px; /* отступы от границ внутри блока */
        text-align: left; /* выравнивание текста */

        -webkit-transition-duration: 0.3s; /* анимационное выдвижение для всех браузеров*/
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;

        -webkit-border-radius: 50px 5px 5px 50px; /* закругление границ для всех браузеров*/
        -moz-border-radius: 50px 5px 5px 50px;
        border-radius: 50px 5px 5px 50px;
        
        filter: blur(50px);
    }
    .img {
        width: 150px;
        height: 150px;
        margin-left: 35%;
        margin-right: 35%;
    }
    .discrription{
        height: 350px;
        font-size: 22px;
    }
    .start {
        margin-bottom: 100px;
    }
    .base-timer{
        width: 250px;
        height: 250px;
        margin-top: 7%;
    }
    .base-timer__label {
        width: 250px;
        height: 250px;
    }
    .close:focus, .start:focus {
        background: rgb(87,144,137);
        background: linear-gradient(135deg, rgba(87,144,137,1) 0%, rgba(46,116,110,1) 100%);
        box-shadow: inset 0 0 0 3px white;
    }
    .heading {
        font-size: 70px;
    }
    .game {
        height:100px;
    }
    .clock {
        font-size: 40px;
        margin-top: 20px;
        width: 160px;
    }
    .hr0 {
        height: 5px;
    }
    .description {
        font-size: 22px;
    }
    .discrription {
        font-size: 19px;
        height: 300px;
    }
    .exercise {
        width: 800px;
        height: 450px;
        margin-left: 240px;
        margin-right: 240px;
    }
    .title {
        width: 300px;
    }
}
</style>