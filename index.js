const SteamUser = require("steam-user");
const config = require("./config.js");

const client = new SteamUser();
const idle_game = "359550";

client.logOn({
  accountName: config.username,
  password: config.password,
});

client.on("loggedOn", async function (details) {
  console.clear();
  let result = await client.getProductInfo([Number(idle_game)], []);
  console.log("Logged into Steam as " + client.steamID.getSteamID64());
  client.setPersona(SteamUser.EPersonaState.Online);
  console.log(
    `Idling Game Name: ${
      result.apps[Number(idle_game)].appinfo.common.name
    }, AppID: ${idle_game}`
  );
  client.gamesPlayed(Number(idle_game));
});
client.on("error", function (e) {
  // Some error occurred during logon
  console.log(e);
});
client.on("webSession", function (sessionID, cookies) {
  console.log("Got web session");
  // Do something with these cookies if you wish
});
client.on("newItems", function (count) {
  console.log(`${count} new items in your inventory`);
});
client.on("wallet", function (hasWallet, currency, balance) {
  console.log(
    `Your wallet balance is ${SteamUser.formatCurrency(balance, currency)}`
  );
});

client.on("accountLimitations", function (
  limited,
  communityBanned,
  locked,
  canInviteFriends
) {
  let limitations = [];

  if (limited) {
    limitations.push("LIMITED");
  }

  if (communityBanned) {
    limitations.push("COMMUNITY BANNED");
  }

  if (locked) {
    limitations.push("LOCKED");
  }

  if (limitations.length === 0) {
    console.log("Your account has no limitations.");
  } else {
    console.log(`Your account is ${limitations.join(", ")}.}`);
  }

  if (canInviteFriends) {
    console.log("Your account can invite friends.");
  }
});
client.on("vacBans", function (numBans, appids) {
  console.log(`You have ${numBans} VAC ban${numBans == 1 ? "" : "s"}.`);
  if (appids.length > 0) {
    console.log(`You are VAC banned from apps: ${appids.join(", ")}`);
  }
});
client.on("licenses", function (licenses) {
  console.log(
    `Your account owns ${licenses.length} license${
      licenses.length == 1 ? "" : "s"
    }.`
  );
});
