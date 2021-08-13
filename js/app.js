import { chart, createChart } from "./chart.js";

let passValidation = false;
document.getElementById("number").addEventListener("keyup", validator);
document.getElementById("number").addEventListener("blur", validator);

showHistorial();

let [graficaBar, graficaLine, donut] = createChart(); //instances charts

document.querySelector(".idelete").addEventListener("click", () => {
  document.getElementById("number").value = "";
});

document.getElementById("submit").addEventListener("click", (e) => {
  submit();
  e.preventDefault();
});

document
  .getElementById("deleteHistorial")
  .addEventListener("click", deleteRegisters); //delete historial

document.getElementById("generateUrl").addEventListener("click", () => {
  let urlGenerate = getData();
  copy2DToClipboard(urlGenerate);
});

function submit() {
  const link = getData();

  // document.querySelector('.btn-send').setAttribute('href',link);
  if (passValidation) {
    save();
    showHistorial();

    if (graficaBar === null) {
      [graficaBar, graficaLine, donut] = createChart();
    } else {
      var [arraygroupedDayhours, lastDaygrouped] = chart();
      var data = [];

      for (const item of arraygroupedDayhours) {
        data.push({ label: `${item.key}:00`, value: `${item.cantidad}` });
      }

      //data for donut chart
      const dataLastDay = [
        {
          label: Object.keys(lastDaygrouped)[0],
          value: lastDaygrouped[Object.keys(lastDaygrouped)[0]].length,
        },
      ];
      // console.log("la data es: ", data);
      graficaLine.setData(data);
      graficaBar.setData(data);
      donut.setData(dataLastDay);
    }
    window.open(link, "child-tab");
  } else {
    alert("Por favor valide antes el numero de telefono");
  }
  return false;
}

//get values from input fields
const getData = () => {
  const number = document.getElementById("number").value;

  const message = document.getElementById("message").value;
  return `https://web.whatsapp.com/send?phone=57${number}&text=${message}`;
};

function validator(e) {
  let pattern = /^\d{10}$/;

  const number = document.querySelector(".error");
  if (pattern.test(e.target.value)) {
    number.style.display = "none";
    e.target.classList.remove("is-invalid");
    e.target.classList.add("is-valid");
    passValidation = true;
  } else {
    number.style.display = "block";
    e.target.classList.remove("is-valid");
    e.target.classList.add("is-invalid");
    passValidation = false;
  }
}

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}

function save() {
  var date = toIsoString(new Date()).split("T");

  let fecha = date[0];
  let hora = date[1].slice(0, 8);

  let now = `${fecha} ${hora} `; //fulldate

  const info = {
    number: document.getElementById("number").value,
    message: document.getElementById("message").value.trim(),
    fecha: now,
  };

  var array = JSON.parse(localStorage.getItem("Info"));

  if (array) {
    array.unshift(info);
    localStorage.setItem("Info", JSON.stringify(array));
  } else {
    localStorage.setItem("Info", JSON.stringify([info]));
  }
}

function showHistorial() {
  const tbody = document.getElementById("tbody-historial");

  let array = JSON.parse(localStorage.getItem("Info"));

  var htmlTable = "";

  if (array) {
    //false historial save localstorage

    array.forEach((registro) => {
      htmlTable += `<tr height='10px'>
                        <td class='cell-content ' > ${registro.number}
                            <p class='info-cell'>${registro.number}</p>
                        </td>
                        <td class='cell-content ' > ${registro.fecha}
                            <p class='info-cell'>${registro.fecha}</p>
                        </td>
                        <td class='cell-content ' > ${registro.message}
                            <p class='info-cell'>${registro.message}</p>
                        </td>
                    </tr>`;
    });

    tbody.innerHTML = htmlTable;

    tbody.classList.remove("pre-animation2");
    setTimeout(function () {
      var array = document.querySelectorAll(".pre-animation");
      array.forEach((valor) => {
        valor.classList.remove("pre-animation");
      });
    }, 1000);
  } else {
    array = document.querySelectorAll(".cell-content");
    tbody.classList.add("pre-animation2");

    setTimeout(() => {
      tbody.innerHTML = "";
    }, 2000);
  }
}

export function deleteRegisters() {
  localStorage.removeItem("Info");

  showHistorial();
}

function copy2DToClipboard(array) {
  copyTextToClipboard(array);

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      // console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        // console.log('Async: Copying to clipboard was successful!');
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }
}
