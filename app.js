let game = {
  dealerIndex: 0,
  dealerBonus: 0,
  seatIndex: 0,
  roundWind: "東風",
  seats: ["東", "南", "西", "北"],
  players: [
    { name: "東", total: 0 },
    { name: "南", total: 0 },
    { name: "西", total: 0 },
    { name: "北", total: 0 }
  ],
  history: []
}

function init() {
  renderPlayers()
  renderSelect()
  updateStatus()
  renderHistory()
}

function renderPlayers() {
  const el = document.getElementById("players")
  el.innerHTML = ""
  game.players.forEach((p, i) => {
    el.innerHTML += `
      <div class="player">
        <b>${p.name}</b><br>
        金額：${p.total}
      </div>`
  })
}

function renderSelect() {
  const winner = document.getElementById("winner")
  const loser = document.getElementById("loser")

  winner.innerHTML = ""
  loser.innerHTML = `<option value="">自摸</option>`

  game.players.forEach((p, i) => {
    winner.innerHTML += `<option value="${i}">${p.name}</option>`
    loser.innerHTML += `<option value="${i}">${p.name}</option>`
  })
}

function updateStatus() {
  document.getElementById("status").innerHTML =
    `目前：${game.roundWind}${game.seats[game.seatIndex]}　
     莊家：${game.players[game.dealerIndex].name}
     連莊：${game.dealerBonus}`
}

function settle() {
  const winner = parseInt(document.getElementById("winner").value)
  const loserValue = document.getElementById("loser").value
  const loser = loserValue === "" ? null : parseInt(loserValue)
  const tai = parseInt(document.getElementById("tai").value)
  const flowerTai = parseInt(document.getElementById("flowerTai").value)
  const base = parseInt(document.getElementById("base").value)

  const totalTai = tai + flowerTai + game.dealerBonus
  const amount = totalTai * base

  let result = [0,0,0,0]

  if (loser === null) {
    // 自摸
    for (let i=0;i<4;i++){
      if (i !== winner){
        result[i] -= amount
        result[winner] += amount
      }
    }
  } else {
    result[loser] -= amount
    result[winner] += amount
  }

  for (let i=0;i<4;i++){
    game.players[i].total += result[i]
  }

  game.history.push({
    round: `${game.roundWind}${game.seats[game.seatIndex]}`,
    winner: game.players[winner].name,
    loser: loser === null ? "自摸" : game.players[loser].name,
    tai: totalTai,
    base,
    amount
  })

  nextRound(winner)
  save()
  renderPlayers()
  renderHistory()
  updateStatus()
}

function nextRound(winner){
  if (winner === game.dealerIndex){
    game.dealerBonus++
  } else {
    game.dealerBonus = 0
    game.dealerIndex = (game.dealerIndex+1)%4
    game.seatIndex++
    if (game.seatIndex>3){
      alert("東風結束")
      game.seatIndex=0
    }
  }
}

function renderHistory(){
  const el = document.getElementById("history")
  el.innerHTML=""
  game.history.forEach(h=>{
    el.innerHTML+=`
      <div>
      ${h.round}｜
      胡:${h.winner}｜
      放:${h.loser}｜
      ${h.tai}台｜
      ${h.amount}
      </div>`
  })
}

function save(){
  localStorage.setItem("mahjongGame",JSON.stringify(game))
}

function load(){
  const data = localStorage.getItem("mahjongGame")
  if (data){
    game = JSON.parse(data)
  }
}

load()
init()
