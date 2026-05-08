
document.querySelectorAll(".drop-btn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    const dropdown = this.parentElement;

    
    document.querySelectorAll(".dropdown").forEach(d => {
      if (d !== dropdown) d.classList.remove("active");
    });

    
    dropdown.classList.toggle("active");
  });
});

document.querySelectorAll(".dropdown-menu").forEach(menu => {
  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});


document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(d => {
    d.classList.remove("active");
  });
});
