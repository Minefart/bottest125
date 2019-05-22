const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const low = require('lowdb');
const filesync = require('lowdb/adapters/FileSync');
const ms = require("ms");
const generator = require('generate-password');
const fetch = require('node-superfetch');
const moment = require('moment');
const fs = require("fs");
const antispam = require('discord-anti-spam');
const request = require("request");
const entities = require("entities");
const Qrcode = require("qrcode");
const ascii = require('ascii-art');
const FortniteAPI = require("fortnite");
const url = require('google-url');
const api = new url({key: process.env.key})

const adapter = new filesync('./Database/database.json')
const storeadapter = new filesync('./Database/store.json')
const manageservers = new filesync('./Database/manageserver.json')
const profil_adapter = new filesync('./Database/profil.json')
const raid_adapter = new filesync('./Database/anti-raid.json')
const vip_adapter = new filesync('./Database/vip.json')
const react_adapter = new filesync('./Database/react.json')
const vip = low(vip_adapter);
const anti_raid = low(raid_adapter);
const db = low(adapter);
const pfdb = low(profil_adapter);
const storedb = low(storeadapter);
const managesdb = low(manageservers);
const react = low(react_adapter);

var ticketnumber = 1;
var versionbot = "2.1";
var idcrateur = "Minefart_Le_Pro#7104";
 


db.defaults({ histoire: [],xp: [],idee: [],money: [],inventory: []}).write()
pfdb.defaults({desc: [],note: []}).write()
anti_raid.defaults({gban: []})
vip.defaults({vip: [],color: []}).write()
react.defaults({embed: []}).write()
managesdb.defaults({bvp: [],aup: [],channelb: [],channela: [],role: []}).write()
var storynumber = db.get('histoire').map('story_value').value();
var bot = new Discord.Client();
var Prefix = ":";
var randnum = 0;
var servers = {};

function play(connection, msg) {
  
  var server = servers[msg.guild.id];

  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() { 
    if (server.queue[0]) play(connection, msg);

    else connection.disconnect();

  });



}
bot.on("ready" , () => {
  console.log(`\x1b[33m%s\x1b[0m`,'[WARN]','\x1b[0m','Connexion en cours...');
  console.log(`\x1b[32m%s\x1b[0m`,'[OK]','\x1b[0m', 'Connexion à l\'API Discord.js effectuée');
  console.log(`\x1b[36m%s\x1b[0m`,'[INFO]', '\x1b[0m','Connecté sur ' + bot.user.username + '#' + bot.user.discriminator);
  console.log(`\x1b[32m%s\x1b[0m`,'[OK]','\x1b[0m','Chargement terminé');
  console.log(`\x1b[32m%s\x1b[0m`,'[OK]','\x1b[0m','Prêt et connecté - Développé par Minefart.');
  antispam(bot, {
      warnBuffer: 3,
      maxBuffer: 7,
      interval: 2000,
      warningMessage: ":warning: **Arrêtez de Spam ! Ceci peut être sensible à un Bannissement**:warning:",
      banMessage: " a été **Banni** Pour Spam",
      maxDuplicatesWarning: 7,
      maxDuplicatesBan: 10,
      deleteMessagesAfterBanForPastDays: 7,
      exemptUsers: ["Minefart_Le_Pro#7104"]
    });
});
bot.on("ready", function (msg) {
  bot.user.setActivity()
  
  let status_liste = [
    `${Prefix}help |${bot.guilds.size} Serveurs`,
    `${bot.guilds.size} Serveurs`,
    `${bot.users.size} Utilisateurs`
  ]
  
  setInterval(() => {
    let st = Math.floor(Math.random() * (status_liste.length - 1) + 1)
    bot.user.setPresence({ game: { name: status_liste[st], type:(0) }})
  }, 6000)
});

bot.on('guildCreate', guild => {
  const embed = new Discord.RichEmbed()
      .setDescription(`📌 Merci à **${guild.name}** d'avoir ajouté ${bot.user.username}`)
      .addField("📋 __Nom du serveur__", guild.name, true)
      .addField("📊 __Nombre de membres__ :", guild.memberCount, true)
      .addField("💻 __Nombre de salons__ :", guild.channels.size, true)
      .addField("👤 __Propriétaire__ :", guild.owner, true)
      .addField("🌍 __Région du serveur__ :", guild.region, true)
      .addField("📝 __ID du serveur__ :", guild.id, true)
      .setColor("#F03A17")
    bot.channels.get('552888040570486805').send(embed);
});
//logs
bot.on('messageDelete',member => {
  if(!member.guild.channels.find("name","logs")) return;
  const embed = new Discord.RichEmbed()
      .setDescription(`Message Supprimer :`)
      .addField("Salon:", `${member.channel.name}`)
      .addField("Autheur:",`**${member.author.username}**`)
      .addField("Message:",`${member.content}`)
      .setColor("#F03A17")
    member.guild.channels.find("name","logs").send(embed)
});



bot.on("guildMemberAdd" , member =>{
  if(!member.guild.channels.find("name","🎉-bienvenue-welcome")) return;
  if(managesdb.get("bvp").find({server: member.guild.id}).value()){
    var msgp = managesdb.get("bvp").find({server: member.guild.id}).value()
    var msgper = Object.values(msgp)
    var rolep = managesdb.get("role").find({server: member.guild.id}).value()
    var gRole = Object.values(rolep)
    let role2 = member.guild.roles.find(`name`, gRole[1]);
    var channel = managesdb.get("channelb").find({server: member.guild.id}).value()
    var channeler = Object.values(channel)
    try{
    member.guild.channels.find("name",channeler[1]).send(`${msgper[1]}`)
    member.addRole(role2)
    }catch(err){return;}
  }
})
bot.on("guildMemberRemove" , member =>{
  if(!member.guild.channels.find("bienvenue sur azriaz")) return;
    var msgp = managesdb.get("aup").find({server: member.guild.id}).value()
    var msgper = Object.values(msgp)
    var channel = managesdb.get("channela").find({server: member.guild.id}).value()
    var channeler = Object.values(channel)
    try{
    member.guild.channels.find("name",channeler).send(`${msgper[1]}`)
    }catch(err){return;}
})

