<script lang="ts">
    import { onMount } from 'svelte';
    import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client';
    import { setTheme } from './themes';
    import { logger } from "./utils";

    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjAwMWJlYjc4NjkyOThkZGRiY2FkOTQ5M2M2YzlkODAyN2E3ZGYzOGZlNWMxM2JkODYyNzFhZTZlZjA0YjVlODVkOGYiLCJhdWQiOiJWUFMiLCJleHAiOjE2Njc3MjY0ODgsImlhdCI6MTY2NzY0MDA3OCwiaXNzIjoiS0VZTUFTVEVSIiwidHlwZSI6IkJlYXJlciIsImp0aSI6IjQxZmQ2YmM0LWNkOGQtNDhmYS05NTU3LTA1MGI2YTcxZGMyOCIsInNpZCI6ImU5ZTdhMmY3LWY2MTEtNDNlNi04YTUwLTIzODcyMDgyNzA1NyJ9.Cnc3xqnypWBz9GVZ4qUt6NZpNTdd9B52alcqbNztqgG8XxoDLGUfeuUNz_C0r0CNsmDfAeMMMo9fmQ_Fe9EAFCVjH_s7eGmykiRCOvStkTDwUaNueiDVhSGDmS7Sv5G6oFKFkqmhc_bpgzE_9xJGKmOk5ArJ9qPBlpQ0jI611gSa6xgrYu1uagpikDlJdHGguDy3dDRLQLQrW224SXjXgvL_rPs7EpRm2UArZeALfw6T5WO2y2q3-5ESfkv5-nkpxRAfwfAYyMsj8_ChbKD1utlXlPXuOhVrWRqVeHcvFEudHBOwjgNGVFA4QjnBjLE_WDzxBmfX6esDULOK3pEdlhcwLV5WGKqlp0KyNdreic6JUgMvkUlhPXDUqIk9_zMEwaGveVZxPr5v8CY9yL9aBhO77bE8SnIVpi5ZPuFetg8D0ribc2jhx6hgktQgjOyHC_1SGnXta351zL5k18rPwfCLy6oVj9hIx3Fc05o6K81oOLi0MlGyCkUUpTlFVML8nncBCA9G5UsPF4329UsipJEYDoPYX2ijIW6y1e_T35yOTN3l6uOPNQn4xXNMaLQc1WLI3Jerqg4t6Gt-C1dbSpVEbi2bcGt3SXDLHUDh5-xksuAdwOK81gB4U-54N3QoZBSJhvUb-FVthdz8P78kwKalOYMTw84KjS6HklZHERo";
// Set the name of your SmartApp for activation
    let initPhrase = 'запусти тест';
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
                        assistant.sendData({
                                action: {
                                    action_id: 'exercise',
                                    type: exercise[number_of_exercise]
                                }
                            });
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

    function digitalClock() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        //    //* добавление ведущих нулей */
        //   if (hours < 10) hours = "0" + hours;
        //   if (minutes < 10) minutes = "0" + minutes;
        //   if (seconds < 10) seconds = "0" + seconds;
            document.getElementById("id_clock").innerHTML = hours + ":" + minutes + ":" + seconds;
            setTimeout("digitalClock()", 1000);
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
    var images = ['1.gif','2.gif','3.gif','4.gif','5.gif','6.gif'];
    var exercises_easy = ['hands1','hands2','hands3','circling2','circling1','slopes1','slopes2','legs1']
    var exercises_middle = ['head1','hands1','hands2','hands3','circling2','circling1','slopes1','legs1','legs4']
    var exercises_hard = ['head1','hands1','hands2','hands3','circling2','slopes1','legs1','legs2','legs3','legs4']
    var exercise = ['head1']
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
<head>
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

</head>
<div id = "bodymirror">
    <div class="game">
        <div class = "heading"> 
            <div class = "title">Зарядка</div>
            <div class = "emodji">💪</div>
            <div id="clock" class = "clock"></div>
            <script>digitalClock();</script>
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
        <img id = "exercise" src = {'./images/' + exercise[number_of_exercise] + '.png'} class = "exercise" alt="Hello"/> 
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
        <img class = "img" src = {'./emotions/' + images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription"> Легкая разминка для быстрого пробуждения! <br/><br/>
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
        <img class = "img" src = {'./emotions/' + images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription"> Идеальная гимнастика для большинства людей! <br/><br/>
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
        <img class = "img" src = {'./emotions/' + images[Math.floor(Math.random() * images.length)]} alt="this slowpoke moves"  width="250"/>
        <h0 class = "discrription"> Полноценная тренировка для всего тела! <br/><br/>
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
        font-size: 20px;
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
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .hr0 {
        background-color: rgb(255,255,255,0.8);
        height: 10px;
        margin-left: 10px;
        margin-right: 10px;
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
        width: 180px;
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

    button::before {
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
    button:focus {
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
        margin-left: 30px;
        margin-right: 30px;
        border-radius: 10% / 30%;
        font-weight: 100;
    }
    .heading {
        color: white;
        font-size: 150px;
        font-family: fantasy;
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
        width: 350px;
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
        margin-left: 1%;
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
        font-size: 70px;
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
        font-size: 40px;
    }
    .close {
        float: right;
        margin-left: 100px;   
        border-radius: 100px;
        margin-right: 10px;
        width: 80px;
        height: 125px;
        font-size: 40px;
        margin-top: 10px;
    }
    .description{
        font-size: 50px;
        margin-top: 40px;
        margin-left: 20px;
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
        margin-left: 1%;
        margin-top: 400px;
        margin-bottom: 100px;
    }
    }

    @media screen and (max-width: 2100px) and (min-width: 1950px) {
    .exercise{
        width: 1280px;
        height: 720px;
        margin-left: 320px;
        margin-right: 320px;
    }
    .description{
        font-size: 24px;
        margin-top: 20px;
        margin-left: 10px;
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
        margin-left: 1%;
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
        height: 550px;
        font-size: 24px;
    }
    .discription-title{
        margin-top: 10px;
        font-size: 38px;
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
        font-size: 16px;
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
}
</style>