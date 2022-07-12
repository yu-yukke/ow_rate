'use strict';

const overwatch = require('overwatch-api');

const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const token = process.env.TOKEN;

// ready
client.once('ready', () => {
  console.log('ready...');
});

// Botの参加しているチャンネル(DM含む)に発言があったとき
client.on('message', (message) => {
  const accounts = {
    ykk: {
      name: 'ykk',
      tag: '#1820',
      region: 'global',
    },
    ASLEEP: {
      name: 'ASLEEP',
      tag: '#31206',
      region: 'global',
    },
    REINHARDT: {
      name: 'REINHARDT',
      tag: '#12358',
      region: 'global',
    },
    ごまめ: {
      name: 'ごまめ',
      tag: '#1776',
      region: 'global',
    },
    Dyson: {
      name: 'Dyson',
      tag: '#11632',
      region: 'global',
    },
    人間失格: {
      name: '人間失格',
      tag: '#11766',
      region: 'global',
    },
    hnkm: {
      name: 'hnkm',
      tag: '#1181',
      region: 'global',
    },
    taniryu: {
      name: 'taniryu',
      tag: '#1958',
      region: 'global',
    },
    ayane: {
      name: 'ayane',
      tag: '#11738',
      region: 'global',
    },
    唯我独尊丸: {
      name: '唯我独尊丸',
      tag: '#3271',
      region: 'global',
    },
    ゆう: {
      name: 'ゆう',
      tag: '#3475',
      region: 'global',
    },
    aony: {
      name: 'aony',
      tag: '#11417',
      region: 'global',
    },
  };

  // Bot自身の発言を無視
  if (message.author.bot) return;

  const args = message.content.split(/ +/);

  if (args[0] === 'rate') {
    let account = accounts[args[1]];

    if (account === undefined) {
      return message.channel.send(
        '正しい名前で入力するor名前がスクリプトに登録されていないので確認してくださいな'
      );
    }

    let tag = account.name + account.tag.replace('#', '-'),
      region = account.region,
      platform = 'pc';

    const owGetProf = new Promise(function (resolve, reject) {
      overwatch.getProfile(platform, region, tag, (err, data) => {
        err ? reject() : resolve(data);
      });
    });

    const owGetStats = new Promise(function (resolve, reject) {
      overwatch.getStats(platform, region, tag, (err, data) => {
        err ? reject() : resolve(data);
      });
    });

    Promise.all([owGetProf, owGetStats])
      .then((result) => {
        const playerName = tag.replace('-', '#');
        const profile = result[0],
          stats = result[1];
        const weekday = ['日', '月', '火', '水', '木', '金', '土'];
        const dateToday = new Date();
        const date =
          dateToday.getFullYear() +
          '年' +
          (dateToday.getMonth() + 1) +
          '月' +
          dateToday.getDate() +
          `日(${weekday[dateToday.getDay()]})`;
        const embedStats = new MessageEmbed()
          .setColor('#eaeaea')
          .setTitle(`Stats for ${playerName}`)
          .setURL(
            `https://playoverwatch.com/ja-jp/career/${platform}/${playerName.replace(
              '#',
              '-'
            )}`
          )
          .setDescription(`${date}の成績だよ。明日も頑張れよ。`)
          .setAuthor('Overwatch 2', profile.portrait)
          .setThumbnail(profile.portrait)
          .addFields(
            {
              name: '[アカウント情報]',
              value:
                `プレイヤー名: **${profile.username}**\n` +
                `レベル: **${profile.level}**`,
            },
            {
              name: '[レート]',
              value:
                `TANK: **${profile.competitive.tank.rank}**\n` +
                `DPS: **${profile.competitive.damage.rank}**\n` +
                `SUPPORT: **${profile.competitive.support.rank}**`,
            },
            {
              name: '[戦績]',
              value:
                `勝利: **${profile.games.competitive.won}**\n` +
                `敗北: **${profile.games.competitive.lost}**\n` +
                `引き分け: **${profile.games.competitive.draw}**\n` +
                `勝率: **${(
                  (profile.games.competitive.won /
                    (profile.games.competitive.won +
                      profile.games.competitive.lost)) *
                  100
                ).toFixed(2)}%**`,
            },
            {
              name: '[使用ヒーロー]',
              value:
                `1. **${stats.stats.top_heroes.competitive.played[0].hero}** - ${stats.stats.top_heroes.competitive.played[0].played}\n` +
                `2. **${stats.stats.top_heroes.competitive.played[1].hero}** - ${stats.stats.top_heroes.competitive.played[1].played}\n` +
                `3. **${stats.stats.top_heroes.competitive.played[2].hero}** - ${stats.stats.top_heroes.competitive.played[2].played}`,
            }
          )
          .setImage(profile.competitive.rank_img)
          .setTimestamp()
          .setFooter('Overwatch 2', message.client.user.avatarURL);

        message.channel.send({ embeds: [embedStats] });
      })
      .catch(() => {
        return message.channel.send('戦績公開してくれよな！');
      });
  }
});

// Discordに接続
client.login(token);
