const chatForm = document.getElementById('chat-form')  ;
const  chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();


const{username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

socket.emit('joinRoom',{ username, room})

//get room and users list to display teehee
socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUser(users);
})


//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);


    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage',msg);

    //clear input post sending msg to the chat room :)
     e.target.elements.msg.value = '';
     e.target.elements.msg.focus();
});

// o/p msg to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name ot DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add user list ot dom
function outputUser(users){  
    userList.innerHTML = `${users.map(user => `<li>${user.username} </li>`).join('')}`;
}