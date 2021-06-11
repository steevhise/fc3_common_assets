/** Note: this file is provided by the fc3_common_assets package */

export default (() => {
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById('mobile-search-button')
    const searchForm = document.getElementById('mobile-search')
    const headerLinks = document.querySelector('.header-links')
    if (button === null || searchForm === null) return
    button.addEventListener('click', e => {
      e.preventDefault()
      searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none'
    })
  })
})()
