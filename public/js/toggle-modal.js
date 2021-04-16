const addTopic = document.querySelector("#add-topic")
const addBtn = document.querySelector('#add-btn')
const cancelBtn = document.querySelector('#cancel-btn')

cancelBtn.addEventListener('click', e => {
  addTopic.style.display = 'none'
})

addBtn.addEventListener('click', e => {
  addTopic.style.display = 'flex'
})