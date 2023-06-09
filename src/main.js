import { Telegraf, session  } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import { ogg } from './ogg.js'
import { openai } from './openai.js'
import { removeFile } from './utils.js'
import dotenv from 'dotenv';

dotenv.config();


const INITIAL_SESSION = {
    messages: [],
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.use(session())

bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('I am ready to chat!')
})

bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Waiting for your new message...')
})


bot.on(message('voice'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('קיבלתי את ההודעה שלך...'))
      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
      const userId = String(ctx.message.from.id)
      const oggPath = await ogg.create(link.href, userId)
      const mp3Path = await ogg.toMp3(oggPath, userId)
      removeFile(oggPath)
      const text = await openai.transcription(mp3Path)
      await ctx.reply(code(`ההודעה שלך: ${text}`))

      ctx.session.messages.push({role: openai.roles.USER, content: text})
      
      const response = await openai.chat(ctx.session.messages)

      ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.content})

      await ctx.reply(response.content)

    } catch (e) {
      console.error(`Error while proccessing voice message`, e.message)
    }
})

bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
      await ctx.reply(code('קיבלתי את ההודעה שלך...'))

      ctx.session.messages.push({role: openai.roles.USER, content: ctx.message.text})
      
      const response = await openai.chat(ctx.session.messages)

      ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.content})

      await ctx.reply(response.content)

    } catch (e) {
      console.error(`Error while proccessing voice message`, e.message)
    }
})


bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))