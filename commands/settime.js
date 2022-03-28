const momentTimezone = require('moment-timezone')

const scheduledSchema = require('../models/scheduled-schema')

module.exports = {
    expectedArgs: '<HH:MM> <"AM" or "PM">',
    minArgs: 2,
    maxArgs: 2,
    init: (client) => {
        const checkForPosts = setInterval( async() => {
            const query = {
                date: {
                    $lte: Date.now()
                }
            }

            const results = await scheduledSchema.find(query)

            for (const post of results) {
                const { guildId, channelId, authorId, messageId, time, clockType } = post

                const content = 'Time to Water the Plants!'
                
                const guild = await client.guilds.fetch(guildId)
                if (!guild) {
                  continue
                }

                const channel = await guild.channels.cache.get(channelId)
                if (!channel) {
                  continue
                }

                const message = await channel.messages.fetch(messageId)
                if (!message) {
                  continue
                }

                message.reply(content)
                .then ((msg) => (setTimeout(function(){
                  msg.react('✅')
                }, 1000)))

                const backup = setTimeout(function(){
                  message.reply(content)
                  .then ((msg) => (setTimeout(function(){
                    msg.react('✅')
                  }, 1000)))
                }, 1000 * 60 * 5)

                client.on('messageReactionAdd', (reaction,user) => {
                  if(user.bot) return
                  if(reaction.emoji.name !== "✅") return
                  if(user.id !== message.author.id) return
                  if(reaction.message.channel.id !== message.channel.id) return
                  message.reply('Confirmed')
                  clearTimeout(backup)
                })






              
              //schedule new message
              const newDate = new Date()
              const pst = newDate.toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
              })
      
              const firstDate = pst.substr(0,pst.indexOf(','))
          
              const [month,day,year] = firstDate.split('/')
              const date = [year,month,parseInt(day)+1].join('/')

              const timeZone = 'America/Los_Angeles'
  
              const targetDate = momentTimezone.tz(
              `${date} ${time} ${clockType}`,
              'YYYY/MM/DD HH:mm A', 
              timeZone
              )

              await new scheduledSchema({
                date: targetDate.valueOf(),
                guildId: guild.id,
                channelId: channel.id,
                authorId: message.author.id,
                messageId: message.id,
                time: time,
                clockType: clockType,
              }).save()
              
            }

            //delete old message
            await scheduledSchema.deleteMany(query)


            
        }, 1000 * 10)
    },
    callback: async ({ message, args }) => {
        const { mentions, guild, channel } = message

        const [time, clockType] = args

        //checks if user imput correct format
        if (clockType !== 'AM' && clockType !== 'PM') {
            message.reply(`You must provide either "AM" or "PM", you provided "${clockType}"`)
            return
        }
      
        //gets current date
        const newDate = new Date()
        const pst = newDate.toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
        })

        const firstDate = pst.substr(0,pst.indexOf(','))
      
        const [month,day,year] = firstDate.split('/')
        const date = [year,month,day].join('/')
          
      
        //gets timezone
        const timeZone = 'America/Los_Angeles'

        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            'YYYY/MM/DD HH:mm A', 
            timeZone
        )


        await new scheduledSchema({
            date: targetDate.valueOf(),
            guildId: guild.id,
            channelId: channel.id,
            authorId: message.author.id,
            messageId: message.id,
            time: time,
            clockType: clockType,
        }).save()

        message.reply(`Message is scheduled for ${time} ${clockType}`)
    }
}
