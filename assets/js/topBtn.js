const returnBtn = document.querySelector('.btnTop')

returnBtn.addEventListener('click', () => {
  window.scrollTo(0,0)
})

document.addEventListener('scroll', () => {
  if(window.scrollY > 200){
    return returnBtn.style.display = 'flex'
  }  
  return returnBtn.style.display = 'none'
})