bot.on('message' , msg => {
  bot.emit('checkMessage', msg);

  var msgauthors = msg.author.id;
  if(!managesdb.get("channela").find({server: msg.guild.id}).value()){
    managesdb.get('channela').push({server: msg.guild.id, channel: "🎉-bienvenue-welcome"}).write();
  }
  if(!managesdb.get("channelb").find({server: msg.guild.id}).value()){
    managesdb.get('channelb').push({server: msg.guild.id, channel: "🎉-bienvenue-welcome"}).write();
  }
  if(!managesdb.get("role").find({server: msg.guild.id}).value()){
    managesdb.get('role').push({server: msg.guild.id, role: "Auccun"}).write();
  }
  if(!managesdb.get("aup").find({server: msg.guild.id}).value()){
    managesdb.get('aup').push({server: msg.guild.id, message: "Aurevoir ,c’était sympa de nous rendre une petite visite :cold_sweat: !"}).write();
  }
  if(msg.author.bot)return;
  if(!managesdb.get("bvp").find({server: msg.guild.id}).value()){
    managesdb.get('bvp').push({server: msg.guild.id, message: "Hey, bienvenue :tada+hugging: ! Je te souhaite un bon jeu de la part de tout le staff !"}).write();
  }

  if(msg.author.bot)return;
  if(!db.get("inventory").find({user: msgauthors}).value()){
    db.get('inventory').push({user: msgauthors, item: "Vide"}).write();
  }
  if(msg.author.bot)return;
  if(!pfdb.get("desc").find({user: msgauthors}).value()){
  pfdb.get('desc').push({user: msgauthors, desc: "Aucune Description."}).write();
  }
  if(msg.author.bot)return;
  if(!db.get("xp").find({user: msgauthors}).value()){
    db.get('xp').push({user: msgauthors, xp:1}).write();
  }else{
    var userxpdb = db.get('xp').filter({user: msgauthors}).find('xp').value();
    console.log(userxpdb);
    var userxp = Object.values(userxpdb)
    console.log(userxp)
    console.log(`Nombre d'xp : ${userxp[1]}`)

    db.get('xp').find({user: msgauthors}).assign({user: msgauthors,xp: userxp[1] += 1}).write();
  }
//blague 
  const blague = [
    "Quel est le numéro de téléphone de la poule ? 4 4 4 7 1 9 !",
    "Un 0 rencontre un 8 : Eh ! Elle est chouette ta ceinture !",
    "Pourvu qu'il fasse beau, dit une maman kangourou,je n’aime pas laisser les enfants jouer à l'intérieur.",
    "Quel est le comble pour un Geek ? Etre privé de sortie...",
    "Deux poissons croisent une étoile de mer : Attention, voilà le shérif !",
    "Quel est l'animal qui n'a jamais soif ? Le zébu, car quand zébu z'ai plus soif !",
    "Quel est le comble pour un mathématicien ? Se faire voler sa moitié par un tiers dans un car."
  ]
  if(msg.content === Prefix + "blague"){
    const blagueN2 = Math.floor(Math.random() * (blague.length - 1) + 1)
    msg.channel.send(blague[blagueN2])
  }

  //ping-pong
    if(msg.content === Prefix + "ping"){
        msg.channel.send("pong");
        console.log("ping")
    }   
//yt
    if(msg.content === Prefix + "yt"){
      //msg.reply("Voila : https://www.youtube.com/channel/UCNr-CJSIA-grhveS48FX4rA , Abonne-Toi et met la cloche pour ressevoir les notifications :wink: ")
      const yt_embed = new Discord.RichEmbed()
        .setColor("#fb1549")
        .setDescription("Chaine Youtube de Minefart",true)
        .addField(":clapper:  Abonne-Toi et met la cloche :bell: pour ressevoir les notifications :wink:")
        .addField("[https://www.youtube.com/channel/UCWLl6uCJ1B_WzQKc85Nu8VQ]")
      msg.channel.send(yt_embed);
      }

//clear
    if(msg.content.startsWith(Prefix + "clear")){
      if(!msg.guild.member(msg.author).hasPermission("MANAGE_MESSAGES")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission MANAGE_MESSAGES**");
        
        let args = msg.content.split(" ").slice(1);

        if(!args[0]) return msg.channel.send("Tu doit indiquer le nombre de message a surpimer !")
        msg.channel.bulkDelete(args[0]).then(() => {
                msg.channel.send(`Les ${args[0]} messages ont bien été surpimer :grinning: (message suprimer dans 5 secondes)`).then(r => r.delete(5000))
                console.log("clear " + args[0])

            })
      
    }
//help embed
    if(msg.content === Prefix + "help"){
        const help_embed = new Discord.RichEmbed()
      .setAuthor('Commandes De Azriaz :')
      .setColor("#E2A324  ")
      .setDescription("Je suis un Bot Discord à t'a disposision")

      .addField("Prefix :",`**${Prefix}**`)
      .addField("<:defense:565586469322883092> • **Administration** ","`clear`,`sondage`,`ban`,`kick`,`msj`,`ajt`,`alert`,`warn`,`seewarns`,`deletewarns`,`tempmute`")
      .addField("🛡️ •565595567561113601> • **Anti-Raid**","`lock`,`unlock`",true)
      .addField("🎫 •566344590169473054> • **Premium**","`setembedcolor`,`psay`",true)
      .addField("📋  • **Personnalisation**","`bvp`,`aup`,`chbp`,`chap`,`rop`",true)                                                          
      .addField("📱 •565586449769037834> • **Musique** ","`play`,`skip`,`stop`",true)                                                                         
      .addField("💰 •565588885363490816> • **Economie** ","`store`,`buy`",true)
      .addField("🎮 • **Amusement**","`help`,`yt`,`8ball`,`add`,`infoserveur`,`infobot`,`ticket`,`lecture`,`verify`,`youtube`,`google`,`timeout`,`meteo`,`ascii`,`site`")
      .addField("ℹ️ •565586451530776576> • **Information**","`profil`,`desc`,`setdesc`,`note`,`newnote`", true)
      .setFooter(`©Azriaz 2018| Version: ${versionbot}`)
      .setThumbnail(bot.avatarURL)

    msg.channel.send(help_embed);
    console.log("help embed")
}

    if(!msg.content.startsWith(Prefix))  return;

    var args = msg.content.substring(Prefix.length).split(" ");

    switch (args[0].toLowerCase()){
//Musique
//play        
        case "play":
        var argsss = msg.content.substring(Prefix.length).split(" ");
        if (!argsss[1]) {
          
        msg.channel.sendMessage("Tu dois m’indiquer un lien YouTube"); 
    
        return;
    
      }
    
        if(!msg.member.voiceChannel) {
    
          msg.channel.sendMessage("<:false:565554162113445901> | Tu dois être dans un salon vocal"); 
    
        return;
    
      }
    
    
        if(!servers[msg.guild.id]) servers[msg.guild.id] = {
    
        queue: []
    
      };
    
    
      var server = servers[msg.guild.id];
    
    
      server.queue.push(argsss[1]);
    
      if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection) {
    
      play(connection, msg) 
    
      });
    
      break; 
//skip  
      break;
      case "skip":
    
        if(!msg.member.voiceChannel) {
    
          msg.channel.sendMessage("<:false:565554162113445901> | Tu dois être dans un salon vocal"); 
    
        return;
    
      }
    
        var server = servers[msg.guild.id];
    
        if(server.dispatcher) server.dispatcher.end();
    
        break;
//stop    
      case "stop":
    
        if(!msg.member.voiceChannel) 
        
        return msg.channel.send("<:false:565554162113445901> | Tu dois être dans un salon vocal");
    
        msg.member.voiceChannel.leave();
    
        break;
//histor
        case "newhistor":
        if(msg.author.id == "296585239822860288"){
          var value = msg.content.substring(11);
        var author = msg.author.id;
        var author_name = msg.author.username.toString();
        console.log("Histoire")
        console.log(value);
        msg.reply("Ajout de l'histoire dans la base de donné")

        db.get('histoire')
          .push({Id: author_name,s_value: value, s_author: author})
          .write();
        }
        
        break;
//lecture
        case "lecture":
        var Test = Math.floor(Math.random() * Math.floor(2));
        console.log(randnum);
        var story = db.get(`histoire[${Test}].s_value`).toString().value();
        var author_story = db.get(`histoire[${Test}].s_author`).toString().value();
        msg.channel.send(`Voici une histoire | ${story} |`)//(message ecrit par ${author_story})
        
//buy       
        case "buy":
          var itembuying = msg.content.substring(6);
          if(!itembuying){
            itembuying = "indeterminer!";
            msg.reply("Pour utilisé cette commande il faut faire `::buy <id>`")
          }else{
            console.log(`StoreLogs: Demande d'achat ${itembuying}`)
            if(storedb.get("store_items").find({itemID: itembuying}).value()){
              console.log("Item Trouver")
              var info = storedb.get("store_items").filter({itemID: itembuying}).find('name', 'desc').value();
              var iteminfo = Object.values(info);
              console.log(iteminfo);

              
              var useritem = db.get("inventory").filter({user: msgauthors}).find("item").value();
              var itemdb = Object.values(useritem);
              var userxpdb = db.get("xp").filter({user: msgauthors}).find("xp").value();
              var userxp = Object.values(userxpdb);
              if(userxp[1] >= iteminfo[3]){
                var buy_embed = new Discord.RichEmbed()
                .setTitle("Orange Store - Preuve D'âchat")
                  .setDescription("Ceci vous servira si vous avez eu un problème durant l'âchat (exemple : je n'ai pas ressus mon âchat)")
                  .addField("Infos :",`ID: ***${iteminfo[0]}***\n Nom: ***${iteminfo[1]}***\nDescription: ***${iteminfo[2]}***\nPrix: ***${iteminfo[3]}***`)
                msg.author.send(buy_embed);
                msg.reply(`**Information: ** Votre âchat (${iteminfo[1]}) a bien été accepté. Retrait de ${iteminfo[3]} :money_with_wings:`)
                if(!db.get("inventory").filter({user: msgauthors}).find({item: "Vide"}).value()){
                  console.log("Inventaire pas Vide")
                  db.get("xp").filter({user: msgauthors}).find("xp").assign({ser: msgauthors, xp: userxp[1] -= iteminfo[3]}).write();
                  db.get("inventory").filter({user: msgauthors}).find("item").assign({user: msgauthors, item: itemdb[1] + " , " + iteminfo[1]}).write();
                }else{
                  console.log("Inventaire Vide")
                  db.get("xp").filter({user: msgauthors}).find("xp").assign({ser: msgauthors, xp: userxp[1] -= iteminfo[3]}).write();
                  db.get("inventory").filter({user: msgauthors}).find("item").assign({user: msgauthors, item: iteminfo[1]}).write();
                }
              }else{
                msg.reply("<:false:565554162113445901> | Erreur : **Money insufisant**")
              }
            }
          }
          break;
      }
//Warn
 
var fs = require('fs');
 
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));
 
