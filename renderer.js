const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')

setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});
//two way 
const btn = document.getElementById('btn1')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
  })
// main to renderer
const counter = document.getElementById('counter');
window.electronAPI.onUpdateCounter((event, value) =>{
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue;
    event.sender.send('counter-value', newValue)
    
})


window.game.listen((msg) => {
    console.log(msg)
})

window.game.sendPing()




