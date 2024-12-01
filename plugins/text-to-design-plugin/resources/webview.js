// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
// document.getElementById('button').addEventListener('click', () => {
//   window.postMessage('nativeLog', 'Called from the webview')
// })

// // call the webview from the plugin
window.setVersion = (v) => {
  document.getElementById('version').innerHTML = 'v' + v
}

document.getElementById('submit-button').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  if (userInput) {
    // Send the input to Sketch plugin
    window.postMessage('submit', userInput);
  } else {
    alert('Please enter some text.');
  }
});
