document.getElementById("tabela").addEventListener("mouseenter", async () => {
  try {
    const response = await fetch("http://localhost:3000/menu");
    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    const users = await response.json();
    const tabela = document.getElementById("tabela");
    let i = 0;
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.email;
      tabela.appendChild(li);
      i++;
    });
    tabela.style.width = 200;
    tabela.style.height = 25 * i;

    document
      .getElementById("tabela")
      .addEventListener("mouseleave", async () => {
        try {
          tabela.style.width = 20;
          tabela.style.height = 20;
          while (tabela.firstChild) {
            tabela.removeChild(tabela.firstChild);
          }
        } catch (error) {
          console.error("Erro:", error);
        }
      });
  } catch (error) {
    console.error("Erro:", error);
  }
});
