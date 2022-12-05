const popup = document.querySelector('.chat-popup');
const chatBubble = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit');
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('input');
const askButton = document.querySelector('.askButton');
const closeHeader = document.querySelector('.header-exit');
var extrasLocal = "";

chatBubble.addEventListener('click', ()=>{
    popup.classList.toggle('show');
})

closeHeader.addEventListener('click', ()=>{
  popup.classList.toggle('show');
})

askButton.addEventListener('click', ()=>{
  popup.classList.toggle('show');
})

// Send message with click
submitBtn.addEventListener('click', getUserInput);
// Send message with enter ( html -> <input ... onkeyup="inputKeyUp(event)" )
function inputKeyUp(e) {
  e.which = e.which || e.keyCode;
  if(e.which == 13) {
      getUserInput();
  }
}

function getUserInput()
{

  let userInput = inputElm.value;
    if(userInput != "")
    {
      let temp = `<div class="out-msg">
      <span class="my-msg">${userInput}</span>
      <img src="./static/images/person.jpg" class="avatar">
      </div>`;
        
      chatArea.insertAdjacentHTML("beforeend", temp);
      inputElm.value = "";

      getEntities(userInput);
    }
}

function GiveAnswer(text) {
  let answer = `<div class="income-msg">
    <img src="/static/images/robot.png" class="avatar" alt="">
    <span class="msg">${text}</span>
    </div>`;
  chatArea.insertAdjacentHTML("beforeend", answer);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function replaceText(datas) {
    text = "";

    ents = datas[0];
    included = datas[1];
    extras = datas[2];

    for (var ent of ents) {
        key = Object.keys(ent)[0];

        if (key != "")
        {
          // text += (ent[key]).toFixed(2) + " ";
          text +=  key;
        }  
        else
        {
          // text += (ent[key]).toFixed(2) + " ";
          text +=  "Sajnálom, de erre nem tudok válaszolni";
        }  
    }

    if(included.length !== 0)
      text += included[0].replaceAll("ß", "<br />");


    if(extras.length !== 0)
    {
      text += `<br /><a onclick="showMore()">Bővebben</a>`;
      extrasLocal = extras[0].replaceAll("$", "<br />");
    }

    console.log(text);
    GiveAnswer(text);
}

function showMore() {
  if (extrasLocal !== "")
  {
    GiveAnswer(extrasLocal);
    extrasLocal = "";
  }
}

function getEntities(text) {
    const options = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text })
    };

    ents = fetch('http://' + window.location.hostname + ':80/pred', options)
        .then(res => res.json())
        .then(entities => {
          return replaceText(entities);
        });

    return ents;
}