if (msg.content.startsWith(Prefix + "warn")){
 
if (msg.channel.type === "dm") return;
 
var mentionned = msg.mentions.users.first();
 
if(!msg.guild.member(msg.author).hasPermission("KICK_MEMBERS")) return msg.reply("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
if(msg.mentions.users.size === 0) {
 
  return msg.channel.send("**<:false:565554162113445901> | Vous n'avez mentionnée aucun utilisateur**");
 
}else{
 
    const args = msg.content.split(' ').slice(1);
 
    const mentioned = msg.mentions.users.first();
 
    if (msg.member.hasPermission('MANAGE_GUILD')){
 
      if (msg.mentions.users.size != 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
          if (args.slice(1).length != 0) {
 
            const date = new Date().toUTCString();
 
            if (warns[msg.guild.id] === undefined)
 
              warns[msg.guild.id] = {};
 
            if (warns[msg.guild.id][mentioned.id] === undefined)
 
              warns[msg.guild.id][mentioned.id] = {};
 
            const warnumber = Object.keys(warns[msg.guild.id][mentioned.id]).length;
 
            if (warns[msg.guild.id][mentioned.id][warnumber] === undefined){
 
              warns[msg.guild.id][mentioned.id]["1"] = {"raison": args.slice(1).join(' '), time: date, user: msg.author.id};
 
            } else {
 
              warns[msg.guild.id][mentioned.id][warnumber+1] = {"raison": args.slice(1).join(' '),
 
                time: date,
 
                user: msg.author.id};
 
            }
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
            msg.delete();
 
            msg.channel.send(':warning: | **'+mentionned.tag+' à été averti**');
 
            msg.mentions.users.first().send(`:warning: **Warn |** depuis **${msg.guild.name}** donné par **${msg.author.username}**\n\n**Raison:** ` + args.slice(1).join(' '))
 
          } else {
 
            msg.channel.send("Erreur mauvais usage: "+Prefix+"warn <user> <raison>");
 
          }
 
        } else {
 
          msg.channel.send("Erreur mauvais usage: "+Prefix+"warn <user> <raison>");
 
        }
 
      } else {
 
        msg.channel.send("Erreur mauvais usage: "+Prefix+"warn <user> <raison>");
 
      }
 
    } else {
 
      msg.channel.send("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
 
}
 
 
 
  if (msg.content.startsWith(Prefix+"seewarns")||msg.content===Prefix+"seewarns") {
 
if (msg.channel.type === "dm") return;
 
if(!msg.guild.member(msg.author).hasPermission("MANAGE_GUILD")) return msg.reply("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
    const mentioned = msg.mentions.users.first();
 
    const args = msg.content.split(' ').slice(1);
 
    if (msg.member.hasPermission('MANAGE_GUILD')){
 
      if (msg.mentions.users.size !== 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
          try {
 
            if (warns[msg.guild.id][mentioned.id] === undefined||Object.keys(warns[msg.guild.id][mentioned.id]).length === 0) {
 
              msg.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
              return;
 
            }
 
          } catch (err) {
 
            msg.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
            return;
 
          }
 
          let arr = [];
 
          arr.push(`**${mentioned.tag}** a **`+Object.keys(warns[msg.guild.id][mentioned.id]).length+"** warns :eyes:");
 
          for (var warn in warns[msg.guild.id][mentioned.id]) {
 
            arr.push(`**${warn}** - **"`+warns[msg.guild.id][mentioned.id][warn].raison+
 
            "**\" warn donné par **"+msg.guild.members.find("id", warns[msg.guild.id][mentioned.id][warn].user).user.tag+"** a/le **"+warns[msg.guild.id][mentioned.id][warn].time+"**");
 
          }
 
          msg.channel.send(arr.join('\n'));
 
        } else {
 
          msg.channel.send("Erreur mauvais usage: "+Prefix+"seewarns <user> <raison>");
 
          console.log(args);
 
        }
 
      } else {
 
        msg.channel.send("Erreur mauvais usage: "+Prefix+"seewarns <user> <raison>");
 
      }
 
    } else {
 
      msg.channel.send("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
 
 /////  
 
 
 
  if (msg.content.startsWith(Prefix+"deletewarns")||msg.content===Prefix+"deletewarns") {
 
if (msg.channel.type === "dm") return;
 
if(!msg.guild.member(msg.author).hasPermission("MANAGE_GUILD")) return msg.reply("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
   const mentioned = msg.mentions.users.first();
 
    const args = msg.content.split(' ').slice(1);
 
    const arg2 = Number(args[1]);
 
    if (msg.member.hasPermission('MANAGE_GUILD')){
 
      if (msg.mentions.users.size != 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">"){
 
          if (!isNaN(arg2)) {
 
            if (warns[msg.guild.id][mentioned.id] === undefined) {
 
                msg.channel.send(mentioned.tag+" n'a aucun warn");
 
              return;
 
            } if (warns[msg.guild.id][mentioned.id][arg2] === undefined) {
 
                msg.channel.send("**<:false:565554162113445901> | Ce warn n'existe pas**");

              return;
 
            }
 
            delete warns[msg.guild.id][mentioned.id][arg2];
 
            var i = 1;
 
            Object.keys(warns[msg.guild.id][mentioned.id]).forEach(function(key){
 
              var val=warns[msg.guild.id][mentioned.id][key];
 
              delete warns[msg.guild.id][mentioned.id][key];
 
              key = i;
 
              warns[msg.guild.id][mentioned.id][key]=val;
 
              i++;
 
            });
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
            if (Object.keys(warns[msg.guild.id][mentioned.id]).length === 0) {
 
              delete warns[msg.guild.id][mentioned.id];
 
            }
 
            msg.channel.send(`Le warn de **${mentioned.tag}**\': **${args[1]}** a été enlevé avec succès!`);
 
            return;
 
          } if (args[1] === "tout") {
 
            delete warns[msg.guild.id][mentioned.id];
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
            msg.channel.send(`Les warns de **${mentioned.tag}** a été enlevé avec succès!`);
 
            return;
 
          } else {
 
            msg.channel.send("Erreur mauvais usage: "+Prefix+"clearwarns <utilisateur> <nombre>");
 
          }
 
        } else {
 
          msg.channel.send("Erreur mauvais usage: "+Prefix+"clearwarns <utilisateur> <nombre>");
 
        }
 
      } else {
 
        msg.channel.send("Erreur mauvais usage: "+Prefix+"clearwarns <utilisateur> <nombre>");
 
      }
 
    } else {
 
      msg.channel.send("**<:false:565554162113445901> | Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
//info serveur
    if(msg.content === Prefix + "infoserveur"){
     /* var embed_info = new Discord.RichEmbed()
      .setTitle("Info du serveur :")
      .addField("Nom du Discord : ", msg.guild.name)
      .addField("Crée le : ", msg.guild.createdAt)
      .addField(`Sur se serveur il y a ${msg.guild.channels.size} salon textuel,salon vocaux, Categorie`)
      .addField("Tu as rejoin le : ", msg.member.joinedAt)
      .addField("Nombre de personne sur le Discord : ", msg.guild.memberCount)
      .addField(`Il y a :`,`${msg.guild.roles.size} roles sur le serveur`)
      .setColor("0x0000FF")
    msg.channel.send(embed_info)*/
    let botSize = msg.guild.members.filter(b => b.user.bot).size
    let userSize = msg.guild.members.size;
    let userSizenobot = userSize - botSize;
    var infodiscord = new Discord.RichEmbed()
        .setAuthor(`${msg.guild.name}`, msg.guild.iconURL)
        .setThumbnail(msg.guild.iconURL)
        .addField("📌 • __Propriétaire__ :", `${msg.guild.owner.user}`, true)
        .addField("🌏 • __Région__ :", msg.guild.region, true)
        .addField("📋 • __Channels__ :", `**${msg.guild.channels.size}** channels`, true)
        .addField("👥 • __Utilisateurs :__ ", `**${userSizenobot}** utilisateurs`, true)
        .addField("🤖 • __Bots__ :", `**${botSize}** robots`, true)
        .addField("📄 • __ID__ :", msg.guild.id, true)
        .addField("🔒 • __Niveau vérification__ :", `Niveau **${msg.guild.verificationLevel}**`, true)
        .addField("🎭 • __Nombre de rôles__ :", `**${msg.guild.roles.size}** rôles`, true)
        .addField("🔧 • __Nombre d'émojis :__", `**${msg.guild.emojis.size}** émojis`, true)
        .addField("<:calendar:551484928307625986> • __Date de création__ :", `${moment(msg.channel.guild.createdAt).format("LL")}`, true)
        .setColor("#8697CB")
    msg.channel.send(infodiscord)
    }
//kick
  if (msg.content.startsWith(Prefix + 'kick')) {
    const user = msg.mentions.users.first();
    if(!msg.guild.member(msg.author).hasPermission("KICK_MEMBERS")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission KICK_MEMBERS**");
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member.kick('Raison').then(() => {
          msg.reply(`${user.tag} a bien été expulsé`);
        }).catch(err => {
          msg.reply('Je suis incapable de kick le membre');

          console.error(err);
        });
      } else {

        msg.reply("Cette utilisateur n'existe pas ou impossible a kick");
      }
    } else {
      msg.reply("Tu doit mentionner quelqu'un!");
    }
  } 
//ban
  if (msg.content.startsWith(Prefix + 'ban')) {
    if(!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission BAN_MEMBERS**");
    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member.ban({
          reason: 'Ils étaient mauvais!',
        }).then(() => {
          msg.reply(`${user.tag} à bien été ban`);
        }).catch(err => {
          msg.reply("Je n'ai pas autorisation");
          console.error(err);
        });
      } else {
        msg.reply("Cet utilisateur n'existe pas");
      }
    } else {
      msg.reply("Vous n'avez pas mentionné l'utilisateur à bannir");
    }
  }
//avatar
  if (msg.content === Prefix + 'avatar') {
    // Send the user's avatar URL
    msg.author.send(msg.author.avatarURL);
    console.log("avatar")
  }
//ca-va
if(msg.content === "sv" ){
  ramdom();

    if(randnum == 1){
      msg.reply("Merci je vais bien");
      console.log(randnum );
    }

    if(randnum == 2 ){
      msg.reply("Je ne vais pas tres bien,merci de t'inquieter")
      console.log(randnum);
    }
    if(randnum == 3 ){
      msg.reply("Cool , Et toi ?")
      console.log(randnum);
    }

  }

function ramdom(min, max) {
  min = Math.ceil(0);
  max = Math.floor(3);
  randnum = Math.floor(Math.random() * (max - min + 1 ) + min);

}
//sondage
if(msg.content.startsWith(Prefix + "sondage")){
    if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**"); 
    var sond_msg = msg.content.substring(9);
    //var sond_msg = msg.content.split(" ").slice(1);
    if(!sond_msg[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+sondage <message>`")
    var questionembeds = new Discord.RichEmbed()
      .setDescription(":bar_chart: Sondage : ")
      .addField(sond_msg , "Repondre avec <:true:569614358359834635>ou <:false:565554162113445901> |")
      .setColor("0xB40404")
      .setThumbnail(bot.avatarURL)
      .setTimestamp()
    msg.channel.sendEmbed(questionembeds)
    .then(function (msg){
      msg.react("✅")
      msg.react("❌")
    }).catch(function(){
    });
    msg.delete()
}

function story_ramdom(min, max) {
  min = Math.ceil(0);
  max = Math.floor(storynumber);
  randnum = Math.floor(Math.random() * (max - min + 1 ) + min);

}
//info-bot 
  if(msg.content === Prefix + "infobot"){
    const { version } = require("discord.js")
    var list = bot.guilds.map(r => r.name + ` | **${r.memberCount} membres**`)
    //const duration = moment.duration(bot.uptime).format(" D [j], H [h], m [m], s [s]");
    var serversembed = new Discord.RichEmbed()
    .addField(`:satellite: __Actif sur :__`,`${bot.guilds.size} serveurs.`, true)
    .addField(":ping_pong: __Le bot a un ping de :__",bot.ping +"ms", true)
    .setTitle("📝 Informations sur " + `${bot.user.username}`, true)
    .addField("📋 __Nom__ :", `${bot.user.username}`, true)
    .addField("🔗 __Discriminateur__ :", "#" + `${bot.user.discriminator}`, true)
    .addField("📌 __Développeur__ :", "👑Minefart_Le_Pro👑™#7104 ", true)
    .addField("📊 __Utilisateurs__ :", `${bot.users.size}`, true)
    .addField("⚙️  __Version Du Bot__: ", ` V.${versionbot}`,true)
    .addField("🔧 __Version de discord.js__ :", `v${version}`, true)
    .addField("🔨 __Version de node.js__ :", `${process.version}`, true)
    .addField(":checkered_flag: __En ligne depuis__ :", (Math.round(bot.uptime / (1000 * 60 * 60))) + ' heures ' + (Math.round(bot.uptime / (1000 * 60)) % 60) + ' minutes ' + (Math.round(bot.uptime / 1000) % 60) + ' secondes ', true)
    .addField("💾 __Mémoire__ :", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}` + " MB", true)
    //.addField("📑__Liste des serveurs__",list.join("\n"), true)
    //.addField("<:system:551484929360265246> __En ligne depuis__ :", `${duration}`, true)
    .setColor("#8697CB")
    .setThumbnail(bot.user.avatarURL)
    .setTimestamp()
    msg.channel.sendEmbed(serversembed);
  }

//add
  if(msg.content === Prefix + "add"){
    var addembed = new Discord.RichEmbed()
      .setDescription(":wrench: Ajouter Azriaz sur votre serveur discord !")
      .addField("**__Lien d'invitation avec les permissions d'administrateurs :__**","**__[Clique-ici](https://discordapp.com/api/oauth2/authorize?client_id=573920601392021505&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D)__**")
      .setColor("ffec00")
      msg.channel.sendEmbed(addembed);
  }

//ticket
      var aut = msg.author.username

  if(msg.content.startsWith(Prefix + "ticket")){
    //var ticket_msg = msg.content.split(" ").slice(1);
    var ticket_msg = msg.content.substring(9);
    msg.delete();
    ticketnumber =+1;
    let role = msg.guild.roles.find("name", "Ticket");
    if(!role) return msg.channel.send("<:false:565554162113445901> | Erreur: **Role Manquant** Syntaxe: `ajouter le grade **Ticket**` ou `+ajt`")
    if(!ticket_msg[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+ticket <message>`")
    var memberID = msg.guild.members.filter(m=>m.roles.has(role.id)).map(m=>m.id) //pour récupérer les membre du rôle
    var ticket_emmbed =new Discord.RichEmbed()
    .setColor('fff000')
    .setDescription("**Nouveau Ticket :**")
    .addField("**Envoyer Par :**",aut)
    .addField("**Détail :**",ticket_msg)
    .addField("**Pour:**",'Staff')
  memberID.map(u => bot.users.get(u).send(`**Nouveau Ticket : **${msg.author.username} \n**Serveur:** ${msg.guild.name} \n**Détail:** ${ticket_msg}`));   
  msg.channel.send(ticket_emmbed)
  msg.author.send("Votre ticket à bien été envoyé aux aux staff du serveur il vous répondront dés que possible")
  }
/*
  var aut = msg.author.username

  if(msg.content.startsWith(Prefix + "ticket")){
    var test = msg.content.substring(9);
    msg.delete();
    ticketnumber =+1;
    let role = msg.guild.roles.find("name", "Test");
    var memberID = msg.guild.members.filter(m=>m.roles.has(role)).map(m=>m.id) //pour récupérer les membre du rôle
    var ticket_emmbed =new Discord.RichEmbed()
    .setColor('fff000')
    .setDescription("**Nouveau Ticket :**")
    .addField("**Envoyer Par :**",aut)
    .addField("**Détail :**",test)
    .addField("**Pour:**",'Staff')
    
  memberID.map(u => bot.users.get(u).send('New ticket by: '+msg.author));   
  msg.channel.send(ticket_emmbed)
  msg.author.send("Votre ticket à bien été envoyé aux staff du serveur il vous répondront dés que possible")
  }*/
 
//annonce
  if(msg.content.startsWith(Prefix + "annonce")){
    if(!msg.guild.member(bot.user).hasPermission("ADMINISTRATOR")) return msg.channel.send("Je n'ai pas la permission !");
    if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**"); 
    var mention_ann = msg.mentions.everyone
    var ann_msg = msg.content.substring(9);
    //var ann_msg = msg.content.split(" ").slice(1);
    if(!ann_msg[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+annonce <message>`")
    msg.delete();
      var questionembeds = new Discord.RichEmbed()
      .setDescription(":alarm_clock: [Annonce] :alarm_clock:")
      .addField(ann_msg, `Annonce écrite par : ${msg.author.username}`)
      .setColor("#107b90")
      .setThumbnail(bot.avatarURL)
      .setTimestamp()
    msg.channel.sendEmbed(questionembeds)
    if(mention_ann === true){
      msg.channel.send("Mention: [ @everyone ]")
    }
    if(mention_ann === false){
      msg.channel.send("Mention: [ Auccune ]")
    }
   
  }
//profil
  if(msg.content.startsWith(Prefix + "profil")){
    const membre = msg.mentions.members.first() || msg.member;
    if(!membre) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention**");
    if(membre.presence.status === "dnd"){ status = "Occupé";};
    if(membre.presence.status === "offline"){ status = "Invisible";};
    if(membre.presence.status === "online"){ status = "Connecté";};
    if(membre.presence.status === "idle"){ status = "Inactif";};
    var status;
    var msgauthors = msg.author.id;
    try{
    var profildb = pfdb.get("desc").filter({user: membre.id}).find("desc").value();
    var userprofil = Object.values(profildb);
    var useritem = db.get("inventory").filter({user: membre.id}).find("item").value();
    var itemdb = Object.values(useritem);
    var userCreateDate = msg.author.createdAt.toString().split(" ");
    var xp = db.get('xp').filter({user: membre.id}).find('xp').value();
    var xpfinal = Object.values(xp);

    var xp_embed = new Discord.RichEmbed()
      .setTitle(`Profile :`)
      .addField(":bust_in_silhouette: • Pseudo :",membre,true)
      .addField(":id: • Id:",membre.id,true)
      .addField(`:dollar:• Money`,`${xpfinal[1]}`,true)
      .addField(`:handbag: • inventaire :`,itemdb[1],true)
      //.addField(`:robot:• Tu es un robot ?` , membre.bot,true)
      .addField(":speaking_head: • Statut",status,true)
      .addField(":video_game:• Activité ",`${membre.user.presence.game ? `${membre.user.presence.game.name}` : "Aucun jeu"}`,true)
      .addField(":clipboard: • Description :", "`"+userprofil[1] + "`")
      //.addField(`:tada: • Date de creation de l'utilisateur : ` , membre.createdAt,true)
      .setThumbnail(membre.user.avatarURL)
    msg.channel.send(xp_embed);
    }catch(err){
      var xp_embed = new Discord.RichEmbed()
      .setTitle(`Profile :`)
      .addField(":bust_in_silhouette: • Pseudo :",membre,true)
      .addField(":id: • Id:",membre.id,true)
      .addField(`:dollar:• Money`,"Indéfinie",true)
      .addField(`:handbag: • inventaire :`,"Indéfinie",true)
      //.addField(`:robot:• Tu es un robot ?` , membre.bot,true)
      .addField(":speaking_head: • Statut",status,true)
      .addField(":video_game:• Activité ",`${membre.user.presence.game ? `${membre.user.presence.game.name}` : "Aucun jeu"}`,true)
      .addField(":clipboard: • Description :","Indéfinie")
      .setThumbnail(membre.user.avatarURL)
    msg.channel.send(xp_embed);
    }
  }

//shop / Store
if(msg.content.startsWith(Prefix + "store")){
  const Store = new Discord.RichEmbed()
    .setDescription("Voici le market.")
    .setThumbnail("https://images.clipartlogo.com/files/istock/previews/9692/96924895-local-market-fruit-and-vegetables-farmers-market-flat-design-m.jpg")
    .setColor("#ae1fdc")
    .addField("___**Bouffe**___ :","`Frites des ch'tis ` [200 :money_with_wings:] [id : `item1`] \n `Big Burger` [400 :money_with_wings:] [id : `item2`] \n `Coca-Cola 50cl` [50 :money_with_wings:] [id : `item3`]")
    .setFooter("Merci.")
  msg.channel.send(Store);
}
/*
if(msg.content.startsWith(Prefix + "give")){
  let give = msg.content.split(" ").slice(2);
  var test = Object.values(give) 
  var notgivve = msg.guild.member(msg.mentions.users.first());
  if(!notgivve) return msg.reply("Erreur");
  db.get('xp').find({user: msgauthors}).assign({user: msgauthors,xp: userxp[1] += 1}).write();
  console.log(`ajout de ${give} money , a ${notgivve}`)


}*/

//Mise a jour
if(msg.content.startsWith(Prefix + "msj")){
  if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**"); 
  //var msj_msg = msg.content.split(" ").slice(" ");
  var msj_msg = msg.content.substring(5);
  if(!msj_msg[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+msj <mise à jour>`")
  var miseajour_embed = new Discord.RichEmbed()
    .setDescription(":newspaper: Mise à jour : ")
    .setColor("fff300")
    .addField(msj_msg , "Elle vous plait la Mise à Jour <:true:569614358359834635>ou <:false:565554162113445901> |")
    .setTimestamp()
  msg.channel.send(miseajour_embed)
  .then(function (msg){
    msg.react("✅")
    msg.react("❌")
  }).catch(function(){
  });
  msg.delete()
}

//alert
if(msg.content.startsWith(Prefix + "alert")){
  if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**"); 
  const membre = msg.mentions.members.first();
  msg.delete();
  var alert_msg = msg.content.substring(7);
  //var alert_msg = msg.content.split(" ").slice(2);  
  if(!membre) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention** Syntaxe: `+alert <user> <message>`")
  //if(!sbg[1]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+alert <user> <message>`")

  const Alert_embed = new Discord.RichEmbed()
    .setTitle(":rotating_light: [Alert] :rotating_light:")
    .setColor("ff0000")
    .setDescription("On vous appelle")
    .addField(`${alert_msg}`,`**Serveur :** __${msg.guild.name}__`)
    .setFooter(`${msg.author.username} VOUS DEMANDES`)
  membre.send(Alert_embed)
}

//mute
if(msg.content.startsWith(Prefix + "mute")){
  if(!msg.guild.member(msg.author).hasPermission("MANAGE_ROLES")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission MANAGE_ROLES**");
  let member = msg.mentions.members.first();
  //var mute_msg = msg.content.substring(6);
  var mute_msg = msg.content.split(' ').slice(2);
  if(!member) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention** Syntaxe: `+mute <user> <raison>`")
  let channels = msg.guild.channels.array()
  for(var i=0; i < channels.length; i++){
    channels[i].overwritePermissions(member, {SEND_MESSAGES: false})
    .catch(er => {msg.channel.send(`<:false:565554162113445901> | Erreur: **${er}**`); i = channels.length;});
  }
  const mute_embed = new Discord.RichEmbed()
    .setDescription("Mute")
    .addField("**Par :**", msg.author.username)
    .addField("**Pour :**",  member.displayName)
    .addField("**Raison :**", mute_msg)
    .addField("**Temps :**", "Indefini")
  msg.channel.send(mute_embed)
}
//unmute
if(msg.content.startsWith(Prefix + "unmute")){
  if(!msg.guild.member(msg.author).hasPermission("MANAGE_ROLES")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission MANAGE_ROLES**");
  let member = msg.mentions.members.first();
  if(!member) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention** Syntaxe: `+unmute <user>`")
  let channels = msg.guild.channels.array()
  for(var i=0; i < channels.length; i++){
    channels[i].overwritePermissions(member, {SEND_MESSAGES: true})
    .catch(er => {msg.channel.send(`<:false:565554162113445901> | Erreur: **${er}**`); i = channels.length;});
  }
  msg.channel.send(`${member.displayName} est unmute par ${msg.author.username}`)

}

// ajout au serveur / role / salon / ect... / ajt
if(msg.content.startsWith(Prefix + "ajt")){
  if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  msg.reply("Le téléchargement est en cour...").then(r => r.delete(10000))
        //let role = member.guild.roles.find("name", "Ticket");
        if(!msg.guild.roles.find(`name`,"Ticket")){
          msg.channel.send("**Grade :** `Ticket` Ajouté").then(r => r.delete(10000))   
        msg.guild.createRole({
          name: "Ticket",
          color: "09dd23",
          permissions: []
        })
        }
        msg.guild.createChannel("📋Ticket")
        msg.channel.send("**Salon :** `📋Ticket` Ajouté").then(r => r.delete(10000))
        if(!msg.guild.roles.find(`name`,"Vérifié")){
          msg.channel.send("**Grade :** `Vérifié` Ajouté").then(r => r.delete(10000))   
        msg.guild.createRole({
          name: "Vérifié",
          color: "09dd23",
          permissions: []
        })
        }
        msg.guild.createChannel("✔-vérifié")
        msg.channel.send("**Salon :** `✔-vérifié` Ajouté  Ce salon doit etre invisible aux autre membres (sauf a ce qui on le grade `Vérifié`)").then(r => r.delete(10000))
        msg.channel.send("**Fin !**").then(r => r.delete(10000))
        msg.channel.send("Je précise que ceci peut changer ,merci d'effectuer cette commande fréquemment.").then(r => r.delete(10000))
      }


if(msg.content.startsWith(Prefix + "addrole")){
  if (!msg.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(msg, "MANAGE_ROLES");
  if (args[0] == "help") {
    msg.reply("<:false:565554162113445901> | Erreur: **Syntaxe** Syntaxe: `+addrole <role> <user>`");
    return;
  }
  let rMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(args[0]);

  let role = args.join(" ").slice(8);
  msg.reply(role)
  if (!role) return msg.reply("<:false:565554162113445901> | Erreur: **Mention Rôle**");
  let gRole = msg.guild.roles.find(`name`, role);
  if (!gRole) return msg.reply("<:false:565554162113445901> | Erreur: **Rôle Indéfini**");
  if (rMember.roles.has(gRole.id)) return msg.reply("<:false:565554162113445901> | Erreur: **Membre à déjà le Rôle**");
  rMember.addRole(gRole.id)

  try {
     rMember.send(`Congrats, you have been given the role ${gRole.name}`)
  } catch (e) {
    console.log(e.stack);
    msg.channel.send(`Congrats to <@${rMember.id}>, they have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked.`)
  }
}

if(msg.content.startsWith(Prefix + "verify")){
  msg.delete();
  let rMember = msg.mentions.users.first()
  const filter = m => m.author.id === msg.author.id;
  let code = "indefini";
  var pass = generator.generate({
    length: 10,
    numbers: true,
    symboles: true
  });
  code = pass;
  msg.channel.send("<:true:569614358359834635>Code de Vérification envoyer.").then(r => r.delete(2000))
  const mdp_embed = new Discord.RichEmbed()
    .addField("📋 __Mot de Passe__", code, true)
    .setDescription("Vous voulez vous vérifiez")
  msg.author.send(mdp_embed);
    msg.channel.awaitMessages(filter,{
    max:1,
    time:30000
  }).then(collected => {
    if(collected.first().content === code ){
      msg.channel.bulkDelete(2)
      msg.reply("<:true:569614358359834635>Bon Code")
    }else{
      msg.reply("<:false:565554162113445901> | Erreur: **Mauvais Code** ")
    }
  }
)}
//Mise a jour
if(msg.content.startsWith(Prefix + "newbot")){
  if(msg.author.username === idcrateur) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission Créateur**")
  //var msj_msg = msg.content.split(" ").slice(" ");
  var msj_msg = msg.content.substring(8);
  if(!msj_msg[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message** Syntaxe: `+msj <mise à jour>`")
  versionbot + 0,1;
  var miseajour_embed = new Discord.RichEmbed()
    .setDescription(`:newspaper: Mise à jour De ${bot.user.username}: `)
    .setColor("fff300")
    .addField(msj_msg , "Elle vous plait la Mise à Jour du bot <:true:569614358359834635>ou <:false:565554162113445901> |")
    .setTimestamp()
  msg.channel.send(miseajour_embed)
  .then(function (msg){
    msg.react("✅")
    msg.react("❌")
  }).catch(function(){
  });
  msg.delete()
}
//timeout
if (msg.content.startsWith(Prefix+"timeout")){
  let time = msg.content.replace(Prefix+"timeout", "");
  if (time == "reset") {
    if (globalInterval != false) {
      msg.channel.send({embed: {
        title: "Compte à rebours",
        color: 16777215,
        description: "Voilà "+msg.author+" ! Votre compte à rebours a été réinitialisé."
      }});
      clearInterval(globalInterval);
      globalInterval = false;
    } else {
      msg.channel.send({embed: {
        title: "Erreur de compte à rebours",
        color: 16777215,
        description: "Désolé "+msg.author+". Mais aucun compte à rebours n'est actuellement en route..."
      }});
    }
  } else if (!isNaN(parseInt(time)*1000) && parseInt(time)*1000 >= 0) {
    let secs = (time < 10 ? "0"+time : time); // str
      time = parseInt(time) * 1000; // number
  msg.channel.send({embed: {
    title: "Compte à rebours",
    color: 16777215,
    description: "Voilà, votre compte à rebours de `"+secs+"` secondes a été initialisé.\nPlus qu'à attendre !"
  }});
  globalInterval = setInterval(function(){
    msg.channel.send({embed: {
      title: "Temps écoulé !",
      color: 16777215,
      description: msg.author+", votre compte à rebours est écoulé !\nIl était de ```"+secs+" secondes```"
    }});
    clearInterval(globalInterval);
    globalInterval = false;
  }, time);
  } else {
    msg.channel.send({embed: {
      title: "Erreur de compte à rebours",
      color: 16777215,
      description: msg.author+", Merci d'utiliser \"OrangeBot timeout\" de la façon suivante: \n ```timeout 7 _ou_ timeout reset```"
    }});
  }
}
//youtube
if (msg.content.startsWith(Prefix+'youtube')) {

  request("https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=AIzaSyCyZgRt-igTYO05X_8LgDwoOsZgdqf4h3U&relevanceLanguage=fr&q="+encodeURI(msg.content.replace(Prefix+"youtube ", "")), function(error, response, body) {
    let json = JSON.parse(body),
       q = msg.content.replace(Prefix+"youtube ", ""),
      resultsNb = json.pageInfo.totalResults,
      txt = "_"+resultsNb+" vidéos ont été trouvées pour **"+q+"**._\n",
      on, tw, th, fo, fi;
    if (resultsNb != 0) {
      for (let i = 1; i<6; i++) {
        let title = entities.decodeHTML(json.items[i-1].snippet.title);
        txt += "\n**"+i+". ["+title+"](https://www.youtube.com/watch?v="+json.items[i-1].id.videoId+")**";
      }
      msg.channel.send({embed: {
        title: "Recherche youtube",
        color: 16057630,
        description: txt,
        footer: {
          text: "YouTube",
          icon_url: "https://theotime.me/discord/youtube.png"
        }
      }}).then(msg => {
        msg.react(msg.guild.emojis.find(val => val.name == "1⃣"));
        msg.react(msg.guild.emojis.find(val => val.name == "2⃣"));
        msg.react(msg.guild.emojis.find(val => val.name == "3⃣"));
        msg.react(msg.guild.emojis.find(val => val.name == "4⃣"));
        msg.react(msg.guild.emojis.find(val => val.name == "5⃣"));
        
        client.on('messageReactionAdd', (reaction, user) => {
          if (!user.bot && reaction.message.id == msg.id) {
            switch(reaction.emoji.name) {
              case msg.guild.emojis.find(val => val.name == "five"): 
            }
          }
        });
      });
    } else {
      msg.channel.send({embed: {
        title: "Recherche youtube",
        color: 16057630,
        description: "Désolé, aucun résultat n'a été trouvé pour **"+m.replace(prefix+'youtube ', "")+"**,\nveuillez reformuler votre requête.",
        footer: {
          text: "YouTube",
          icon_url: "https://theotime.me/discord/youtube.png"
        }
      }});
    }
  });
}
//google
if (msg.content.startsWith(Prefix+'google ')) {
  request("https://www.googleapis.com/customsearch/v1?cx=017567266544748746605:9-8clqys140&key=AIzaSyCyZgRt-igTYO05X_8LgDwoOsZgdqf4h3U&q="+encodeURI(msg.content.replace(Prefix+"google ", "")), function(error, response, body) {
    let json = JSON.parse(body),
       q = json.queries.request[0].searchTerms,
      time = json.searchInformation.formattedSearchTime,
      resultsNb = json.searchInformation.formattedTotalResults,
      icon = false,
      txt = "_Environ "+resultsNb+" résultats pour **"+q+"** ("+time+" secondes)._\n";
    if (resultsNb != 0) {
      for (let i = 1; i<6; i++) {
        txt += "\n**"+i+". ["+json.items[i-1].title+"]("+json.items[i-1].link+")**";
        if (json.items[i-1].hasOwnProperty("pagemap")) {
          if (json.items[i-1].pagemap.hasOwnProperty("cse_thumbnail") && icon == false) {
            if (json.items[i-1].pagemap.cse_thumbnail[0].height == json.items[i-1].pagemap.cse_thumbnail[0].width) {
              icon = json.items[i-1].pagemap.cse_thumbnail[0].src;
            }
          }
        }
      }
      if (icon == false) {
        msg.channel.send({embed: {
          title: "Recherche google",
          color: 16777215,
          description: txt,
          footer: {
            text: "Google",
            icon_url: "https://theotime.me/discord/google.ico"
          }
        }});
      } else {
        msg.channel.send({embed: {
          title: "Recherche google",
          color: 16777215,
          description: txt,
          thumbnail: {
            url: icon
          },
          footer: {
            text: "Google",
            icon_url: "https://theotime.me/discord/google.ico"
          }
        }});
      }
    } else {
      msg.channel.send({embed: {
        title: "Recherche google",
        color: 16777215,
        description: "Désolé, aucun résultat n'a été trouvé pour **"+msg.content.replace(prefix+'google ', "")+"**,\nveuillez reformuler votre requête.",
        footer: {
          text: "Google",
          icon_url: "https://theotime.me/discord/google.ico"
        }
      }});
    }
  });
}

if (msg.content.startsWith(Prefix + "meteo")) {

  let mot = msg.content.split(" ").slice(1);
  if(!mot[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **ville**")
  request("https://www.prevision-meteo.ch/services/json/"+mot, function(error, response, body) {
    try{
    let json = JSON.parse(body),
      icon = json.current_condition.icon_big,
      temp = json.current_condition.tmp,
      humd = json.current_condition.humidity,
      cond = json.current_condition.condition,
      pres = json.current_condition.pressure;
      msg.channel.send({embed: {
        title: "Météo",
        color: 16777215,
        description: "Il fait **"+temp+"°C** à **"+mot+"** et il fait **"+cond+"**.\nL'humidité est de **"+humd+"%** et la pression atmosphérique est de **"+pres+"**.",
        thumbnail: {
          url: icon
        },
        footer: {
          text: "www.prevision-meteo.ch",
          icon_url: "https://www.prevision-meteo.ch/favicon.ico"
        }
      }});
    }catch(err){
      msg.channel.send("<:false:565554162113445901> | Erreur: **Ville Introuvable**")
    }
  });
}

//desc
if(msg.content.startsWith(Prefix + "desc")){
  let Member = msg.mentions.users.first() || msg.member;
  if(!Member) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention**")
  var profildb = pfdb.get("desc").filter({user: Member.id}).find("desc").value();
  var userprofil = Object.values(profildb);
  const desc_embeds = new Discord.RichEmbed()
    .setDescription(`:pushpin: Profil de ${Member}`)
    .setColor("ff0000")
    .addField("📋 Description ","`"+`${userprofil[1]}` +"`")
  msg.channel.send(desc_embeds);
}
//set desc
if(msg.content.startsWith(Prefix + "setdesc")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!mot[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**")
  msg.delete();
  pfdb.get('desc').find({user: msgauthors}).assign({user: msgauthors,desc: args}).write();
  msg.channel.send("<:true:569614358359834635> Description changé ")
}

if(msg.content.startsWith(Prefix + "prefix")){
  
  let mot = msg.content.split(" ").slice(1);
  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));
  if(!prefixes[msg.guild.id]){
    prefixes[msg.guild.id] = {
      prefixes: "+"
    };
  }
  let prefix = prefixes[msg.guild.id].prefixes;
  console.log(prefix);
  msg.channel.send(prefix)
  if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.reply("<:false:565554162113445901> | Erreur: **MANAGE_GUILD**");
  if(!mot[0]) return msg.reply("<:false:565554162113445901> | Erreur: **Future Prefixe**");
    prefixes[msg.guild.id] = {
      prefixes: mot[0]
    };
    fs.writeFile("./prefixes.json", JSON.stringify(prefixes),(err) =>{
      if(err) console.log(err)
    })
    let Prefix_embed = new Discord.RichEmbed()
      .setColor("#FF9900")
      .setTitle("Nouveau Prefix")
      .setDescription(`nv: ${mot[0]}`)
    msg.channel.send(Prefix_embed);
}
if(msg.content.startsWith(Prefix + "8ball")){
   if (!args[1]) return msg.reply("Tu n'as pas posé de question !");

  let replies = ["Oui", "Non", "Peux être", "Je ne sais pas", "C'est impossible !", "Probablement..", "Hors de question !", "Pourquoi pas?"]
  let question = args.slice(1).join(" ");
  let res = Math.floor((Math.random() * replies.length));

  let bembed = new Discord.RichEmbed()
      .setColor('#cee4e6')
      .setTitle("🤖8Ball🤖")
      .setFooter("© OrangeWorld 2018")
      .addField(`Question de ${msg.author.tag}`, question)
      .addField("Réponse : ", replies[res])
      msg.channel.sendEmbed(bembed);
}

//note
if(msg.content.startsWith(Prefix + "note")){
  var msgauthors = msg.author.id;
  if(msg.author.bot)return;
  if(!pfdb.get("note").find({user: msgauthors}).value()){
    pfdb.get('note').push({user: msgauthors, note: "Aucune Note."}).write();
  }
  var profildb = pfdb.get("note").filter({user: msgauthors}).find("note").value();
  var userprofil = Object.values(profildb);
  msg.channel.send("<:true:569614358359834635> Envoyer en Message Priver")
  const desc_embeds = new Discord.RichEmbed()
    .setDescription(`:pushpin: Voici ta Note`)
    .setColor("ff0000")
    .addField("📋 Note ","`"+`${userprofil[1]}` +"`")
  msg.author.send(desc_embeds);
}
//new note
if(msg.content.startsWith(Prefix + "newnote")){

  var msgauthors = msg.author.id;
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!mot[0]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**")
  msg.delete();
  pfdb.get('note').find({user: msgauthors}).assign({user: msgauthors,note: " " +args}).write();
  msg.channel.send("<:true:569614358359834635> Note changé ")
}
//tempmute
if(msg.content.startsWith(Prefix + "tempmute")){
  let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
  if(!tomute) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention**");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Je n'ai pas la permission de mute ce membre**");
  let muterole = msg.guild.roles.find(`name`, "mute");
  if(!muterole){
    try{
      muterole = msg.guild.createRole({
        name: "mute",
        color: "#000000",
        permissions:[]
      })
      msg.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  let mutetime = args[1];
  if(!mutetime) return msg.channel.send("<:false:565554162113445901> | Erreur: **Temps Indefini!");

  tomute.addRole(muterole.id);
  msg.channel.send(`<@${tomute.id}> est mute pendant **${ms(ms(mutetime))}**`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    msg.channel.send(`<@${tomute.id}> est **unmute**!`);
  }, ms(mutetime));
}
//ascii
if(msg.content.startsWith(Prefix + "ascii")){
  let mot = msg.content.split(" ").slice(1);
  let args2 = mot.slice(0).join(' ');
  if(!args2) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  ascii.font(args.join(' ').slice(6),'Doom',function(rendered) {

    rendered = rendered.trimRight();
    if(rendered.length > 1200) return msg.channel.send('<:false:565554162113445901> | Erreur: **Message Trop Long**');
    try{
    msg.channel.send(rendered,{
      code: 'md'
    })
  }catch(err){}
  })

}
//developpeur
//add-vip
/*if(msg.content.startsWith(Prefix + "add-vip")){
  if(msg.author.username === idcrateur) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission Créateur**")
  let tovip = msg.mentions.users.first()
  if(!tovip) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention**")
  if(vip.get("vip").find({user: tovip.id}).value()) return msg.channel.send("<:false:565554162113445901> | Erreur: **Membre Déjà Premium**") 
  if(!vip.get("vip").find({user: tovip.id}).value()){
    msg.channel.send(`<:true:569614358359834635> Succès: **${tovip.username}** est Devenu **Premium**`)
    vip.get('vip').push({user: tovip.id, vip: "true"}).write();
  }
}
//remove-vip
if(msg.content.startsWith(Prefix + "remove-vip")){
  if(msg.author.username === idcrateur) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission Créateur**");
  let tovip = msg.mentions.users.first()
  if(!tovip) return msg.channel.send("<:false:565554162113445901> | Erreur: **Mention**")
  if(!vip.get("vip").find({user: tovip.id}).value()) return msg.channel.send("<:false:565554162113445901> | Erreur: **Membre pas Premium**") 
  if(vip.get("vip").find({user: tovip.id}).value()){
    msg.channel.send(`<:true:569614358359834635>Succès: **${tovip.username}** n'est plus **Premium**`)
    vip.get('vip').remove({user: tovip.id,vip: "true"}).write()
  }

}*/
//setcolorembed
if(msg.content.startsWith(Prefix + "setembedcolor")){ 
  if(!vip.get("vip").find({user: msg.author.id}).value()) return msg.channel.send('<:false:565554162113445901> | Erreur: **Non Premium**');
  if(!args[1]) return msg.channel.send("<:false:565554162113445901> | Erreur: **Entrer une Couleur** Exemple: " + Prefix + "setembedcolor 33DDFF");
  try{
    const embed_embed = new Discord.RichEmbed()
      .setColor(args[1])
      .setDescription("<:true:569614358359834635> Succès:")
      .addField("Nouvelle Couleur:",args[1])
    msg.channel.send(embed_embed)
    if(!vip.get("color").find({user: msg.author.id}).value()){
      vip.get('color').push({user: msg.author.id, color: args[1]}).write();
    }
    if(vip.get("color").find({user: msg.author.id}).value()){
      vip.get('color').find({user: msg.author.id}).assign({user: msg.author.id, color: args[1]}).write();
    }
  }catch(err){
    msg.channel.send("<:false:565554162113445901> | Erreur: **Couleur Invalide**")
  }
}
//psay
if(msg.content.startsWith(Prefix + "psay")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!vip.get("vip").find({user: msg.author.id}).value()) return msg.channel.send('<:false:565554162113445901> | Erreur: **Non Premium**');
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if(vip.get('color').filter({user: msg.author.id}).find('color').value()){
  var vipdb = vip.get('color').filter({user: msg.author.id}).find('color').value();
  var usercolor = Object.values(vipdb)
  }
  if(!usercolor){ 
  const say_embed = new Discord.RichEmbed()
    .setAuthor(`${msg.author.username}`, msg.author.avatarURL)
    .setColor("RANDOM")
    .setDescription(args)
  msg.channel.send(say_embed)
}else{
  const say_embed = new Discord.RichEmbed()
  .setAuthor(`${msg.author.username}`, msg.author.avatarURL)
  .setColor(usercolor[1])
  .setDescription(args)
msg.channel.send(say_embed)
}
}
if(msg.content.startsWith(Prefix + "lock")){
  if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("<:false:565554162113445901> | Erreur: **MANAGE_GUILD**");
  let lockReason = args.join(' ').slice(5);
  if(!lockReason) return msg.channel.send("<:false:565554162113445901> | Erreur: **Raison**")
    msg.channel.overwritePermissions(msg.guild.id, {
      SEND_MESSAGES: false
  });
  const lock_embed = new Discord.RichEmbed()
    .setColor("ff0000")
    .setTitle(":lock: **Salon Verrouillé:**")
    .addField("__Salon:__ " , "**Fermé**")
    .addField("__Raison:__" , lockReason)
    .setTimestamp();
  msg.channel.send(lock_embed)
}
if(msg.content.startsWith(Prefix + "unlock")){
  if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("<:false:565554162113445901> | Erreur: **MANAGE_GUILD**");
    msg.channel.overwritePermissions(msg.guild.id, {
      SEND_MESSAGES: true,
      ADD_REACTIONS: true
  });
  const lock_embed = new Discord.RichEmbed()
    .setColor("0x27EA00")
    .setTitle(":unlock: **Salon Déverrouillé:**")
    .addField("__Salon:__ ","**Ouvert**")
    .setTimestamp();
  msg.channel.send(lock_embed)
}

//bvp
if(msg.content.startsWith(Prefix + "bvp")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  if(!managesdb.get("bvp").find({server: msg.guild.id}).value()){
    managesdb.get('bvp').push({server: msg.guild.id, message: args}).write();
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien enregistrer le message de Bienvenue")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
  }else{
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien actualiser le message de Bienvenue")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
    managesdb.get('bvp').find({server: msg.guild.id}).assign({server: msg.guild.id,message: args}).write();
  }
}
if(msg.content.startsWith(Prefix + "aup")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  if(!managesdb.get("aup").find({server: msg.guild.id}).value()){
    managesdb.get('aup').push({server: msg.guild.id, message: args}).write();
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien enregistrer le message d'Aurevoir")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
  }else{
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien actualiser le message d'Aurevoir")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
    managesdb.get('aup').find({server: msg.guild.id}).assign({server: msg.guild.id,message: args}).write();
  }
}
//chbp
if(msg.content.startsWith(Prefix + "chbp")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  if(args.includes("#"))return msg.channel.send("<:false:565554162113445901> | Erreur: **Il ne faut pas Mettre __#__**")
  if(!msg.guild.channels.find("name", args)) return msg.channel.send("<:false:565554162113445901> | Erreur: **Channel Inexistant**")
  if(!managesdb.get("channelb").find({server: msg.guild.id}).value()){
    managesdb.get('channelb').push({server: msg.guild.id, channel: args}).write();
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien enregistrer le channel de Bienvenue")
      .addField("Message:",`#${args}`)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
  }else{
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien actualiser le channel de Bienvenue")
      .addField("channel:",`#${args}`)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
    managesdb.get('channelb').find({server: msg.guild.id}).assign({server: msg.guild.id,channel: args}).write();
  }
}
//chap
if(msg.content.startsWith(Prefix + "chap")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  if(args.includes("#"))return msg.channel.send("<:false:565554162113445901> | Erreur: **Il ne faut pas Mettre __#__**")
  if(!msg.guild.channels.find("name", args)) return msg.channel.send("<:false:565554162113445901> | Erreur: **Channel Inexistant**")
  if(!managesdb.get("channela").find({server: msg.guild.id}).value()){
    managesdb.get('channela').push({server: msg.guild.id, channel: args}).write();
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien enregistrer le channel d'Aurevoir")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
  }else{
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien actualiser le channel d'Aurevoir")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
    managesdb.get('channela').find({server: msg.guild.id}).assign({server: msg.guild.id,channel: args}).write();
  }
}
//rop
if(msg.content.startsWith(Prefix + "rop")){
  let mot = msg.content.split(" ").slice(1);
  let args = mot.slice(0).join(' ');
  let role = msg.guild.roles.find("name", args)
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("<:false:565554162113445901> | Erreur: **Permission ADMINISTRATOR**");
  if(!args) return msg.channel.send("<:false:565554162113445901> | Erreur: **Message**");
  if(args.includes("@"))return msg.channel.send("<:false:565554162113445901> | Erreur: **Il ne faut pas Mettre __@__**")
  if(!role) return msg.channel.send("<:false:565554162113445901> | Erreur: **Role Introuvable**");
  if(!managesdb.get("role").find({server: msg.guild.id}).value()){
    managesdb.get('role').push({server: msg.guild.id, role: role.id}).write();
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien enregistrer le role de Base (ajouter quand la perssonne rejoint)")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
  }else{
    const msgp_embed = new Discord.RichEmbed()
      .setTitle("<:true:569614358359834635> Succès")
      .setDescription("Vous avez bien actualiser le role de Base (ajouter quand la perssonne rejoint)")
      .addField("Message:",args)
      .setColor("0x27EA00")
    msg.channel.send(msgp_embed)
    managesdb.get('role').find({server: msg.guild.id}).assign({server: msg.guild.id,role: args}).write();
  }
}
if(msg.content.startsWith(Prefix + "reactrole")){
  const a = msg.guild.roles.find("name", args[1])
  const b = msg.guild.roles.find("name", args[2])
  const c = msg.guild.roles.find("name", args[3])

  const filter = (reaction,user) => ['✅','❌','🔘'].includes(reaction.emoji.name) && user.id === msg.author.id;
  const react_embed = new Discord.RichEmbed()
    .setTitle("Voici les Rôles Disponible:")
    .setDescription(`
    
    ✅ ${a.toString()}
    ❌ ${b.toString()}
    🔘 ${c.toString()}
    `)
    .setColor("Oxdd9323")
    .setFooter(`ID: ${msg.author.username}`)
  msg.channel.send(react_embed)
  .then(function (msg){
    msg.react("✅")
    msg.react("❌")
    msg.react("🔘")

    msg.awaitReactions(filter, {
      max: 1,
      time: 30000,
      errors: ["time"]
    }).then(collected =>{

      const reaction = collected.first();

      switch(reaction.emoji.name){
        case '✅':
        
          member.addRole(a).catch(err =>{
            console.log(err)
            return msg.channel.send("Erreur")
          });
          msg.channel.send("Rôle ajouter").then(m => m.delete(3000));
          break;
        case '❌':
          msg.member.addRole(b).catch(err =>{
            console.log(err)
            return msg.channel.send("Erreur")
          });
          msg.channel.send("Rôle ajouter").then(m => m.delete(3000));
          break;
        case '🔘':
          msg.member.addRole(c).catch(err =>{
            console.log(err)
            return msg.channel.send("Erreur")
          });
          msg.channel.send("Rôle ajouter").then(m => m.delete(3000));
          break;
      }
    }).catch(collected =>{
      return msg.channel.send("Erreur")
    });
  });
}
});


    



bot.login('NTczOTIwNjAxMzkyMDIxNTA1.XMx6ig.RfejEhXugaX488wbAi346zbi8SY');

