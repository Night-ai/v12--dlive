const fs=require('fs');
const Discord=require("discord.js");
const client=new Discord.Client();
const db = require('quick.db')
const moment = require("moment");
const ayarlar=require("./ayarlar.json");
const express = require('express');
/////
const app = express()
app.get('/', (req, res) => res.send("Bot Aktif"))
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT))
//////////////////

client.on('ready', () => {
 client.user.setActivity(`${client.guilds.size} Sunucu + ${client.users.size} Kullanıcı!`);
})

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} Kullanıcı Adıyla Giriş Yaptı!`);
});

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    if (db.fetch(`cokaradalistere_${message.author.id}`)) return message.channel.send("Olamaz sen botun karalistesinde bulunuyorsun botu kullanamazsın.")
    cmd.run(client, message, params, perms);
  }
})




const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

  
client.yetkiler = message => {
  if(!message.guild) {
	return; }
  let permlvl = -ayarlar.varsayilanperm  ;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if(message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};



client.on("message", async msg => {
    if(msg.author.bot) return;
    
    let i = await db.fetch(`reklamFiltre_${msg.guild.id}`)  
          if (i == 'acik') {
              const reklam = ["https://","http://","discord.gg"];
              if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                  if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    msg.delete();                                       
                    return msg.channel.send(`${msg.author.tag}, Reklam Yapmak Yasak!`).then(msg => msg.delete(10000));
                  }              
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!i) return;
          });    


client.on("message", async msg => {
 
 
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {
 
                  return msg.reply(
                    'Aleyküm Selam, Hoşgeldin')
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
   
    }
    if (!i) return;
 
    });

client.login(ayarlar.token)
//afk//
client.on("message" , async message => {
  const msg = message;
  if(message.content.startsWith(ayarlar.prefix+"afk")) return; 
  /*db.set(`afkSebep_${message.author.id}_${message.guild.id}`, "Sebep Girilmemiş")
  db.set(`afkKisi_${message.author.id}_${message.guild.id}`, message.author.id)           
  db.set(`afkAd_${message.author.id}_${message.guild.id}`, message.author.username)*/
  
  let afk = message.mentions.users.first()
  
  const kisi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`)
  
  const isim = db.fetch(`afkAd_${message.author.id}_${message.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${message.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${message.guild.id}`)
   if(message.content.includes(kisi3)){
     const embed = new Discord.MessageEmbed()
      .setColor("#0080FF")
      .setAuthor("" , client.user.avatarURL())
      .setDescription(`Etiketlediğiniz Kişi Afk \n Sebep : ${sebep}`)
      .setTimestamp()
      .setFooter(`${message.author.username} Tarafından İstendi`)
       message.channel.send(embed)
   }
 }
  if(message.author.id === kisi){
    const embed = new Discord.MessageEmbed()
      .setColor("#0080FF")
      .setAuthor("" , client.user.avatarURL())
      .setDescription(`Afk'lıktan Çıktınız`)
      .setTimestamp()
      .setFooter(`${message.author.username} Tarafından İstendi`)
       message.channel.send(embed)
   db.delete(`afkSebep_${message.author.id}_${message.guild.id}`)
   db.delete(`afkid_${message.author.id}_${message.guild.id}`)
   db.delete(`afkAd_${message.author.id}_${message.guild.id}`)
    message.member.setNickname(isim)
    
  }
