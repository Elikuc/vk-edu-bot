const express = require('express');
const bodyParser = require('body-parser');
const { VK } = require('vk-io');

const app = express();
app.use(bodyParser.json());

const vk = new VK({ token: process.env.VK_TOKEN });

const BAD_WORDS = ['блин', 'капец', 'чёрт', 'тупой', 'идиот', 'блять', 'пиздец'];

app.post('/callback/xE4sA', async (req, res) => {
  const { type, group_id, secret, object } = req.body;

  if (type === 'confirmation') {
    return res.send(process.env.VK_CONFIRMATION_CODE);
  }

  if (type === 'message_new' && secret === process.env.VK_SECRET) {
    const message = object.message.text.toLowerCase();
    const userId = object.message.from_id;

    let response = 'Извините, я пока не знаю ответа. Попробуйте посмотреть на сайте https://education.vk.company';

    if (BAD_WORDS.some(word => message.includes(word))) {
      response = 'Пожалуйста, соблюдайте нормы общения 🙂';
    } else if (message.includes('как выбрать проект')) {
      response = 'Перейдите на https://education.vk.company и выберите интересный вам проект.';
    } else if (message.includes('вебинар') || message.includes('расписание')) {
      response = 'Расписание вебинаров доступно на сайте https://education.vk.company в соответствующем разделе.';
    } else if (message.includes('какой файл') || message.includes('что загружать')) {
      response = 'Необходимо загрузить решение в соответствии с инструкциями на сайте.';
    } else if (message.includes('несколько проектов') || message.includes('два проекта')) {
      response = 'Да, можно взять несколько проектов.';
    }

    await vk.api.messages.send({
      peer_id: userId,
      message: response,
      random_id: Date.now()
    });

    return res.send('ok');
  }

  res.send('ok');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
