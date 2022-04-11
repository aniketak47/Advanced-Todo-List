let addBtn = document.querySelector('.add-btn');

let removeBtn = document.querySelector('.remove-btn');
let removeBtnFlag = false;

let modalCont = document.querySelector('.modal-cont');

let mainCont = document.querySelector('.main-cont');

let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];

let modalPriorityColor = colors[colors.length-1]; // black

let allPriorityColors = document.querySelectorAll('.priority-color');

let addFlag = false;

let textAreaCont = document.querySelector('.textarea-cont');

let toolBoxColors = document.querySelectorAll('.color');

let lockClass = "fa-lock";
let unLockClass = "fa-lock-open";

let ticketsArr = []; // it will store all the tickets as objects

//get all tickets from local storage
if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function(ticket){
      createTicket(ticket.ticketColor , ticket.ticketTask , ticket.ticketId)
    })
  }

//Filter tickets with respect to colors

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener('click',function(e){
        let currentToolBoxColor = toolBoxColors[i].classList[1];
        // console.log(currentToolBoxColor);

        let filteredTickets = ticketsArr.filter(function(ticketObj){
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        
        // remove previous Tickets

        let allTickets = document.querySelectorAll('.ticket-cont');

        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        // filtered Tickets Display
        filteredTickets.forEach(function(filteredObj){
            createTicket(filteredObj.ticketColor, filteredObj.ticketTask, filteredObj.ticketId);
        });

    });

    toolBoxColors[i].addEventListener('dblclick', function(e){
        let allTickets = document.querySelectorAll('.ticket-cont');

        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })

}

addBtn.addEventListener('click', function(e){
    // Display a Modal

    // addFlag==true --> Modal Display
    // addFlag==false --> Modal Hide

    addFlag = !addFlag;   // here if addFlag was true the after clicking it becomes false

    if (addFlag==true) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }    
});

// Changing Priority Colors

allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click', function(e){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active');
        });
        colorElem.classList.add('active');

        modalPriorityColor = colorElem.classList[1];
    });
});


// Generation a Ticket

modalCont.addEventListener('keydown', function(e){
    let key = e.key;

    if(key=='Shift'){
        createTicket(modalPriorityColor, textAreaCont.value); // this function will generate the ticket
        modalCont.style.display = 'none';
        addFlag = false;
        textAreaCont.value = '';
    }
});

function createTicket(ticketColor, ticketTask, ticketId){
    let id = ticketId || shortid()
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class', 'ticket-cont');

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area" spellcheck="false">${ticketTask}</div><div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
  </div>`;

    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont, id);

    handleColor(ticketCont, id);

    handleLock(ticketCont, id);

    if(!ticketId){
        ticketsArr.push({ticketColor, ticketTask, ticketId:id})
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    }

}

removeBtn.addEventListener('click', function(){
    removeBtnFlag = !removeBtnFlag;
    if(removeBtnFlag==true){
        removeBtn.style.color = 'blue';
    }else{
        removeBtn.style.color = 'black'
    }
});


// Remove Tickets Function
function handleRemoval(ticket, id){
    ticket.addEventListener('click', function(){
        if(!removeBtnFlag) return

        let idx = getTicketIdx(id);

        // local storage removal of ticket

        ticketsArr.splice(idx,1);

        let strTicketArray = JSON.stringify(ticketsArr);

        localStorage.setItem('tickets', strTicketArray);

        ticket.remove();
    });
}


// Lock and unlock Tickets
function handleLock(ticket, id){
    let ticketLockElem = ticket.querySelector('.ticket-lock');
    let ticketLock = ticketLockElem.children[0];

    let ticketTaskArea = ticket.querySelector('.task-area');

    ticketLock.addEventListener('click', function(e){
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unLockClass);
            ticketTaskArea.setAttribute('contenteditable', 'true');
            
        }else{
            ticketLock.classList.remove(unLockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable', 'false');
        }

        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    });
}


function handleColor(ticket, id){
    let ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click', function(e){
        let currentTicketColor = ticketColorBand.classList[1];

        let ticketIdx = getTicketIdx(id);

        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor === color;
        });

        currentTicketColorIdx++;

        let newTicketColorIdx = currentTicketColorIdx%colors.length;
        let newTicketColor = colors[newTicketColorIdx];

        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(newTicketColor);

        // modify with new color

        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    })
}

function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketId === id;
    });

    return ticketIdx;
}