const popup = document.querySelector('.chat-popup');
const chatBubble = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit');
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('input');
const askButton = document.querySelector('.askButton');
const closeHeader = document.querySelector('.header-exit');


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
      <img src="./static/images/Woman_Icon2X.png" class="avatar">
      </div>`;
        
      chatArea.insertAdjacentHTML("beforeend", temp);
      inputElm.value = "";

      getEntities(userInput);
    }
}

function GiveAnswer(text) {
  let answer = `<div class="income-msg">
    <img src="/static/images/robotChatface2X.png" class="avatar" alt="">
    <span class="msg">${text}</span>
    </div>`;
  chatArea.insertAdjacentHTML("beforeend", answer);

}

function replaceText(ents) {
    text = "";
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
    GiveAnswer(text);
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

