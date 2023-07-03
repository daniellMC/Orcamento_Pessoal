const bars = document.querySelector(".bars");
const header = document.querySelector("header");
//========================
const btnDelete = document.querySelector("#delete-despesa-btn");

/*=======
  NAV
=========*/
bars.addEventListener("click", () => {
  if (header.style.height) {
    header.style.height = "";
  } else {
    header.style.height = "14rem";
  }
});
// =======================================
class Despesa {
  constructor(mes, dia, tipo, descricao, valor) {
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }
  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
  limparDados(mes, dia, tipo, descricao, valor) {
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  }
}
// ============================================
class Bd {
  constructor() {
    let id = sessionStorage.getItem("id");
    if (id === null) {
      sessionStorage.setItem("id", 0);
    }
  }
  getProximoId() {
    let proximoId = sessionStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }
  gravar(d) {
    let id = this.getProximoId();
    sessionStorage.setItem(id, JSON.stringify(d));
    sessionStorage.setItem("id", id);
  }
  recuperarRegistros() {
    let id = sessionStorage.getItem("id");
    let despesas = [];
    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(sessionStorage.getItem(i));

      if (despesa === null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }
    return despesas;
  }
}
// ==============================================
let bd = new Bd();

const addDespesa = () => {
  const mes = document.querySelector("#mes"),
    dia = document.querySelector("#dia"),
    tipoDespesa = document.querySelector("#tipoDespesa"),
    descricao = document.querySelector("#descricao"),
    valorAPagar = document.querySelector("#valor");

  let despesa = new Despesa(
    mes.value,
    dia.value,
    tipoDespesa.value,
    descricao.value,
    valorAPagar.value
  );
  if (despesa.validarDados() === true) {
    bd.gravar(despesa);
    despesa.limparDados(mes, dia, tipoDespesa, descricao, valorAPagar);
    toggleModal();
  } else {
    errorModal();
  }
};

function carregarListaDespesas() {
  let despesas = [];
  despesas = bd.recuperarRegistros();

  const table = document.querySelector("#listaDespesas");

  despesas.forEach((el) => {
    let linha = table.insertRow();

    linha.insertCell(0).innerHTML = `${el.dia}/${el.mes}/2023`;
    switch (el.tipo) {
      case "1":
        linha.insertCell(1).innerHTML = "Alimentação";
        break;
      case "2":
        linha.insertCell(1).innerHTML = "Educação";
        break;
      case "3":
        linha.insertCell(1).innerHTML = "Lazer";
        break;
      case "4":
        linha.insertCell(1).innerHTML = "Saúde";
        break;
      case "5":
        linha.insertCell(1).innerHTML = "Transporte";
        break;
    }
    linha.insertCell(2).innerHTML = el.descricao;
    linha.insertCell(3).innerHTML = el.valor;

    const btn = document.createElement("button");
    btn.setAttribute("id", "delete-despesa");
    btn.addEventListener("click", () => warning(el));
    btn.innerHTML = "<i class='fa-solid fa-xmark'></i>";

    linha.insertCell(4).append(btn);
  });
}

//SUCCESS MODAL
function toggleModal() {
  let fade = document.createElement("div");
  fade.setAttribute("id", "fade");

  let modal = document.createElement("div");
  modal.setAttribute("id", "modal");

  let modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  let textH3 = document.createElement("h3");
  textH3.textContent = "Registro inserido com sucesso";

  let modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  let textP = document.createElement("p");
  textP.textContent = "A despesa foi cadastrada com sucesso!";

  let btnClose = document.createElement("button");
  btnClose.textContent = "Voltar";
  btnClose.setAttribute("id", "close-modal");

  [fade, btnClose].forEach((el) => {
    el.addEventListener("click", () => {
      [fade, modal].forEach((el2) => {
        el2.classList.toggle("hide");
      });
    });
  });

  modalHeader.appendChild(textH3);

  modalBody.appendChild(textP);
  modalBody.appendChild(btnClose);

  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);

  document.body.appendChild(fade);
  document.body.appendChild(modal);
}
//ERROR MODAL
const errorModal = () => {
  let fade = document.createElement("div");
  fade.setAttribute("id", "fade");

  let modal = document.createElement("div");
  modal.setAttribute("id", "modal");

  let modalHeader = document.createElement("div");
  modalHeader.classList.add("error-modal-header");

  let textH3 = document.createElement("h3");
  textH3.textContent = "Erro na gravação";

  let modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  let textP = document.createElement("p");
  textP.textContent = "Existem campos obrigatórios que não foram preenchidos.";

  let btnClose = document.createElement("button");
  btnClose.textContent = "Voltar";
  btnClose.setAttribute("id", "error-close-modal");

  [fade, btnClose].forEach((el) => {
    el.addEventListener("click", () => {
      [fade, modal].forEach((el2) => {
        el2.classList.toggle("hide");
      });
    });
  });

  modalHeader.appendChild(textH3);

  modalBody.appendChild(textP);
  modalBody.appendChild(btnClose);

  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);

  document.body.appendChild(fade);
  document.body.appendChild(modal);
};

/*========================================================
                    CONSULTA
==========================================================*/

const warning = (el) => {
  let fade = document.createElement("div");
  fade.setAttribute("id", "fade");

  let modal = document.createElement("div");
  modal.setAttribute("id", "modal");

  let modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  let textH3 = document.createElement("h3");
  textH3.textContent = "Tem certeza que deseja deletar?";

  let textP = document.createElement("p");
  textP.textContent = "Essa ação é irreversível.";

  let modalBtns = document.createElement("div");
  modalBtns.classList.add("modal-btns");

  let btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancelar";
  btnCancel.setAttribute("id", "cancel-btn");

  let btnConfirm = document.createElement("button");
  btnConfirm.textContent = "Deletar";
  btnConfirm.setAttribute("id", "confirm-btn");

  const texts = [textH3, textP];
  const btns = [btnCancel, btnConfirm];

  [fade, btnConfirm, btnCancel].forEach((el) => {
    el.addEventListener("click", () => {
      [fade, modal].forEach((el) => {
        el.classList.toggle("hide");
      });
    });
  });
  btnConfirm.addEventListener("click", () => {
    sessionStorage.removeItem(el.id);
    window.location.reload();
  });
  modalBtns.append(...btns);

  modalContent.append(...texts);
  modalContent.appendChild(modalBtns);

  document.body.appendChild(fade);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};
