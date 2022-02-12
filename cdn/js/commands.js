/**
 * /!\ If you change anything in this function or call the WssResponse with a non Wss response, you will break the page and need to reload it.
 */
function setCtg(ctg, isWssRes, WssData = null){
  if (!isWssRes || !WssData) {
    // Non Wss response
    if (typeof ctg !== "string") return ErrorNotification("Un problème est suvenu en chargeant la catégorie.");
    Wss.send(JSON.stringify({
      "@type": "COMMANDS_GET",
      "ctg": ctg.toLowerCase().replace(/é|è|ê|ë/g, "e").replace(/[^a-zA-Z0-9\s]/g, ""),
    }));
  } else {
    // Wss response
    const data = WssData;
    if (typeof WssData == "string") data = JSON.parse(WssData);
    if (getValueType(data) !== "object" || data["@type"] !== "COMMANDS_GET" || !data.commands || !Array.isArray(data.commands))
      return ErrorNotification("Un problème est suvenu en chargeant les commandes.");
    if (data.state !== 200) return ErrorNotification(data.error);

    const commands = data.commands;
    const commandsList = document.getElementById("command-list");
    commandsList.innerHTML = commands.map(({ name, desc, aliase, use }) => `<li class="commands-line"><div class="name">${name}</div><div class="description">${desc.trim().replace(/\s+(!|\?|\))$/, "$1")}</div><div class="alias">${aliase.length > 0 ? aliase.join(" - ") : "Aucun aliase."}</div><div class="example">${use.replace(/\n/g, " / ")}</div></li>`).join("");
    document.getElementById("ctg-selected-body").innerHTML = `<p>${commands.length} commande(s)</p><h4>${data.ctgFullName}</h4>`;
    Array.from(document.getElementsByClassName("ctg-selected")).map((e) => e.classList.remove("ctg-selected"));
    document.getElementById(ctg).classList.add("ctg-selected");
  }
}