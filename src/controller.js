require('dotenv').config();

const users = JSON.parse(process.env.USERS);
let winner;

let active = false;
let segNum = 00;
let minNum = Number(process.env.MINUTES)
let hour = Number(process.env.HOURS)
let INTERVALO;

function segundos() {
  segNum--;
  if (segNum < 0) {
    segNum = 59;
    return minutos();
  }
  return segNum;
}

function minutos() {
  minNum--;
  if (minNum < 0) {
    minNum = 59;
    return horas();
  }
  return minNum;
}

function horas() {
  hour--;
  if(hour < 0) { clearInterval(INTERVALO);(active=false)};
  return hour;
}

function iniciar() {
  if (winner) return { msg: 'Já existe um ganhador!' };
  active = true;

  clearInterval(INTERVALO);
  INTERVALO = setInterval(() => {
    segundos();
  }, 1000);
  return { msg: 'Timer Iniciado' };
}

function getTimer() {
  return { hour, minNum, segNum, active, winner };
}

// -------------------------------------------

function passwdValidade({ id, passwd }) {
  if (!active) return { sucess: false, msg: 'Não é possível fazer tentativas!! Timer Parado!' };

  const user = users.find((user) => user.id === id);
  if (!user) return { sucess: false, msg: 'Usuário não encontrado' };

  if (user?.attempts < 3) {
    user.attempts += 1;
    if (process.env.SENHA === passwd) {
      clearInterval(INTERVALO);
      active = false;
      winner = user;
      return { success: true, user };
    }
    return { sucess: false, msg: `Você já usou ${user.attempts} de 3 tentativas!!` };
  }
  return { sucess: false, msg: 'Você não possui mais tentativas!!' };
}

function status() {
  return { users, winner };
}

module.exports = { iniciar, getTimer, passwdValidade, status };
