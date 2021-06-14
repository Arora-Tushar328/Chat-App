//Fpr recieving in chat
const socket = io()
//Elements
const $messageForm= document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormbutton = $messageForm.querySelector('button')

const $sendlocation= document.querySelector('#send-location')
const $sendlocationbutton = $sendlocation.querySelector('button')
//rendering message
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#Message-template').innerHTML
const locationmessagetemplate = document.querySelector('#location-Message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//parsing the string of join page
 const {username,Room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

// socket.on('countUpdated',(count)=>{
//     console.log('Count has been updated',count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Starting')
//     socket.emit('increment')
// })
const autoscroll = () => {
  // New message 
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const contentHeight = $messages.scrollHeight

  // How much scrolling
  const scrollin = $messages.scrollTop + visibleHeight

  if (contentHeight - newMessageHeight <= scrollin) {
      $messages.scrollTop = $messages.scrollHeight
  }
}
socket.on('message',(message)=>{
    console.log(message)
    //for rendering of message
    //mustache provide the inner message 
    const html = Mustache.render(messageTemplate,{
      username:message.username,
      message: message.text,
     //h,mm,a we get from the momentjs documentation
     createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage', (message)=>{
  console.log(message)
  const html = Mustache.render(locationmessagetemplate,{
   username: message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})
socket.on('RoomData',({Room,users})=>{
  const html = Mustache.render(sidebarTemplate,{
    Room,
    users
    
  })
  document.querySelector('#sidebar').innerHTML=html

})
//message sent to server
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormbutton.setAttribute('disabled','disabled')
    //Disable
  const message = e.target.elements.message.value
  //for delievering message
  socket.emit('sendMessage',message,(error)=>{
    $messageFormbutton.removeAttribute('disabled')
    //For disappear the written message
    $messageFormInput.value = ''
    $messageFormInput.focus()
    //Enable
    
 if(error){
  return console.log(error)
 }
 console.log('Message Delievered!!')
  })
})
//For location sharing at client side
$sendlocation.addEventListener('click',()=>{
  if(!navigator.geolocation){
   return alert('Geolocation is not supported in your browser')
  }
  $sendlocation.setAttribute('disabled','disabled')
navigator.geolocation.getCurrentPosition((position)=>{
console.log(position)
socket.emit('sendLocation',{
  latitude: position.coords.latitude,
  longitude: position.coords.longitude
},()=>{
  //used for acknowledge from client to server
  $sendlocation.removeAttribute('disabled')
  console.log('Location Shared')
})

})

})
socket.emit('join',{username,Room},(error)=>{
  if(error){
    alert(error)
    // location.href is used to send back the date to the root of the join page
    location.href ="/"
  }

})