client.on("message", async message => {
    let uyarisayisi = await db.fetch(`reklamuyari_${message.author.id}`);
    let reklamkick = await db.fetch(`reklamkick_${message.guild.id}`)
    let kullanici = message.member;
    if (reklamkick == 'kapali') return;
    if (reklamkick == 'acik') {
        const reklam = ["discord.app", "discord.gg", "invite", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
        if (reklam.some(word => message.content.toLowerCase().includes(word))) {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                message.delete();
                db.add(`reklamuyari_${message.author.id}`, 1) //uyarı puanı ekleme
                if (uyarisayisi === null) {
                    let uyari = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL())
                        .setDescription(`<@${message.author.id}> reklam kick sistemine yakalandın! Reklam yapmaya devam edersen kickleniceksin (1/3)`)
                        .setTimestamp()
                    message.channel.send(uyari)                
}
                if (uyarisayisi === 1) {
                    let uyari = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL())
                        .setDescription(`<@${message.author.id}> reklam kick sistemine yakalandın! Reklam yapmaya devam edersen kickleniceksin (2/3)`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }
                if (uyarisayisi === 2) {
                    message.delete();
                    await kullanici.kick({
                        reason: `Reklam kick sistemi`,
                    })
                    let uyari = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL())
                        .setDescription(`<@${message.author.id}> 3 adet reklam uyarısı aldığı için kicklendi. Bir kez daha yaparsa banlanacakç`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }
                if (uyarisayisi === 3) {
                    message.delete();
                    await kullanici.members.ban({
                        reason: `Reklam ban sistemi`,
                    })
                    db.delete(`reklamuyari_${message.author.id}`)
                    let uyari = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setFooter('Reklam kick sistemi', client.user.avatarURL())
                        .setDescription(`<@${message.author.id}> kick yedikten sonra tekrar devam ettiği için banlandı.`)
                        .setTimestamp()
                    message.channel.send(uyari)
                }

            }
        }
    }
});

client.on("message", msg => {
  var dm = client.users.cache.get("748497573316264027"); 
  if (msg.author.id === client.user.id) return
  if (msg.channel.type === "dm") {
  const DMEmbed = new Discord.MessageEmbed()
  .setTitle('Bir Mesaj Geldi!')
  .setAuthor(msg.author.tag, msg.author.avatarURL({size: 1024}))
  .setDescription(`${msg.content}`)
  .setThumbnail(msg.author.avatarURL({size: 1024}))
  dm.send(DMEmbed)}
  if (msg.channel.bot) return});
client.on('message', async msg => { 
if (msg.content.toLowerCase() === 'sa') { 
await msg.react('🇦'); 
msg.react('🇸'); 
} 
});

client.on('message', async msg => { 
if (msg.content.toLowerCase() === 'selam') { 
await msg.react('🇦'); 
msg.react('🇸'); 
} 
}); 

client.on('message', async msg => { 
if (msg.content.toLowerCase() === 'selamın aleyküm') { 
await msg.react('🇦'); 
msg.react('🇸'); 
} 
}); 

client.on('message', async msg => { 
if (msg.content.toLowerCase() === 'selamun aleyküm') { //ENDLESSCODE
await msg.react('🇦'); 
msg.react('🇸'); 
} 
});
client.on("message", async msg => {
    if (msg.channel.type === "dm") return;
      if(msg.author.bot) return;  
        if (msg.content.length > 4) {
         if (db.fetch(`capslock_${msg.guild.id}`)) {
           let caps = msg.content.toUpperCase()
           if (msg.content == caps) {
             if (!msg.member.hasPermission("ADMINISTRATOR")) {
               if (!msg.mentions.users.first()) {
                 msg.delete()
                 return msg.channel.send(`:x: ${msg.author}, bre susak capslock kapat.`).then(m => m.delete(5000))
     }
       }
     }
   }
  }
});
client.on('guildDelete', guild => {

let rrrsembed = new Discord.MessageEmbed()

.setColor("RED")
.setTitle(" Bot Kicklendi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.cache.get('761630438762479646').send(rrrsembed);

});
//Cross

client.on('guildCreate', guild => {

let rrrsembed = new Discord.MessageEmbed()

.setColor("GREEN")
.setTitle(" Bot Eklendi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.cache.get('761630438762479646').send(rrrsembed);

});
client.on("message", async msg => {
  
  
 const i = await db.fetch(`kufur_${msg.guild.id}`)
    if (i == "acik") {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});